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

  const testimonyId =
    Number(id);

  const {
    data: testimony,
  } = await supabaseAdmin
    .from("Testimonies")
    .select(
      "id, is_approved"
    )
    .eq(
      "id",
      testimonyId
    )
    .eq(
      "is_approved",
      true
    )
    .maybeSingle();

  if (!testimony) {
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
        "Testimonies",

      target_id:
        testimonyId,
    }
  );

  if (error) {
    console.error(
      "Unable to record testimony view:",
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