import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function POST(
  _request: Request,
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

  const postId =
    Number(id);

  const {
    data: post,
  } = await supabaseAdmin
    .from("BlogPosts")
    .select("id")
    .eq(
      "id",
      postId
    )
    .maybeSingle();

  if (!post) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  const {
    error,
  } = await supabaseAdmin.rpc(
    "increment_blog_view",
    {
      p_post_id: postId,
    }
  );

  if (error) {
    console.error(
      "Unable to record blog view:",
      error.message
    );

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
  });
}