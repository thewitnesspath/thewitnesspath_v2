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
    id: string;
  }>;
};

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

  const { data, error } =
    await supabaseAdmin
      .from("Testimonies")
      .update({
        is_approved: true,
      })
      .eq(
        "id",
        Number(id)
      )
      .select(
        "id, is_approved"
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "The testimony could not be approved.",
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
 *
 * Keep the existing Witness Path
 * deletion-password protection.
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
            "Testimonies",

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
          "Unable to delete testimony.",
      },
      {
        status: 500,
      }
    );
  }
}