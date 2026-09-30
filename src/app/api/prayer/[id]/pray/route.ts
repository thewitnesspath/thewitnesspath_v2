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

  const requestId =
    Number(id);

  const {
    data: prayer,
  } = await supabaseAdmin
    .from("PrayerRequests")
    .select(
      "id, is_approved"
    )
    .eq(
      "id",
      requestId
    )
    .eq(
      "is_approved",
      true
    )
    .maybeSingle();

  if (!prayer) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Prayer request not found.",
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
    "increment_prayer_count",
    {
      p_request_id:
        requestId,
    }
  );

  if (error) {
    console.error(
      "Unable to record prayer:",
      error.message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Prayer could not be recorded.",
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