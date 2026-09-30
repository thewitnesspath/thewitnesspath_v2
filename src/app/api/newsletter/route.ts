import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

export const runtime =
  "nodejs";

function validEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

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

    const email =
      typeof body.email ===
      "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    if (
      !email ||
      !validEmail(email)
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      error,
    } = await supabaseAdmin
      .from("Newsletter")
      .insert([
        {
          email,
        },
      ]);

    if (error) {
      if (
        error.code ===
        "23505"
      ) {
        return NextResponse.json({
          success: true,

          alreadySubscribed:
            true,

          message:
            "You're already subscribed.",
        });
      }

      console.error(
        "Newsletter subscription error:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Subscription could not be completed.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Thank you for subscribing.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,

        message:
          "Subscription could not be completed.",
      },
      {
        status: 500,
      }
    );
  }
}