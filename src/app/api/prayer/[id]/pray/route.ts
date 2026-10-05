import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  {
    params,
  }: Context
) {
  const {
    id,
  } =
    await params;

  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !url ||
    !key
  ) {
    return NextResponse.json(
      {
        message:
          "Prayer action unavailable.",
      },
      {
        status: 500,
      }
    );
  }

  const admin =
    createClient(
      url,
      key,
      {
        auth: {
          persistSession:
            false,
          autoRefreshToken:
            false,
        },
      }
    );

  const {
    data,
    error,
  } =
    await admin
      .from(
        "PrayerRequests"
      )
      .select(
        "id, prayer_count, is_approved"
      )
      .eq(
        "id",
        id
      )
      .eq(
        "is_approved",
        true
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    return NextResponse.json(
      {
        message:
          "Prayer request not found.",
      },
      {
        status: 404,
      }
    );
  }

  const nextCount =
    (
      data.prayer_count ??
      0
    ) + 1;

  const {
    error:
      updateError,
  } =
    await admin
      .from(
        "PrayerRequests"
      )
      .update({
        prayer_count:
          nextCount,
      })
      .eq(
        "id",
        id
      );

  if (
    updateError
  ) {
    return NextResponse.json(
      {
        message:
          "Prayer count could not be updated.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    prayerCount:
      nextCount,
  });
}