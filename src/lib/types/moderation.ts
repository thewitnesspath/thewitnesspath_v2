export type ModerationKind =
  | "testimony-comment"
  | "testimony-reply"
  | "blog-comment"
  | "blog-reply";

export type ModerationItem = {
  id: string;

  kind: ModerationKind;

  author: string;

  content: string;

  likes?: number;

  parentId?: string;

  parentLabel: string;
};