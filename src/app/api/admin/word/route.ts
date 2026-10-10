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

/*
 * Keep generating the old
 * 4-character edit code so the
 * existing database/legacy system
 * remains compatible.
 *
 * The value is never returned to
 * the admin browser.
 */
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
 * =================================
 * LOAD WORD BANK
 * =================================
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
        message:
          "Access denied.",
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
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .order(
      "id",
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
    (
      data ?? []
    ).map(
      (item) => ({
        id:
          String(
            item.id
          ),

        title:
          item.title?.trim() ||
          "Word of the Week",

        author:
          item.author?.trim() ||
          "The Witness Team",

        content:
          item.content ??
          "",

        createdAt:
          item.created_at ??
          null,
      })
    );

  /*
   * The newest-created entry remains
   * the currently displayed Word of
   * the Week.
   */
  const latest =
    items[0] ??
    null;

  return NextResponse.json(
    {
      success: true,

      items,

      latest,

      counts: {
        entries:
          items.length,
      },
    },
    {
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    }
  );
}

/*
 * =================================
 * CREATE WORD OF THE WEEK
 * =================================
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

        message:
          "Access denied.",
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

    if (
      titleError
    ) {
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

    if (
      !content
    ) {
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

          /*
           * Preserve the current
           * database behaviour:
           * blank author = null.
           */
          author:
            author ||
            null,

          content,

          /*
           * Legacy compatibility only.
           * Never returned to client.
           */
          edit_code:
            editCode,
        },
      ])
      .select(`
        id,
        title,
        author,
        content,
        created_at
      `)
      .single();

    if (
      error
    ) {
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
        id:
          String(
            data.id
          ),

        title:
          data.title?.trim() ||
          "Word of the Week",

        author:
          data.author?.trim() ||
          "The Witness Team",

        content:
          data.content ??
          "",

        createdAt:
          data.created_at ??
          null,
      },
    });
  } catch (
    error
  ) {
    console.error(
      "Word of the Week creation error:",
      error
    );

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