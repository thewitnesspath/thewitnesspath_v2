import { supabase } from "@/lib/supabase/client";

import {
  mapTestimony,
  type Testimony,
  type TestimonyRecord,
} from "@/lib/types/testimony";

import {
  mapBlogPost,
  type BlogPost,
  type BlogPostRecord,
} from "@/lib/types/blog";

export type WordOfWeek = {
  id: string;
  title: string;
  author: string;
  content: string;
};

/* =========================================================
   TESTIMONIES
   ========================================================= */

export async function listTestimonies(): Promise<Testimony[]> {
  const { data, error } = await supabase
    .from("Testimonies")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as TestimonyRecord[]).map(
    mapTestimony
  );
}

export async function getTestimony(
  id: string
): Promise<Testimony | null> {
  const { data, error } = await supabase
    .from("Testimonies")
    .select("*")
    .eq("id", id)
    .eq("is_approved", true)
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to fetch testimony:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return mapTestimony(
    data as TestimonyRecord
  );
}

/* =========================================================
   TESTIMONY COMMENTS
   ========================================================= */

export async function getTestimonyCommentCount(
  testimonyId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("Comments")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("testimony_id", testimonyId)
    .eq("is_approved", true);

  if (error) {
    console.error(
      "Unable to count testimony comments:",
      error
    );

    return 0;
  }

  return count ?? 0;
}

/* =========================================================
   BLOG
   ========================================================= */

export async function listBlogPosts(): Promise<
  BlogPost[]
> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select(
      `
        *,
        BlogComments(
          id,
          is_approved
        )
      `
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Unable to fetch blog posts:",
      error
    );

    return [];
  }

  return ((data ?? []) as BlogPostRecord[]).map(
    mapBlogPost
  );
}

export async function getBlogPost(
  identifier: string
): Promise<BlogPost | null> {
  // Try the existing slug first.
  const { data: slugMatch } =
    await supabase
      .from("BlogPosts")
      .select(
        `
          *,
          BlogComments(
            id,
            is_approved
          )
        `
      )
      .eq("slug", identifier)
      .maybeSingle();

  if (slugMatch) {
    return mapBlogPost(
      slugMatch as BlogPostRecord
    );
  }

  // Fallback to old numeric IDs.
  if (/^\d+$/.test(identifier)) {
    const { data, error } =
      await supabase
        .from("BlogPosts")
        .select(
          `
            *,
            BlogComments(
              id,
              is_approved
            )
          `
        )
        .eq("id", identifier)
        .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapBlogPost(
      data as BlogPostRecord
    );
  }

  return null;
}

export async function getBlogCommentCount(
  postId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("BlogComments")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("post_id", postId)
    .eq("is_approved", true);

  if (error) {
    console.error(
      "Unable to count blog comments:",
      error
    );

    return 0;
  }

  return count ?? 0;
}

/* =========================================================
   WORD OF THE WEEK
   ========================================================= */

export async function wordOfTheWeek(): Promise<WordOfWeek | null> {
  const { data, error } = await supabase
    .from("WordOfTheWeekBank")
    .select(
      "id, title, author, content, created_at"
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to fetch Word of the Week:",
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: String(data.id),
    title:
      data.title?.trim() ||
      "Word of the Week",
    author:
      data.author?.trim() ||
      "The Witness Team",
    content:
      data.content?.trim() ||
      "",
  };
}