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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function canEdit(
  role?: string
) {
  return (
    role === "main" ||
    role === "blogger"
  );
}

/*
 * =================================
 * EDIT WORD OF THE WEEK
 * =================================
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const session =
    await getAdminSession();

  if (
    !session ||
    !canEdit(
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
    id,
  } =
    await context.params;

  if (
    !/^\d+$/.test(
      id
    )
  ) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Invalid Word of the Week entry.",
      },
      {
        status: 400,
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

    /*
     * The authenticated admin role
     * now authorizes editing.
     *
     * We deliberately do NOT read,
     * expose or require edit_code here.
     */
    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "WordOfTheWeekBank"
      )
      .update({
        title,

        author:
          author ||
          null,

        content,
      })
      .eq(
        "id",
        Number(id)
      )
      .select(`
        id,
        title,
        author,
        content,
        created_at
      `)
      .maybeSingle();

    if (
      error
    ) {
      console.error(
        "Unable to update Word of the Week:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "The Word of the Week could not be updated.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !data
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Word of the Week entry not found.",
        },
        {
          status: 404,
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
      "Word of the Week update error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "The Word of the Week could not be updated.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =================================
 * DELETE WORD OF THE WEEK
 *
 * MAIN ADMIN ONLY
 * =================================
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const session =
    await getAdminSession();

  if (
    !session ||
    session.role !==
      "main"
  ) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Only the main administrator can permanently delete Word of the Week entries.",
      },
      {
        status: 403,
      }
    );
  }

  const {
    id,
  } =
    await context.params;

  if (
    !/^\d+$/.test(
      id
    )
  ) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Invalid Word of the Week entry.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const body =
      await request.json();

    const deletionPin =
      typeof body.deletionPin ===
      "string"
        ? body.deletionPin.trim()
        : "";

    if (
      !deletionPin
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Deletion password is required.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        "secure_admin_delete",
        {
          input_pin:
            deletionPin,

          target_table:
            "WordOfTheWeekBank",

          target_id:
            Number(id),
        }
      );

    if (
      error
    ) {
      console.error(
        "Word of the Week deletion RPC error:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "The Word of the Week could not be deleted.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      data !== true
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Incorrect deletion password.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (
    error
  ) {
    console.error(
      "Word of the Week deletion error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "The Word of the Week could not be deleted.",
      },
      {
        status: 500,
      }
    );
  }
}