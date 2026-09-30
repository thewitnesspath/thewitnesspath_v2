import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  CONTENT_LIMITS,
  validateTitle,
} from "@/lib/validation/content";

export const runtime =
  "nodejs";

function canAccess(
  role?: string
) {
  return (
    role === "main" ||
    role === "blogger"
  );
}

function createSlug(
  title: string
) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

/*
 * LOAD POSTS
 */
export async function GET() {
  const session =
    await getAdminSession();

  if (
    !session ||
    !canAccess(
      session.role
    )
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

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("BlogPosts")
    .select(`
      id,
      title,
      slug,
      category,
      author,
      content,
      likes,
      views,
      created_at,
      edit_code,
      BlogComments(
        id,
        is_approved
      )
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      "Unable to load admin blog posts:",
      error.message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Blog posts could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  const posts =
    (data ?? []).map(
      (item) => {
        const comments =
          item.BlogComments ??
          [];

        return {
          id: String(
            item.id
          ),

          title:
            item.title?.trim() ||
            "Untitled article",

          slug:
            item.slug?.trim() ||
            "",

          category:
            item.category?.trim() ||
            "Teaching",

          author:
            item.author?.trim() ||
            "The Witness Team",

          content:
            item.content ?? "",

          likes:
            item.likes ?? 0,

          views:
            item.views ?? 0,

          createdAt:
            item.created_at ??
            null,

          commentCount:
            comments.length,

          approvedComments:
            comments.filter(
              (comment) =>
                comment.is_approved ===
                true
            ).length,

          /*
           * Legacy behaviour:
           * Main Admin sees the code.
           * Blogger does not.
           */
          editCode:
            session.role ===
            "main"
              ? item.edit_code ??
                null
              : undefined,
        };
      }
    );

  /*
   * Build categories from actual
   * existing content instead of
   * inventing a category system.
   */
  const categories =
    Array.from(
      new Set([
        "Teaching",

        ...posts.map(
          (post) =>
            post.category
        ),
      ])
    )
      .filter(Boolean)
      .sort();

  return NextResponse.json(
    {
      success: true,

      posts,

      categories,

      counts: {
        posts:
          posts.length,

        comments:
          posts.reduce(
            (
              total,
              post
            ) =>
              total +
              post.commentCount,
            0
          ),

        views:
          posts.reduce(
            (
              total,
              post
            ) =>
              total +
              post.views,
            0
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

/*
 * CREATE ARTICLE
 */
export async function POST(
  request: Request
) {
  const session =
    await getAdminSession();

  if (
    !session ||
    !canAccess(
      session.role
    )
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

  try {
    const body =
      await request.json();

    const title =
      typeof body.title ===
      "string"
        ? body.title.trim()
        : "";

    const category =
      typeof body.category ===
      "string"
        ? body.category.trim()
        : "";

    const author =
      typeof body.author ===
      "string"
        ? body.author.trim()
        : "";

    const content =
      typeof body.content ===
      "string"
        ? body.content.trim()
        : "";

    const titleError =
      validateTitle(
        title
      );

    if (titleError) {
      return NextResponse.json(
        {
          success: false,
          message:
            titleError,
        },
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Article content is required.",
        },
        {
          status: 400,
        }
      );
    }

    const slug =
      createSlug(title);

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("BlogPosts")
      .insert([
        {
          title,

          slug,

          category:
            category ||
            "Teaching",

          author:
            author ||
            "The Witness Team",

          content,

          likes: 0,

          views: 0,
        },
      ])
      .select(
        `
          id,
          title,
          slug,
          edit_code
        `
      )
      .single();

    if (error) {
      console.error(
        "Unable to publish blog post:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "The article could not be published.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      post: data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while publishing.",
      },
      {
        status: 500,
      }
    );
  }
}