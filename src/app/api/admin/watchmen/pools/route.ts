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

type AuthorizationResult = {
  allowed: boolean;

  status: number;
};

async function authorize():
  Promise<AuthorizationResult> {
  const session =
    await getAdminSession();

  if (!session) {
    return {
      allowed:
        false,

      status:
        401,
    };
  }

  /*
   * Direct Watchmen login has
   * already passed Watchmen
   * authentication.
   */
  if (
    session.role ===
    "watchmen"
  ) {
    return {
      allowed:
        true,

      status:
        200,
    };
  }

  /*
   * Main Admin needs the
   * secondary Watchmen unlock.
   */
  if (
    session.role ===
    "main"
  ) {
    const watchmenAccess =
      await getWatchmenAccess();

    if (
      watchmenAccess
    ) {
      return {
        allowed:
          true,

        status:
          200,
      };
    }

    return {
      allowed:
        false,

      status:
        423,
    };
  }

  return {
    allowed:
      false,

    status:
      403,
  };
}

export async function GET() {
  const auth =
    await authorize();

  if (
    !auth.allowed
  ) {
    return NextResponse.json(
      {
        success:
          false,

        locked:
          auth.status ===
          423,

        message:
          auth.status ===
          423
            ? "Watchmen access is locked."
            : auth.status ===
                401
              ? "Your admin session has expired."
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
  ] =
    await Promise.all([
      /*
       * GUIDANCE
       */
      supabaseAdmin
        .from(
          "Answers"
        )
        .select(`
          id,
          question,
          answer,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        ),

      /*
       * APPROVED PRAYER BURDENS
       */
      supabaseAdmin
        .from(
          "PrayerRequests"
        )
        .select(`
          id,
          content,
          created_at
        `)
        .eq(
          "is_approved",
          true
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        ),

      /*
       * APPROVED TESTIMONIES
       */
      supabaseAdmin
        .from(
          "Testimonies"
        )
        .select(`
          id,
          Title,
          content,
          created_at
        `)
        .eq(
          "is_approved",
          true
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        ),

      /*
       * BLOG POSTS
       */
      supabaseAdmin
        .from(
          "BlogPosts"
        )
        .select(`
          id,
          title,
          content,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        ),
    ]);

  const errors =
    [
      answersResult.error,
      prayerResult.error,
      testimoniesResult.error,
      blogsResult.error,
    ].filter(
      Boolean
    );

  if (
    errors.length >
    0
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
        success:
          false,

        message:
          "Prayer assignment sources could not be loaded.",
      },
      {
        status:
          500,
      }
    );
  }

  /*
   * Keep the existing
   * Watchmen selection logic:
   *
   * Guidance → question
   * Prayer → content
   * Testimony → title
   * Blog → title
   */
  const pools = {
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
            item.question
              ?.trim() ||
            item.answer
              ?.trim() ||
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
            item.content
              ?.trim() ||
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
            item.Title
              ?.trim() ||
            item.content
              ?.trim() ||
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
            item.title
              ?.trim() ||
            item.content
              ?.trim() ||
            "Blog post",
        })
      ),
  };

  return NextResponse.json(
    {
      success:
        true,

      pools,
    },
    {
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    }
  );
}