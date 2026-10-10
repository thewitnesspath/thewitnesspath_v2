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
    !canEdit(
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
        message:
          "Invalid article.",
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
            "Article content is required.",
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
      .from("BlogPosts")
      .update({
        title,

        category:
          category ||
          "Teaching",

        author:
          author ||
          "The Witness Team",

        content,
      })
      .eq(
        "id",
        Number(id)
      )
      .select("id")
      .maybeSingle();

    if (error) {
      console.error(
        "Unable to update blog post:",
        error.message
      );

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

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Article not found.",
        },
        {
          status: 404,
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
      "Blog editing error:",
      error
    );

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
 *
 * Permanent deletion is restricted
 * to the main administrator.
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
          "Only the main administrator can delete articles.",
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
        message:
          "Invalid article.",
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
  } catch (
    error
  ) {
    console.error(
      "Blog deletion error:",
      error
    );

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