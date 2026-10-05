"use client";

import {
  Bookmark,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import BlogCard from "./BlogCard";

import type {
  BlogPost,
} from "@/lib/types/blog";

type Props = {
  posts: BlogPost[];
};

export default function BlogList({
  posts,
}: Props) {
  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    savedVersion,
    setSavedVersion,
  ] = useState(0);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories =
    useMemo(() => {
      const values =
        Array.from(
          new Set(
            posts
              .map(
                (post) =>
                  post.category
              )
              .filter(
                (
                  category
                ): category is string =>
                  Boolean(
                    category
                  )
              )
          )
        );

      return [
        "All",
        ...values,
        "Saved",
      ];
    }, [posts]);

  /* =======================================================
     SAVED ARTICLE REFRESH
  ======================================================= */

  useEffect(() => {
    const refreshSaved =
      () => {
        setSavedVersion(
          (current) =>
            current + 1
        );
      };

    window.addEventListener(
      "storage",
      refreshSaved
    );

    window.addEventListener(
      "focus",
      refreshSaved
    );

    window.addEventListener(
      "blog-saved-changed",
      refreshSaved
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshSaved
      );

      window.removeEventListener(
        "focus",
        refreshSaved
      );

      window.removeEventListener(
        "blog-saved-changed",
        refreshSaved
      );
    };
  }, []);

  /* =======================================================
     FILTERING
  ======================================================= */

  const visiblePosts =
    useMemo(() => {
      void savedVersion;

      let filtered =
        posts;

      if (
        activeCategory ===
        "Saved"
      ) {
        if (
          typeof window ===
          "undefined"
        ) {
          return [];
        }

        filtered =
          filtered.filter(
            (post) =>
              localStorage.getItem(
                `saved_blog_${post.id}`
              ) === "true"
          );
      } else if (
        activeCategory !==
        "All"
      ) {
        filtered =
          filtered.filter(
            (post) =>
              post.category ===
              activeCategory
          );
      }

      const search =
        query
          .trim()
          .toLowerCase();

      if (!search) {
        return filtered;
      }

      return filtered.filter(
        (post) => {
          const text = [
            post.title,
            post.content,
            post.author,
            post.category,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return text.includes(
            search
          );
        }
      );
    }, [
      activeCategory,
      posts,
      query,
      savedVersion,
    ]);

  const hasFilters =
    Boolean(
      query.trim()
    ) ||
    activeCategory !==
      "All";

  const clearFilters =
    () => {
      setQuery("");
      setActiveCategory(
        "All"
      );
    };

  return (
    <div>
      {/* ===================================================
          SEARCH / FILTER PANEL
      =================================================== */}

      <div className="rounded-[20px] border border-[#07162E]/10 bg-white p-4 shadow-[0_10px_35px_rgba(7,22,46,0.04)] sm:p-5 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
        {/* SEARCH */}

        <div>
          <label
            htmlFor="blog-search"
            className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500"
          >
            Search the blog
          </label>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(
                event
              ) =>
                setQuery(
                  event.target
                    .value
                )
              }
              placeholder="Search teachings, titles or keywords..."
              className="min-h-[48px] w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] py-3 pl-11 pr-11 text-[13px] text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:placeholder:text-slate-600"
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-[#07162E]/5 hover:text-[#07162E] dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X
                  size={14}
                />
              </button>
            )}
          </div>
        </div>

        {/* FILTERS */}

        <div className="mt-5">
          <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Browse by category
          </p>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map(
              (
                category
              ) => {
                const active =
                  activeCategory ===
                  category;

                const saved =
                  category ===
                  "Saved";

                return (
                  <button
                    key={
                      category
                    }
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2.5 text-[10px] font-bold transition duration-300 ${
                      active
                        ? "border-[#07162E] bg-[#07162E] text-white dark:border-[#F59E0B] dark:bg-[#F59E0B] dark:text-[#07162E]"
                        : "border-[#07162E]/10 bg-[#FFFDF8] text-slate-500 hover:border-[#F59E0B]/50 hover:text-[#D97706] dark:border-white/10 dark:bg-[#06111F] dark:text-slate-400 dark:hover:border-[#F59E0B]/50 dark:hover:text-[#F59E0B]"
                    }`}
                  >
                    {saved && (
                      <Bookmark
                        size={11}
                      />
                    )}

                    {category}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          RESULT INFORMATION
      =================================================== */}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="font-extrabold text-[#07162E] dark:text-white">
            {
              visiblePosts.length
            }
          </span>{" "}
          {visiblePosts.length ===
          1
            ? "article"
            : "articles"}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="text-[11px] font-bold text-[#D97706] transition hover:text-[#A85D00] dark:text-[#F59E0B] dark:hover:text-amber-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ===================================================
          MOBILE CAROUSEL HINT
      =================================================== */}

      {visiblePosts.length >
        1 && (
        <div className="mt-5 flex items-center justify-between md:hidden">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Swipe to explore
          </span>

          <span className="text-[10px] font-bold text-[#D97706] dark:text-[#F59E0B]">
            Slide →
          </span>
        </div>
      )}

      {/* ===================================================
          POSTS

          MOBILE:
          horizontal carousel

          TABLET:
          2 columns

          DESKTOP:
          3 columns
      =================================================== */}

      {visiblePosts.length >
      0 ? (
        <>
          <div
            className="
              -mx-4
              mt-4
              flex
              snap-x
              snap-mandatory
              gap-4
              overflow-x-auto
              scroll-smooth
              px-4
              pb-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:-mx-6
              sm:px-6

              md:mx-0
              md:grid
              md:grid-cols-2
              md:gap-5
              md:overflow-visible
              md:px-0
              md:pb-0

              xl:grid-cols-3
            "
          >
            {visiblePosts.map(
              (post) => (
                <div
                  key={
                    post.id
                  }
                  className="
                    min-w-[86%]
                    snap-start

                    sm:min-w-[68%]

                    md:min-w-0
                  "
                >
                  <BlogCard
                    post={
                      post
                    }
                  />
                </div>
              )
            )}
          </div>

          {/* MOBILE VISUAL INDICATORS */}

          {visiblePosts.length >
            1 && (
            <div className="mt-1 flex items-center justify-center gap-1.5 md:hidden">
              {visiblePosts.map(
                (post) => (
                  <span
                    key={
                      post.id
                    }
                    className="size-1.5 rounded-full bg-[#07162E]/20 dark:bg-white/20"
                  />
                )
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-[20px] border border-dashed border-[#07162E]/15 bg-white/60 px-6 py-14 text-center dark:border-white/10 dark:bg-[#0B1A2A]/60">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {query
              ? `No articles matched "${query}".`
              : activeCategory ===
                  "Saved"
                ? "You haven't saved any articles yet."
                : "No articles are available in this category yet."}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="mt-5 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-[10px] font-extrabold text-[#07162E]"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}