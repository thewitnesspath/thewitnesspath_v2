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

function canAccess(
  role?: string
) {
  return (
    role === "main" ||
    role === "blogger"
  );
}

/*
 * EDIT ARTICLE
 */
export async function PATCH(
  request: Request,
  context: RouteContext
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

  const { id } =
    await context.params;

  if (
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

    const title =
      typeof body.title ===
      "string"
        ? body.title.trim()
        : "";

    const category =
      typeof body.category ===
      "string"
        ? body.category.trim()
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

    const editCode =
      typeof body.editCode ===
      "string"
        ? body.editCode.trim()
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

    if (
      !content ||
      !editCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Article content and edit code are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Keep the existing Witness
     * edit-code verification.
     */
    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        "secure_verify_and_edit_content",
        {
          target_table:
            "BlogPosts",

          target_id:
            Number(id),

          input_code:
            editCode,

          new_title:
            title,

          new_category:
            category ||
            "Teaching",

          new_author:
            author ||
            "The Witness Team",

          new_content:
            content,
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
            "Incorrect edit code.",
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
          "The article could not be updated.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * DELETE ARTICLE
 */
export async function DELETE(
  request: Request,
  context: RouteContext
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

  const { id } =
    await context.params;

  if (
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
            "BlogPosts",

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
          "The article could not be deleted.",
      },
      {
        status: 500,
      }
    );
  }
}