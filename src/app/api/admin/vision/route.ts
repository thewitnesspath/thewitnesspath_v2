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
 * LOAD VISION & MISSION
 */
export async function GET() {
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
    data,
    error,
  } = await supabaseAdmin
    .from(
      "VisionMissionContent"
    )
    .select(
      `
        id,
        vision,
        mission,
        updated_at
      `
    )
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
          data?.vision ?? "",

        mission:
          data?.mission ?? "",

        updatedAt:
          data?.updated_at ??
          null,
      },
    },
    {
      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}

/*
 * UPDATE VISION & MISSION
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

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "VisionMissionContent"
      )
      .upsert(
        {
          id: 1,

          vision,

          mission,

          updated_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict: "id",
        }
      )
      .select(
        `
          vision,
          mission,
          updated_at
        `
      )
      .single();

    if (error) {
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
          data.vision,

        mission:
          data.mission,

        updatedAt:
          data.updated_at,
      },
    });
  } catch {
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