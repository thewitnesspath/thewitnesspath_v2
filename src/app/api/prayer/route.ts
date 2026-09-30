import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

export const runtime =
  "nodejs";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const website =
      typeof body.website ===
      "string"
        ? body.website.trim()
        : "";

    if (website) {
      return NextResponse.json({
        success: true,
      });
    }

    const category =
      typeof body.category ===
      "string"
        ? body.category.trim()
        : "";

    const content =
      typeof body.content ===
      "string"
        ? body.content.trim()
        : "";

    if (!content) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Prayer request cannot be empty.",
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
        "PrayerRequests"
      )
      .insert([
        {
          category:
            category ||
            "General Prayer",

          content,

          prayer_count: 0,

          is_approved:
            false,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error(
        "Unable to submit prayer request:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Your prayer request could not be submitted.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      id:
        String(data.id),

      message:
        "Your prayer request has been received and is awaiting review.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong while submitting your prayer request.",
      },
      {
        status: 500,
      }
    );
  }
}