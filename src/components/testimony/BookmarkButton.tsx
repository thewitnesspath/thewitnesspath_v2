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
  testimonyId: string;
};

export default function BookmarkButton({
  testimonyId,
}: Props) {
  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    const isSaved =
      localStorage.getItem(
        `saved_testimony_${testimonyId}`
      ) === "true";

    setSaved(isSaved);
  }, [testimonyId]);

  const toggleBookmark = () => {
    const key =
      `saved_testimony_${testimonyId}`;

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
      onClick={toggleBookmark}
      className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition ${
        saved
          ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      }`}
    >
      {saved ? (
        <BookmarkCheck size={15} />
      ) : (
        <Bookmark size={15} />
      )}

      {saved
        ? "Saved"
        : "Save Testimony"}
    </button>
  );
}