import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

const categories =
  new Set([
    "Health & Healing",
    "Financial Provision",
    "Career & Business",
    "Family & Marriage",
    "Spiritual Growth & Strength",
    "Other Challenges",
  ]);

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

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

    const website =
      typeof body.website ===
      "string"
        ? body.website.trim()
        : "";

    /* Honeypot */

    if (website) {
      return NextResponse.json({
        message:
          "Your prayer request has been received.",
      });
    }

    if (
      !categories.has(
        category
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Please select a valid prayer category.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      content.length <
      10
    ) {
      return NextResponse.json(
        {
          message:
            "Please tell us a little more about what you would like prayer for.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      content.length >
      2500
    ) {
      return NextResponse.json(
        {
          message:
            "Your prayer request is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const url =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const key =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !url ||
      !key
    ) {
      return NextResponse.json(
        {
          message:
            "Prayer submission is temporarily unavailable.",
        },
        {
          status: 500,
        }
      );
    }

    const admin =
      createClient(
        url,
        key,
        {
          auth: {
            persistSession:
              false,
            autoRefreshToken:
              false,
          },
        }
      );

    const {
      error,
    } =
      await admin
        .from(
          "PrayerRequests"
        )
        .insert({
          category,
          content,
          prayer_count: 0,
          is_approved: false,
        });

    if (error) {
      console.error(
        "Prayer request insert failed:",
        error
      );

      return NextResponse.json(
        {
          message:
            "Your prayer request could not be submitted.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Your prayer request has been received and is awaiting review.",
    });
  } catch (
    error
  ) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        message:
          "Your prayer request could not be submitted.",
      },
      {
        status: 500,
      }
    );
  }
}