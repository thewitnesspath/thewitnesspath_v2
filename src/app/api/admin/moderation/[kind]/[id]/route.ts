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
  ModerationKind,
} from "@/lib/types/moderation";

type RouteContext = {
  params: Promise<{
    kind: string;

    id: string;
  }>;
};

const TABLES: Record<
  ModerationKind,
  string
> = {
  "testimony-comment":
    "Comments",

  "testimony-reply":
    "CommentReplies",

  "blog-comment":
    "BlogComments",

  "blog-reply":
    "BlogCommentReplies",
};

function isModerationKind(
  value: string
): value is ModerationKind {
  return Object.prototype
    .hasOwnProperty.call(
      TABLES,
      value
    );
}

async function authorize() {
  const session =
    await getAdminSession();

  return (
    session?.role ===
    "main"
  );
}

/*
 * =================================
 * APPROVE
 * =================================
 */
export async function PATCH(
  _request: Request,
  context: RouteContext
) {
  if (
    !(await authorize())
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
    kind,
    id,
  } =
    await context.params;

  if (
    !isModerationKind(
      kind
    ) ||
    !/^\d+$/.test(
      id
    )
  ) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Invalid moderation item.",
      },
      {
        status: 400,
      }
    );
  }

  const table =
    TABLES[
      kind
    ];

  try {
    /*
     * First verify that the item
     * exists so we can return 404
     * instead of treating it as a
     * server failure.
     */
    const {
      data:
        existing,
      error:
        existingError,
    } = await supabaseAdmin
      .from(
        table
      )
      .select(
        "id, is_approved"
      )
      .eq(
        "id",
        Number(
          id
        )
      )
      .maybeSingle();

    if (
      existingError
    ) {
      console.error(
        "Unable to inspect moderation item:",
        existingError.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "This item could not be approved.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !existing
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "This moderation item no longer exists.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Safe against two tabs trying
     * to approve the same item.
     */
    if (
      existing.is_approved ===
      true
    ) {
      return NextResponse.json({
        success: true,

        alreadyApproved:
          true,
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        table
      )
      .update({
        is_approved:
          true,
      })
      .eq(
        "id",
        Number(
          id
        )
      )
      .select(
        "id"
      )
      .maybeSingle();

    if (
      error
    ) {
      console.error(
        "Unable to approve moderation item:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "This item could not be approved.",
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
            "This moderation item no longer exists.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      alreadyApproved:
        false,
    });
  } catch (
    error
  ) {
    console.error(
      "Moderation approval error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "This item could not be approved.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =================================
 * DELETE
 * =================================
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  if (
    !(await authorize())
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
    kind,
    id,
  } =
    await context.params;

  if (
    !isModerationKind(
      kind
    ) ||
    !/^\d+$/.test(
      id
    )
  ) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Invalid moderation item.",
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

    const table =
      TABLES[
        kind
      ];

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
            table,

          target_id:
            Number(
              id
            ),
        }
      );

    /*
     * Database/RPC failure is not
     * the same thing as a bad PIN.
     */
    if (
      error
    ) {
      console.error(
        "Moderation deletion RPC error:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Unable to delete this item.",
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
      "Moderation deletion error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to delete this item.",
      },
      {
        status: 500,
      }
    );
  }
}