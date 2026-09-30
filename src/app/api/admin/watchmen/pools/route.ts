import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
  getWatchmenAccess,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

export const runtime =
  "nodejs";

async function authorize() {
  const session =
    await getAdminSession();

  if (!session) {
    return {
      allowed: false,
      status: 401,
    };
  }

  /*
   * A Watchmen login is already
   * verified.
   */
  if (
    session.role ===
    "watchmen"
  ) {
    return {
      allowed: true,
      status: 200,
    };
  }

  /*
   * Main Admin needs the secondary
   * Watchmen unlock.
   */
  if (
    session.role ===
    "main"
  ) {
    const watchmenAccess =
      await getWatchmenAccess();

    if (watchmenAccess) {
      return {
        allowed: true,
        status: 200,
      };
    }

    return {
      allowed: false,
      status: 423,
    };
  }

  return {
    allowed: false,
    status: 403,
  };
}

export async function GET() {
  const auth =
    await authorize();

  if (!auth.allowed) {
    return NextResponse.json(
      {
        success: false,

        locked:
          auth.status ===
          423,

        message:
          auth.status ===
          423
            ? "Watchmen access is locked."
            : "Access denied.",
      },
      {
        status:
          auth.status,
      }
    );
  }

  const [
    answersResult,
    prayerResult,
    testimoniesResult,
    blogsResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("Answers")
      .select(`
        id,
        question,
        answer,
        category,
        author,
        created_at
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from("PrayerRequests")
      .select(`
        id,
        category,
        content,
        prayer_count,
        created_at
      `)
      .eq(
        "is_approved",
        true
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from("Testimonies")
      .select(`
        id,
        Title,
        content,
        category,
        author,
        created_at
      `)
      .eq(
        "is_approved",
        true
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from("BlogPosts")
      .select(`
        id,
        title,
        content,
        category,
        author,
        created_at
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),
  ]);

  const errors = [
    answersResult.error,
    prayerResult.error,
    testimoniesResult.error,
    blogsResult.error,
  ].filter(Boolean);

  if (
    errors.length > 0
  ) {
    console.error(
      "Unable to load Watchmen pools:",
      errors.map(
        (error) =>
          error?.message
      )
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Prayer assignment sources could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  /*
   * Keep the legacy Watchmen
   * selection text:
   *
   * Guidance → question
   * Prayer → content
   * Testimony → Title
   * Blog → title
   */

  return NextResponse.json(
    {
      success: true,

      pools: {
        answers:
          (
            answersResult.data ??
            []
          ).map(
            (item) => ({
              id:
                String(
                  item.id
                ),

              text:
                item.question ||
                item.answer ||
                "Guidance",
            })
          ),

        burdens:
          (
            prayerResult.data ??
            []
          ).map(
            (item) => ({
              id:
                String(
                  item.id
                ),

              text:
                item.content ||
                "Prayer burden",
            })
          ),

        testimonies:
          (
            testimoniesResult.data ??
            []
          ).map(
            (item) => ({
              id:
                String(
                  item.id
                ),

              text:
                item.Title ||
                item.content ||
                "Testimony",
            })
          ),

        blogs:
          (
            blogsResult.data ??
            []
          ).map(
            (item) => ({
              id:
                String(
                  item.id
                ),

              text:
                item.title ||
                item.content ||
                "Blog post",
            })
          ),
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