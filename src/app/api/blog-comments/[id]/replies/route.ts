import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const body =
      await request.json();

    if (body.website) {
      return NextResponse.json({
        success: true,
      });
    }

    const author =
      typeof body.author ===
      "string"
        ? body.author.trim()
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
            "Please write your reply.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } =
      await supabase
        .from(
          "BlogCommentReplies"
        )
        .insert([
          {
            comment_id: id,

            author:
              author ||
              "Anonymous",

            content,

            is_approved: false,
          },
        ])
        .select("id")
        .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your reply could not be submitted.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,

      message:
        "Your reply has been received and is awaiting review.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while submitting your reply.",
      },
      {
        status: 500,
      }
    );
  }
}