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

  const answerId =
    Number(id);

  const {
    data: answer,
  } = await supabaseAdmin
    .from("Answers")
    .select("id")
    .eq(
      "id",
      answerId
    )
    .maybeSingle();

  if (!answer) {
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
    "increment_content_view",
    {
      target_table:
        "Answers",

      target_id:
        answerId,
    }
  );

  if (error) {
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