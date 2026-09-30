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
        message: "Invalid testimony.",
      },
      {
        status: 400,
      }
    );
  }

  const testimonyId =
    Number(id);

  /*
   * Never react to a pending or
   * nonexistent testimony.
   */
  const {
    data: testimony,
    error: testimonyError,
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

  if (
    testimonyError ||
    !testimony
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Testimony not found.",
      },
      {
        status: 404,
      }
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin.rpc(
    "increment_testimony_praise",
    {
      p_testimony_id:
        testimonyId,
    }
  );

  if (error) {
    console.error(
      "Unable to praise testimony:",
      error.message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Praise could not be recorded.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
    count: data,
  });
}