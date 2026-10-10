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

async function authorize() {
  const session =
    await getAdminSession();

  return (
    session?.role ===
    "main"
  );
}

/*
 * LOAD PRAYER REQUESTS
 */
export async function GET(
  request: Request
) {
  if (
    !(await authorize())
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
    approvedPrayerCountsResult,
  ] = await Promise.all([
    /*
     * CURRENT TAB
     */
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

    /*
     * PENDING COUNT
     */
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

    /*
     * PUBLISHED COUNT
     */
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

    /*
     * TOTAL COMMUNITY PRAYERS
     */
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

  /*
   * HANDLE ALL DATABASE ERRORS,
   * NOT ONLY THE LIST QUERY.
   */
  if (
    requestsResult.error ||
    pendingCountResult.error ||
    publishedCountResult.error ||
    approvedPrayerCountsResult.error
  ) {
    console.error(
      "Unable to load prayer admin data:",
      {
        requests:
          requestsResult.error
            ?.message,

        pendingCount:
          pendingCountResult.error
            ?.message,

        publishedCount:
          publishedCountResult.error
            ?.message,

        prayerCounts:
          approvedPrayerCountsResult
            .error
            ?.message,
      }
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
      approvedPrayerCountsResult
        .data ??
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
        id:
          String(
            item.id
          ),

        category:
          item.category
            ?.trim() ||
          "General Prayer",

        content:
          item.content ??
          "",

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
          pendingCountResult
            .count ??
          0,

        published:
          publishedCountResult
            .count ??
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