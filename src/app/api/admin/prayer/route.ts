import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

export const runtime =
  "nodejs";

export async function GET(
  request: Request
) {
  const session =
    await getAdminSession();

  if (
    !session ||
    session.role !== "main"
  ) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 403,
      }
    );
  }

  const url =
    new URL(request.url);

  const status =
    url.searchParams.get(
      "status"
    ) === "published"
      ? "published"
      : "pending";

  const approved =
    status ===
    "published";

  const [
    requestsResult,
    pendingCountResult,
    publishedCountResult,
    allApprovedResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("PrayerRequests")
      .select(`
        id,
        category,
        content,
        prayer_count,
        is_approved,
        created_at
      `)
      .eq(
        "is_approved",
        approved
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from("PrayerRequests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "is_approved",
        false
      ),

    supabaseAdmin
      .from("PrayerRequests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "is_approved",
        true
      ),

    supabaseAdmin
      .from("PrayerRequests")
      .select(
        "prayer_count"
      )
      .eq(
        "is_approved",
        true
      ),
  ]);

  if (
    requestsResult.error
  ) {
    console.error(
      "Unable to load prayer requests:",
      requestsResult.error
        .message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Prayer requests could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  const totalPrayers =
    (
      allApprovedResult.data ??
      []
    ).reduce(
      (
        total,
        item
      ) =>
        total +
        (
          item.prayer_count ??
          0
        ),
      0
    );

  const requests =
    (
      requestsResult.data ??
      []
    ).map(
      (item) => ({
        id: String(
          item.id
        ),

        category:
          item.category?.trim() ||
          "General Prayer",

        content:
          item.content ?? "",

        prayerCount:
          item.prayer_count ??
          0,

        approved:
          item.is_approved ===
          true,

        createdAt:
          item.created_at ??
          null,
      })
    );

  return NextResponse.json(
    {
      success: true,

      requests,

      counts: {
        pending:
          pendingCountResult.count ??
          0,

        published:
          publishedCountResult.count ??
          0,

        prayers:
          totalPrayers,
      },
    },
    {
      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}