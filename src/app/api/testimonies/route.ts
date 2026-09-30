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

    /*
     * Honeypot.
     * Legitimate users should never
     * fill this field.
     */
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

    const title =
      typeof body.title ===
      "string"
        ? body.title.trim()
        : "";

    const author =
      typeof body.author ===
      "string"
        ? body.author.trim()
        : "";

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

    const titleError =
      validateTitle(title);

    if (titleError) {
      return NextResponse.json(
        {
          success: false,
          message:
            titleError,
        },
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Your testimony cannot be empty.",
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
      .from("Testimonies")
      .insert([
        {
          Title: title,

          author:
            author ||
            "Anonymous",

          category:
            category ||
            "Faith",

          content,

          amen_count: 0,

          /*
           * P0:
           * never publish a user
           * submission immediately.
           */
          is_approved:
            false,

          views: 0,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error(
        "Unable to submit testimony:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Your testimony could not be submitted.",
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
        "Your testimony has been received and is awaiting review.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong while submitting your testimony.",
      },
      {
        status: 500,
      }
    );
  }
}