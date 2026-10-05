export type BlogCommentRecord = {
  id: number;
  is_approved?: boolean | null;
};

export type BlogPostRecord = {
  id: number;
  title: string | null;
  slug: string | null;
  category: string | null;
  author: string | null;
  content: string | null;
  likes: number | null;
  views: number | null;
  created_at?: string | null;

  BlogComments?: BlogCommentRecord[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug?: string | null;
  category?: string | null;
  author?: string | null;
  content: string;
  likes?: number | null;
  views?: number | null;
  createdAt?: string | null;
  commentCount: number;
};

export function mapBlogPost(
  record: BlogPostRecord
): BlogPost {
  const approvedComments =
    record.BlogComments?.filter(
      (comment) =>
        comment.is_approved !== false
    ) ?? [];

  return {
    id: String(record.id),

    title:
      record.title?.trim() ||
      "Untitled article",

    slug:
      record.slug?.trim() ||
      String(record.id),

    category:
      record.category?.trim() ||
      "Teaching",

    author:
      record.author?.trim() ||
      "The Witness Team",

    content:
      record.content?.trim() || "",

    likes:
      record.likes ?? 0,

    views:
      record.views ?? 0,

    createdAt:
      record.created_at ?? null,

    commentCount:
      approvedComments.length,
  };
}