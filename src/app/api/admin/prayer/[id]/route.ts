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
 * APPROVE PRAYER REQUEST
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
          "Invalid prayer request.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    /*
     * CHECK WHETHER THE REQUEST
     * ACTUALLY EXISTS FIRST.
     */
    const {
      data: existing,
      error:
        existingError,
    } = await supabaseAdmin
      .from(
        "PrayerRequests"
      )
      .select(
        "id, is_approved"
      )
      .eq(
        "id",
        Number(id)
      )
      .maybeSingle();

    if (
      existingError
    ) {
      console.error(
        "Unable to check prayer request:",
        existingError.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "The prayer request could not be approved.",
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
            "Prayer request not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * IDEMPOTENT:
     * IF ALREADY APPROVED,
     * DON'T TREAT IT AS AN ERROR.
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
        "PrayerRequests"
      )
      .update({
        is_approved:
          true,
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
      error
    ) {
      console.error(
        "Unable to approve prayer request:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "The prayer request could not be approved.",
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
            "Prayer request not found.",
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
      "Prayer approval error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "The prayer request could not be approved.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * DELETE PRAYER REQUEST
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
          "Only the main administrator can delete prayer requests.",
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
          "Invalid prayer request.",
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
            "PrayerRequests",

          target_id:
            Number(id),
        }
      );

    if (
      error
    ) {
      console.error(
        "Prayer deletion RPC error:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "The prayer request could not be deleted.",
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
      "Prayer deletion error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "The prayer request could not be deleted.",
      },
      {
        status: 500,
      }
    );
  }
}