import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import type {
  GuidanceGroup,
  GuidancePerspective,
  GuidanceQuestion,
} from "@/lib/types/guidance";

export const runtime =
  "nodejs";

function canAccess(
  role?: string
) {
  return (
    role === "main" ||
    role === "counselor"
  );
}

export async function GET() {
  const session =
    await getAdminSession();

  if (
    !session ||
    !canAccess(
      session.role
    )
  ) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 403,
      }
    );
  }

  const [
    questionsResult,
    answersResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("Questions")
      .select(
        `
          id,
          category,
          question,
          created_at
        `
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from("Answers")
      .select(
        `
          id,
          category,
          question,
          answer,
          author,
          views,
          created_at,
          edit_code
        `
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),
  ]);

  if (
    questionsResult.error ||
    answersResult.error
  ) {
    console.error(
      "Unable to load Safe Haven admin data:",
      {
        questions:
          questionsResult.error
            ?.message,

        answers:
          answersResult.error
            ?.message,
      }
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Safe Haven data could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  const answers =
    answersResult.data ?? [];

  /*
   * Keep the same unresolved-question
   * logic as the legacy application.
   */
  const answeredTexts =
    new Set(
      answers
        .map(
          (item) =>
            (
              item.question ??
              ""
            )
              .trim()
              .toLowerCase()
        )
        .filter(Boolean)
    );

  const unanswered: GuidanceQuestion[] =
    (
      questionsResult.data ??
      []
    )
      .filter(
        (item) =>
          !answeredTexts.has(
            (
              item.question ??
              ""
            )
              .trim()
              .toLowerCase()
          )
      )
      .map(
        (item) => ({
          id: String(
            item.id
          ),

          category:
            item.category?.trim() ||
            "General Guidance",

          question:
            item.question?.trim() ||
            "",

          createdAt:
            item.created_at ??
            null,
        })
      );

  /*
   * Group published answers into
   * question → perspectives.
   */
  const grouped =
    new Map<
      string,
      GuidanceGroup
    >();

  for (
    const answer of answers
  ) {
    const question =
      answer.question?.trim() ||
      "";

    if (!question) {
      continue;
    }

    const key =
      question.toLowerCase();

    const perspective:
      GuidancePerspective = {
      id: String(
        answer.id
      ),

      category:
        answer.category?.trim() ||
        "General Guidance",

      question,

      answer:
        answer.answer?.trim() ||
        "",

      author:
        answer.author?.trim() ||
        "The Witness Team",

      views:
        answer.views ?? 0,

      createdAt:
        answer.created_at ??
        null,

      /*
       * Preserve legacy behavior:
       * Main Admin can see edit codes.
       * Counselor does not receive them.
       */
      editCode:
        session.role ===
        "main"
          ? answer.edit_code ??
            null
          : undefined,
    };

    const existing =
      grouped.get(key);

    if (existing) {
      existing.perspectives.push(
        perspective
      );
    } else {
      grouped.set(
        key,
        {
          category:
            perspective.category,

          question,

          perspectives: [
            perspective,
          ],
        }
      );
    }
  }

  const groups =
    Array.from(
      grouped.values()
    ).map(
      (group) => ({
        ...group,

        perspectives:
          group.perspectives.sort(
            (a, b) => {
              const first =
                a.createdAt
                  ? new Date(
                      a.createdAt
                    ).getTime()
                  : 0;

              const second =
                b.createdAt
                  ? new Date(
                      b.createdAt
                    ).getTime()
                  : 0;

              return (
                first -
                second
              );
            }
          ),
      })
    );

  return NextResponse.json(
    {
      success: true,

      unanswered,

      groups,

      counts: {
        unanswered:
          unanswered.length,

        published:
          answers.length,

        questions:
          groups.length,
      },
    },
    {
      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}

/*
 * CREATE ANSWER / ALTERNATIVE PERSPECTIVE
 */
export async function POST(
  request: Request
) {
  const session =
    await getAdminSession();

  if (
    !session ||
    !canAccess(
      session.role
    )
  ) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 403,
      }
    );
  }

  try {
    const body =
      await request.json();

    const category =
      typeof body.category ===
      "string"
        ? body.category.trim()
        : "";

    const question =
      typeof body.question ===
      "string"
        ? body.question.trim()
        : "";

    const answer =
      typeof body.answer ===
      "string"
        ? body.answer.trim()
        : "";

    const author =
      typeof body.author ===
      "string"
        ? body.author.trim()
        : "";

    if (
      !question ||
      !answer
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Question and answer are required.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("Answers")
      .insert([
        {
          category:
            category ||
            "General Guidance",

          question,

          answer,

          author:
            author ||
            "The Witness Team",

          views: 0,
        },
      ])
      .select(
        "id, edit_code"
      )
      .single();

    if (error) {
      console.error(
        "Unable to publish guidance:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "The guidance answer could not be published.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      id:
        String(data.id),

      editCode:
        session.role ===
        "main"
          ? data.edit_code ??
            null
          : undefined,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while publishing the answer.",
      },
      {
        status: 500,
      }
    );
  }
}