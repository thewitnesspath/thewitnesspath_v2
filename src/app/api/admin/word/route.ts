import {
  randomInt,
} from "crypto";

import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  validateTitle,
} from "@/lib/validation/content";

export const runtime =
  "nodejs";

function canAccess(
  role?: string
) {
  return (
    role === "main" ||
    role === "blogger"
  );
}

function generateEditCode() {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (
    let index = 0;
    index < 4;
    index++
  ) {
    code +=
      alphabet[
        randomInt(
          0,
          alphabet.length
        )
      ];
  }

  return code;
}

/*
 * LOAD WORD BANK
 */
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

  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      "WordOfTheWeekBank"
    )
    .select(`
      id,
      title,
      author,
      content,
      edit_code,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      "Unable to load Word of the Week bank:",
      error.message
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Word of the Week could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  const items =
  (data ?? []).map(
    (item) => ({
      id: String(
        item.id
      ),

      title:
        item.title?.trim() ||
        "Word of the Week",

      author:
        item.author?.trim() ||
        "The Witness Team",

      content:
        item.content ?? "",

      createdAt:
        item.created_at ??
        null,

      editCode:
        session.role ===
        "main"
          ? item.edit_code ??
            null
          : undefined,
    })
  );

  return NextResponse.json(
    {
      success: true,

      items,

      counts: {
        entries:
          items.length,
      },

      latest:
        items[0] ?? null,
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
 * CREATE WORD OF THE WEEK
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

    const title =
      typeof body.title ===
      "string"
        ? body.title.trim()
        : "";

    const author =
      typeof body.author ===
      "string"
        ? body.author.trim()
        : "";

    const content =
      typeof body.content ===
      "string"
        ? body.content.trim()
        : "";

    const titleError =
      validateTitle(
        title
      );

    if (titleError) {
      return NextResponse.json(
        {
          success: false,
          message:
            titleError,
        },
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Word of the Week content is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Preserve the old
     * 4-character edit-code format,
     * but use cryptographic random
     * generation instead of
     * Math.random().
     */
    const editCode =
      generateEditCode();

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "WordOfTheWeekBank"
      )
      .insert([
        {
          title,

          author:
            author || null,

          content,

          edit_code:
            editCode,
        },
      ])
      .select(`
        id,
        title,
        edit_code
      `)
      .single();

    if (error) {
      console.error(
        "Unable to create Word of the Week:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "The Word of the Week could not be saved.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      item: {
        id: String(
          data.id
        ),

        title:
          data.title,

        editCode:
          session.role ===
          "main"
            ? data.edit_code
            : undefined,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong while saving the Word of the Week.",
      },
      {
        status: 500,
      }
    );
  }
}