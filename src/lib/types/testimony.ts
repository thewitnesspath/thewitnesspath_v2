export type TestimonyRecord = {
  id: number;
  Title: string | null;
  author: string | null;
  category: string | null;
  content: string | null;
  amen_count: number | null;
  is_approved: boolean | null;
  views: number | null;
  created_at?: string | null;
};

export type Testimony = {
  id: string;
  title: string;
  author: string;
  category: string;
  content: string;
  amenCount: number;
  views: number;
};

export function mapTestimony(
  record: TestimonyRecord
): Testimony {
  return {
    id: String(record.id),
    title:
      record.Title?.trim() ||
      "Untitled testimony",

    author:
      record.author?.trim() ||
      "Anonymous",

    category:
      record.category?.trim() ||
      "Faith",

    content:
      record.content?.trim() || "",

    amenCount:
      record.amen_count ?? 0,

    views:
      record.views ?? 0,
  };
}