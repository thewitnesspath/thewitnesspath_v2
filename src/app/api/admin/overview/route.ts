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

function response(
  data: unknown,
  status = 200
) {
  return NextResponse.json(
    data,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}

export async function GET() {
  const session =
    await getAdminSession();

  if (!session) {
    return response(
      {
        success: false,
      },
      401
    );
  }

  /*
   * BLOGGER
   */
  if (
    session.role ===
    "blogger"
  ) {
    const [
      blogCount,
      wordCount,
      topBlogs,
    ] = await Promise.all([
      supabaseAdmin
        .from("BlogPosts")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabaseAdmin
        .from(
          "WordOfTheWeekBank"
        )
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabaseAdmin
        .from("BlogPosts")
        .select(
          "id, title, views"
        )
        .order("views", {
          ascending: false,
        })
        .limit(5),
    ]);

    return response({
      success: true,

      role:
        session.role,

      stats: {
        blogPosts:
          blogCount.count ?? 0,

        wordEntries:
          wordCount.count ?? 0,
      },

      top: {
        blogs:
          topBlogs.data ?? [],

        testimonies: [],

        guidance: [],
      },
    });
  }

  /*
   * COUNSELOR
   */
  if (
    session.role ===
    "counselor"
  ) {
    const [
      questionsResult,
      answersResult,
      topGuidance,
    ] = await Promise.all([
      supabaseAdmin
        .from("Questions")
        .select(
          "id, question"
        ),

      supabaseAdmin
        .from("Answers")
        .select(
          "id, question"
        ),

      supabaseAdmin
        .from("Answers")
        .select(
          "id, question, views"
        )
        .order("views", {
          ascending: false,
        })
        .limit(5),
    ]);

    const answered =
      new Set(
        (
          answersResult.data ??
          []
        )
          .map(
            (item) =>
              (
                item.question ??
                ""
              )
                .trim()
                .toLowerCase()
          )
          .filter(Boolean)
      );

    const unanswered =
      (
        questionsResult.data ??
        []
      ).filter(
        (item) =>
          !answered.has(
            (
              item.question ??
              ""
            )
              .trim()
              .toLowerCase()
          )
      ).length;

    return response({
      success: true,

      role:
        session.role,

      stats: {
        unansweredGuidance:
          unanswered,

        publishedAnswers:
          answersResult.data
            ?.length ?? 0,
      },

      top: {
        blogs: [],

        testimonies: [],

        guidance:
          topGuidance.data ??
          [],
      },
    });
  }

  /*
   * MAIN ADMIN
   */
  const [
    pendingTestimonies,
    publishedTestimonies,
    blogCount,
    prayerCount,
    whatsappSubscribers,
    questionsResult,
    answersResult,
    visitsResult,
    topBlogs,
    topTestimonies,
    topGuidance,
  ] = await Promise.all([
    /*
     * PENDING TESTIMONIES
     */
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

    /*
     * PUBLISHED TESTIMONIES
     */
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

    /*
     * BLOG POSTS
     */
    supabaseAdmin
      .from("BlogPosts")
      .select("*", {
        count: "exact",
        head: true,
      }),

    /*
     * PRAYER REQUESTS
     */
    supabaseAdmin
      .from(
        "PrayerRequests"
      )
      .select("*", {
        count: "exact",
        head: true,
      }),

    /*
     * ACTIVE WHATSAPP SUBSCRIBERS
     */
    supabaseAdmin
      .from(
        "WhatsAppSubscribers"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "is_active",
        true
      ),

    /*
     * QUESTIONS
     */
    supabaseAdmin
      .from("Questions")
      .select(
        "id, question"
      ),

    /*
     * ANSWERS
     */
    supabaseAdmin
      .from("Answers")
      .select(
        "id, question"
      ),

    /*
     * SITE VISITS
     */
    supabaseAdmin
      .from("SiteVisits")
      .select(
        "visit_date, visit_count, unique_visitors"
      )
      .order(
        "visit_date",
        {
          ascending: false,
        }
      )
      .limit(7),

    /*
     * TOP BLOG POSTS
     */
    supabaseAdmin
      .from("BlogPosts")
      .select(
        "id, title, views"
      )
      .order("views", {
        ascending: false,
      })
      .limit(5),

    /*
     * TOP TESTIMONIES
     */
    supabaseAdmin
      .from("Testimonies")
      .select(
        "id, Title, views"
      )
      .eq(
        "is_approved",
        true
      )
      .order("views", {
        ascending: false,
      })
      .limit(5),

    /*
     * TOP GUIDANCE
     */
    supabaseAdmin
      .from("Answers")
      .select(
        "id, question, views"
      )
      .order("views", {
        ascending: false,
      })
      .limit(5),
  ]);

  /*
   * CALCULATE UNANSWERED GUIDANCE
   */
  const answered =
    new Set(
      (
        answersResult.data ??
        []
      )
        .map(
          (item) =>
            (
              item.question ??
              ""
            )
              .trim()
              .toLowerCase()
        )
        .filter(Boolean)
    );

  const unansweredGuidance =
    (
      questionsResult.data ??
      []
    ).filter(
      (item) =>
        !answered.has(
          (
            item.question ??
            ""
          )
            .trim()
            .toLowerCase()
        )
    ).length;

  /*
   * 7-DAY VISITS
   */
  const visits7d =
    (
      visitsResult.data ??
      []
    ).reduce(
      (
        total,
        item
      ) =>
        total +
        (
          item.visit_count ??
          0
        ),
      0
    );

  /*
   * 7-DAY UNIQUE VISITORS
   */
  const uniqueVisitors7d =
    (
      visitsResult.data ??
      []
    ).reduce(
      (
        total,
        item
      ) =>
        total +
        (
          item.unique_visitors ??
          0
        ),
      0
    );

  return response({
    success: true,

    role:
      session.role,

    stats: {
      pendingTestimonies:
        pendingTestimonies.count ??
        0,

      publishedTestimonies:
        publishedTestimonies.count ??
        0,

      blogPosts:
        blogCount.count ?? 0,

      prayerRequests:
        prayerCount.count ?? 0,

      whatsappSubscribers:
        whatsappSubscribers.count ??
        0,

      unansweredGuidance,

      visits7d,

      uniqueVisitors7d,
    },

    top: {
      blogs:
        topBlogs.data ?? [],

      testimonies:
        topTestimonies.data ??
        [],

      guidance:
        topGuidance.data ?? [],
    },
  });
}