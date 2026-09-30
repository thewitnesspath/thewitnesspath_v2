"use client";

import {
  Heart,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type Props = {
  postId: string;
  initialCount: number;
};

export default function BlogLikeButton({
  postId,
  initialCount,
}: Props) {
  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(initialCount);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    setLiked(
      localStorage.getItem(
        `liked_blog_${postId}`
      ) === "true"
    );
  }, [postId]);

  const likeArticle = async () => {
    if (liked || loading) return;

    const previous = likes;

    setLiked(true);
    setLikes(
      (current) => current + 1
    );
    setLoading(true);

    try {
      const response = await fetch(
        `/api/blog/${postId}/like`,
        {
          method: "POST",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error();
      }

      setLikes(result.likes);

      localStorage.setItem(
        `liked_blog_${postId}`,
        "true"
      );
    } catch {
      setLiked(false);
      setLikes(previous);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={likeArticle}
      disabled={liked || loading}
      className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition ${
        liked
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-white/10 bg-secondary text-slate-300 hover:border-accent/40 hover:text-accent"
      }`}
    >
      <Heart
        size={15}
        fill={
          liked
            ? "currentColor"
            : "none"
        }
      />

      <span>Like</span>

      <span className="text-slate-500">
        ({likes})
      </span>
    </button>
  );
}