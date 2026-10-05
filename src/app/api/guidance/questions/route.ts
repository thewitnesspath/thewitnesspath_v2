import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

const allowedCategories =
  new Set([
    "Silent Battles & Difficult Seasons",
    "Mental & Emotional Distress",
    "Life Hardships & Crises",
    "Faith, Doubt & Doctrine",
    "Relationships & Family",
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

    const question =
      typeof body.question ===
      "string"
        ? body.question.trim()
        : "";

    const website =
      typeof body.website ===
      "string"
        ? body.website.trim()
        : "";

    /*
     * Honeypot.
     *
     * Return success so bots
     * don't learn anything.
     */
    if (website) {
      return NextResponse.json({
        message:
          "Your question has been received.",
      });
    }

    if (
      !allowedCategories.has(
        category
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Please select a valid area of need.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      question.length <
      10
    ) {
      return NextResponse.json(
        {
          message:
            "Please tell us a little more about what you're carrying.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      question.length >
      3000
    ) {
      return NextResponse.json(
        {
          message:
            "Your submission is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        "Missing Supabase server environment variables."
      );

      return NextResponse.json(
        {
          message:
            "Submission service is unavailable.",
        },
        {
          status: 500,
        }
      );
    }

    const admin =
      createClient(
        supabaseUrl,
        serviceRoleKey,
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
          "Questions"
        )
        .insert({
          category,
          question,
        });

    if (error) {
      console.error(
        "Guidance question insert failed:",
        error
      );

      return NextResponse.json(
        {
          message:
            "Your question could not be submitted.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Your question has been received for review.",
    });
  } catch (
    error
  ) {
    console.error(
      "Guidance question request failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Your question could not be submitted.",
      },
      {
        status: 500,
      }
    );
  }
}