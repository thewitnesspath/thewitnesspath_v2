"use client";

import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type {
  BlogPost,
} from "@/lib/types/blog";

type Props = {
  post: BlogPost;
};

export default function BlogCard({
  post,
}: Props) {
  const router = useRouter();

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    setSaved(
      localStorage.getItem(
        `saved_blog_${post.id}`
      ) === "true"
    );
  }, [post.id]);

  const openArticle = () => {
    router.push(
      `/blog/${post.slug || post.id}`
    );
  };

  const toggleBookmark = (
    event:
      | React.MouseEvent
      | React.KeyboardEvent
  ) => {
    event.stopPropagation();

    const key =
      `saved_blog_${post.id}`;

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

  const snippet =
    post.content.length > 180
      ? `${post.content.slice(0, 180)}...`
      : post.content;

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openArticle}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openArticle();
        }
      }}
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-secondary p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)] focus:outline-none focus:ring-2 focus:ring-accent/60"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-accent">
            {post.category}
          </span>

          <button
            type="button"
            onClick={toggleBookmark}
            onKeyDown={(event) =>
              event.stopPropagation()
            }
            className={`relative z-10 flex size-8 items-center justify-center rounded-lg border transition ${
              saved
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-white/10 text-slate-400 hover:border-accent/30 hover:text-accent"
            }`}
            aria-label={
              saved
                ? "Remove saved article"
                : "Save article"
            }
          >
            {saved ? (
              <BookmarkCheck
                size={15}
              />
            ) : (
              <Bookmark size={15} />
            )}
          </button>
        </div>

        <h2 className="mt-5 text-lg font-extrabold leading-snug tracking-[-0.02em] text-white transition group-hover:text-accent">
          {post.title}
        </h2>

        <p className="mt-2 text-[11px] font-medium text-slate-500">
          By {post.author}
        </p>

        <p className="mt-4 text-sm leading-7 text-slate-300">
          {snippet}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">
          Read Article
          <ArrowUpRight size={14} />
        </span>

        <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
          <MessageCircle size={13} />

          {post.commentCount}
        </span>
      </div>
    </article>
  );
}