"use client";

import {
  Camera,
  Loader2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  createBlogSnapshotData,
} from "@/lib/content/snapshot";

import {
  downloadFormattedSnapshot,
} from "@/lib/content/canvas-snapshot";

type Props = {
  postId: string;

  title: string;

  author: string;

  category: string;

  content: string;
};

export default function BlogSnapshotButton({
  postId,
  title,
  author,
  category,
  content,
}: Props) {
  const [
    generating,
    setGenerating,
  ] = useState(false);

  const generate =
    async () => {
      setGenerating(true);

      try {
        const data =
          createBlogSnapshotData({
            title,
            author,
            category,
            content,
          });

        await downloadFormattedSnapshot(
          {
            data,

            contentType:
              "Blog",

            filePrefix:
              "Blog",

            id: postId,
          }
        );
      } finally {
        setGenerating(false);
      }
    };

  return (
    <button
      type="button"
      onClick={generate}
      disabled={generating}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-accent/20 bg-secondary px-3.5 text-xs font-bold text-white transition hover:border-accent/50 hover:text-accent disabled:opacity-50"
    >
      {generating ? (
        <Loader2
          size={14}
          className="animate-spin"
        />
      ) : (
        <Camera size={14} />
      )}

      {generating
        ? "Generating..."
        : "Snapshot Article"}
    </button>
  );
}