import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  validateTitle,
} from "@/lib/validation/content";

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

    const question =
      typeof body.question ===
      "string"
        ? body.question.trim()
        : "";

    /*
     * P0 uses the same
     * ~100-character heading rule
     * for Guidance questions.
     */
    const questionError =
      validateTitle(
        question
      );

    if (questionError) {
      return NextResponse.json(
        {
          success: false,

          message:
            questionError,
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
      .from("Questions")
      .insert([
        {
          category:
            category ||
            "General Guidance",

          question,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error(
        "Unable to submit Safe Haven question:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Your question could not be submitted.",
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
        "Your question has been received safely and anonymously.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong while submitting your question.",
      },
      {
        status: 500,
      }
    );
  }
}