import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  const { data: comments, error } =
    await supabase
      .from("BlogComments")
      .select(
        `
          id,
          post_id,
          author,
          content,
          likes,
          created_at
        `
      )
      .eq("post_id", id)
      .eq("is_approved", true)
      .order("created_at", {
        ascending: true,
      });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }

  const commentIds =
    comments?.map(
      (comment) => comment.id
    ) ?? [];

  let replies: Array<{
    id: number;
    comment_id: number;
    author: string | null;
    content: string | null;
    created_at: string | null;
  }> = [];

  if (commentIds.length > 0) {
    const {
      data: replyData,
      error: replyError,
    } = await supabase
      .from("BlogCommentReplies")
      .select(
        `
          id,
          comment_id,
          author,
          content,
          created_at
        `
      )
      .in(
        "comment_id",
        commentIds
      )
      .eq(
        "is_approved",
        true
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

    if (replyError) {
      return NextResponse.json(
        {
          success: false,
          message:
            replyError.message,
        },
        {
          status: 500,
        }
      );
    }

    replies =
      replyData ?? [];
  }

  return NextResponse.json({
    success: true,

    comments:
      (comments ?? []).map(
        (comment) => ({
          id: String(
            comment.id
          ),

          postId: String(
            comment.post_id
          ),

          author:
            comment.author?.trim() ||
            "Anonymous",

          content:
            comment.content ?? "",

          likes:
            comment.likes ?? 0,

          createdAt:
            comment.created_at ??
            null,

          replies: replies
            .filter(
              (reply) =>
                String(
                  reply.comment_id
                ) ===
                String(
                  comment.id
                )
            )
            .map(
              (reply) => ({
                id: String(
                  reply.id
                ),

                commentId:
                  String(
                    reply.comment_id
                  ),

                author:
                  reply.author?.trim() ||
                  "Anonymous",

                content:
                  reply.content ??
                  "",

                createdAt:
                  reply.created_at ??
                  null,
              })
            ),
        })
      ),
  });
}

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
            "Please write a comment.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } =
      await supabase
        .from("BlogComments")
        .insert([
          {
            post_id: id,

            author:
              author ||
              "Anonymous",

            content,

            likes: 0,

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
            "Your comment could not be submitted.",
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
        "Your comment has been received and is awaiting review.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while submitting your comment.",
      },
      {
        status: 500,
      }
    );
  }
}