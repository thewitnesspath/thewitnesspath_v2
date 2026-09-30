import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  const commentId =
    Number(id);

  try {
    const body =
      await request.json();

    const delta =
      Number(body.delta);

    if (
      delta !== 1 &&
      delta !== -1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid reaction.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: comment,
    } = await supabaseAdmin
      .from("Comments")
      .select(
        "id, is_approved"
      )
      .eq(
        "id",
        commentId
      )
      .eq(
        "is_approved",
        true
      )
      .maybeSingle();

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Comment not found.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        "change_testimony_comment_like",
        {
          p_comment_id:
            commentId,

          p_delta:
            delta,
        }
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: data,
    });
  } catch (error) {
    console.error(
      "Unable to change testimony comment like:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Reaction could not be updated.",
      },
      {
        status: 500,
      }
    );
  }
}