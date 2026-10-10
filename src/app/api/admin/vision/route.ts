import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

export const runtime =
  "nodejs";

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
 * LOAD VISION & MISSION
 * =================================
 */
export async function GET() {
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
    data,
    error,
  } = await supabaseAdmin
    .from(
      "VisionMissionContent"
    )
    .select(`
      id,
      vision,
      mission,
      updated_at
    `)
    .eq(
      "id",
      1
    )
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load Vision & Mission:",
      error.message
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Vision & Mission content could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      success: true,

      content: {
        vision:
          data?.vision ??
          "",

        mission:
          data?.mission ??
          "",

        updatedAt:
          data?.updated_at ??
          null,
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
 * UPDATE VISION & MISSION
 *
 * MAIN ADMIN ONLY
 * SINGLE RECORD: ID 1
 * =================================
 */
export async function PUT(
  request: Request
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

  try {
    const body =
      await request.json();

    const vision =
      typeof body.vision ===
      "string"
        ? body.vision.trim()
        : "";

    const mission =
      typeof body.mission ===
      "string"
        ? body.mission.trim()
        : "";

    /*
     * Used for optimistic
     * concurrency protection.
     *
     * undefined means an older
     * client that is not using
     * this protection.
     */
    const expectedUpdatedAt:
      | string
      | null
      | undefined =
      typeof body.expectedUpdatedAt ===
      "string"
        ? body.expectedUpdatedAt
        : body.expectedUpdatedAt ===
            null
          ? null
          : undefined;

    if (
      !vision ||
      !mission
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Both Vision and Mission are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Load the current record before
     * saving so one stale browser
     * tab cannot overwrite a newer
     * update without warning.
     */
    const {
      data: current,
      error:
        currentError,
    } = await supabaseAdmin
      .from(
        "VisionMissionContent"
      )
      .select(`
        id,
        updated_at
      `)
      .eq(
        "id",
        1
      )
      .maybeSingle();

    if (
      currentError
    ) {
      console.error(
        "Unable to verify current Vision & Mission:",
        currentError.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Vision & Mission could not be updated.",
        },
        {
          status: 500,
        }
      );
    }

    const currentUpdatedAt =
      current?.updated_at ??
      null;

    if (
      expectedUpdatedAt !==
        undefined &&
      expectedUpdatedAt !==
        currentUpdatedAt
    ) {
      return NextResponse.json(
        {
          success: false,

          conflict: true,

          message:
            "Vision & Mission has changed since you opened this editor. Reload the latest version before saving.",
        },
        {
          status: 409,
        }
      );
    }

    const now =
      new Date()
        .toISOString();

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "VisionMissionContent"
      )
      .upsert(
        {
          id:
            1,

          vision,

          mission,

          updated_at:
            now,
        },
        {
          onConflict:
            "id",
        }
      )
      .select(`
        vision,
        mission,
        updated_at
      `)
      .single();

    if (
      error
    ) {
      console.error(
        "Unable to update Vision & Mission:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Vision & Mission could not be updated.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      content: {
        vision:
          data.vision ??
          "",

        mission:
          data.mission ??
          "",

        updatedAt:
          data.updated_at ??
          now,
      },
    });
  } catch (
    error
  ) {
    console.error(
      "Vision & Mission save error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong while saving Vision & Mission.",
      },
      {
        status: 500,
      }
    );
  }
}