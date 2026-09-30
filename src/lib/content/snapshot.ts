import {
  parseContentBlocks,
  parseInlineFormatting,
  type InlineToken,
} from "./formatter";

export type SnapshotBlock = {
  type: "paragraph" | "quote";
  tokens: InlineToken[];
};

export type FormattedSnapshotData = {
  title: string;
  author: string;
  category: string;
  blocks: SnapshotBlock[];
};

export function createFormattedSnapshotData({
  title,
  author,
  category,
  content,
}: {
  title: string;
  author?: string | null;
  category?: string | null;
  content: string;
}): FormattedSnapshotData {
  return {
    title:
      title.trim() ||
      "Untitled",

    author:
      author?.trim() ||
      "The Witness Team",

    category:
      category?.trim() ||
      "Faith",

    blocks: parseContentBlocks(
      content
    ).map((block) => ({
      type: block.type,

      tokens:
        parseInlineFormatting(
          block.content
        ),
    })),
  };
}

export function createTestimonySnapshotData({
  title,
  author,
  category,
  content,
}: {
  title: string;
  author?: string | null;
  category?: string | null;
  content: string;
}): FormattedSnapshotData {
  return createFormattedSnapshotData({
    title,

    author:
      author?.trim() ||
      "Anonymous",

    category:
      category?.trim() ||
      "Faith",

    content,
  });
}

export function createBlogSnapshotData({
  title,
  author,
  category,
  content,
}: {
  title: string;
  author?: string | null;
  category?: string | null;
  content: string;
}): FormattedSnapshotData {
  return createFormattedSnapshotData({
    title,

    author:
      author?.trim() ||
      "The Witness Team",

    category:
      category?.trim() ||
      "Teaching",

    content,
  });
}