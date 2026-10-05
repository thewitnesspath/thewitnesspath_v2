"use client";

import Image from "next/image";

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

import {
  useRouter,
} from "next/navigation";

import type {
  BlogPost,
} from "@/lib/types/blog";

import {
  getBlogImage,
} from "@/lib/content-images";

type Props = {
  post: BlogPost;
};

export default function BlogCard({
  post,
}: Props) {
  const router =
    useRouter();

  const [
    saved,
    setSaved,
  ] = useState(false);

  useEffect(() => {
    setSaved(
      localStorage.getItem(
        `saved_blog_${post.id}`
      ) === "true"
    );
  }, [post.id]);

  const openArticle =
    () => {
      router.push(
        `/blog/${post.id}`
      );
    };

  const toggleBookmark =
    (
      event:
        | React.MouseEvent
        | React.KeyboardEvent
    ) => {
      event.stopPropagation();

      const key =
        `saved_blog_${post.id}`;

      const nextSaved =
        !saved;

      if (nextSaved) {
        localStorage.setItem(
          key,
          "true"
        );
      } else {
        localStorage.removeItem(
          key
        );
      }

      setSaved(
        nextSaved
      );

      window.dispatchEvent(
        new Event(
          "blog-saved-changed"
        )
      );
    };

  const snippet =
    post.content.length >
    180
      ? `${post.content
          .slice(0, 180)
          .trimEnd()}…`
      : post.content;

  const image =
    getBlogImage(
      post.category
    );

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={
        openArticle
      }
      onKeyDown={(
        event
      ) => {
        if (
          event.key ===
            "Enter" ||
          event.key ===
            " "
        ) {
          event.preventDefault();

          openArticle();
        }
      }}
      className="group flex h-full min-h-[500px] cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[#07162E]/10 bg-white shadow-[0_12px_35px_rgba(7,22,46,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/40 hover:shadow-[0_22px_55px_rgba(7,22,46,0.10)] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none"
    >
      {/* IMAGE */}

      <div className="relative h-[220px] shrink-0 overflow-hidden bg-slate-100 md:h-[205px] dark:bg-[#0E1628]">
        <Image
          src={image}
          alt={`${post.category || "Teaching"} article`}
          fill
          sizes="(max-width: 767px) 86vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.045]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/65 via-[#06111F]/5 to-transparent" />

        {/* CATEGORY */}

        <span className="absolute bottom-4 left-4 max-w-[70%] truncate rounded-full border border-[#F59E0B]/60 bg-[#06111F]/70 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.17em] text-white backdrop-blur-md">
          {post.category ||
            "Teaching"}
        </span>

        {/* BOOKMARK */}

        <button
          type="button"
          onClick={
            toggleBookmark
          }
          onKeyDown={(
            event
          ) =>
            event.stopPropagation()
          }
          aria-label={
            saved
              ? "Remove saved article"
              : "Save article"
          }
          className={`absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
            saved
              ? "border-[#F59E0B] bg-[#F59E0B] text-[#07162E]"
              : "border-white/30 bg-[#06111F]/45 text-white hover:border-[#F59E0B] hover:text-[#F59E0B]"
          }`}
        >
          {saved ? (
            <BookmarkCheck
              size={15}
            />
          ) : (
            <Bookmark
              size={15}
            />
          )}
        </button>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
          By{" "}
          {post.author ||
            "The Witness Team"}
        </p>

        <h2 className="mt-3 font-serif text-[28px] leading-[1.05] tracking-[-0.04em] text-[#07162E] transition-colors duration-300 group-hover:text-[#D97706] dark:text-white dark:group-hover:text-[#F59E0B]">
          {post.title}
        </h2>

        <p className="mt-4 line-clamp-4 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
          {snippet}
        </p>

        {/* FOOTER */}

        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between gap-4 border-t border-[#07162E]/10 pt-4 dark:border-white/10">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#07162E] dark:text-white">
              Read Article

              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              <MessageCircle
                size={13}
              />

              {post.commentCount ??
                0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}