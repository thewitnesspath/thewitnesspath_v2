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
    itemsResult,
    pendingCount,
    publishedCount,
  ] = await Promise.all([
    supabaseAdmin
      .from("Testimonies")
      .select(
        `
          id,
          Title,
          author,
          category,
          content,
          amen_count,
          is_approved,
          views,
          created_at,
          whatsapp_notified_at,
          Comments(id)
        `
      )
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
      .from("Testimonies")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "is_approved",
        false
      ),

    supabaseAdmin
      .from("Testimonies")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "is_approved",
        true
      ),
  ]);

  if (
    itemsResult.error
  ) {
    console.error(
      "Unable to load admin testimonies:",
      itemsResult.error.message
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Testimonies could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      success: true,

      items:
        itemsResult.data ??
        [],

      counts: {
        pending:
          pendingCount.count ??
          0,

        published:
          publishedCount.count ??
          0,
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