"use client";

import {
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type Props = {
  postId: string;
};

export default function BlogBookmarkButton({
  postId,
}: Props) {
  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    setSaved(
      localStorage.getItem(
        `saved_blog_${postId}`
      ) === "true"
    );
  }, [postId]);

  const toggleSaved = () => {
    const key =
      `saved_blog_${postId}`;

    if (saved) {
      localStorage.removeItem(key);
      setSaved(false);
      return;
    }

    localStorage.setItem(
      key,
      "true"
    );

    setSaved(true);
  };

  return (
    <button
      type="button"
      onClick={toggleSaved}
      className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition ${
        saved
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-white/10 bg-secondary text-slate-300 hover:border-accent/40 hover:text-accent"
      }`}
    >
      {saved ? (
        <BookmarkCheck
          size={15}
        />
      ) : (
        <Bookmark size={15} />
      )}

      {saved
        ? "Saved"
        : "Save Article"}
    </button>
  );
}