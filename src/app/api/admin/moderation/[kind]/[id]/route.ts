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
  return value in TABLES;
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
 * APPROVE
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
      },
      {
        status: 403,
      }
    );
  }

  const {
    kind,
    id,
  } = await context.params;

  if (
    !isModerationKind(kind) ||
    !/^\d+$/.test(id)
  ) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  const table =
    TABLES[kind];

  const {
    data,
    error,
  } = await supabaseAdmin
    .from(table)
    .update({
      is_approved: true,
    })
    .eq(
      "id",
      Number(id)
    )
    .select("id")
    .maybeSingle();

  if (
    error ||
    !data
  ) {
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

  return NextResponse.json({
    success: true,
  });
}

/*
 * DELETE
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
      },
      {
        status: 403,
      }
    );
  }

  const {
    kind,
    id,
  } = await context.params;

  if (
    !isModerationKind(kind) ||
    !/^\d+$/.test(id)
  ) {
    return NextResponse.json(
      {
        success: false,
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

    if (!deletionPin) {
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
      TABLES[kind];

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
            Number(id),
        }
      );

    if (
      error ||
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
  } catch {
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