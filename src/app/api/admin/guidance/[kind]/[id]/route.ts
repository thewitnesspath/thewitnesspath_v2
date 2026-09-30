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

function canAccess(
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
    kind,
    id,
  } = await context.params;

  if (
    kind !== "answer" ||
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

    const editCode =
      typeof body.editCode ===
      "string"
        ? body.editCode.trim()
        : "";

    if (
      !answer ||
      !editCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Answer and edit code are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Keep the existing secure
     * edit-code RPC.
     */
    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        "secure_verify_and_edit_content",
        {
          target_table:
            "Answers",

          target_id:
            Number(id),

          input_code:
            editCode,

          new_title: "",

          new_category:
            category ||
            "General Guidance",

          new_author:
            author ||
            "The Witness Team",

          new_content:
            answer,
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

  const {
    kind,
    id,
  } = await context.params;

  if (
    ![
      "question",
      "answer",
    ].includes(kind) ||
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
      kind === "question"
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
  } catch {
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