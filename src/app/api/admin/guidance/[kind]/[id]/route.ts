import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    kind: string;
    id: string;
  }>;
};

function canEdit(
  role?: string
) {
  return (
    role === "main" ||
    role === "counselor"
  );
}

/*
 * EDIT PUBLISHED ANSWER
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

  const {
    kind,
    id,
  } =
    await context.params;

  if (
    kind !==
      "answer" ||
    !/^\d+$/.test(
      id
    )
  ) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Invalid guidance item.",
      },
      {
        status: 400,
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

    if (!answer) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Answer is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Authentication + role access
     * now protects editing.
     *
     * edit_code remains a legacy DB
     * column but is never exposed
     * to the browser.
     */
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("Answers")
      .update({
        category:
          category ||
          "General Guidance",

        answer,

        author:
          author ||
          "The Witness Team",
      })
      .eq(
        "id",
        Number(id)
      )
      .select(
        "id"
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Unable to update guidance:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "The answer could not be updated.",
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
            "Guidance answer not found.",
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
      "Guidance update error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "The answer could not be updated.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * DELETE QUESTION OR ANSWER
 *
 * PERMANENT DELETION IS MAIN
 * ADMIN ONLY.
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
          "Only the main administrator can permanently delete Safe Haven content.",
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
    ![
      "question",
      "answer",
    ].includes(
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
          "Invalid Safe Haven content.",
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
      kind ===
      "question"
        ? "Questions"
        : "Answers";

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
  } catch (
    error
  ) {
    console.error(
      "Safe Haven deletion error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "This content could not be deleted.",
      },
      {
        status: 500,
      }
    );
  }
}