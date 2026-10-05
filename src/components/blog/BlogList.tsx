"use client";

import {
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
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [query, setQuery] =
    useState("");

  const [savedVersion, setSavedVersion] =
    useState(0);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        posts
          .map((post) => post.category)
          .filter(
            (category): category is string =>
              Boolean(category)
          )
      )
    );

    return [
      "All",
      ...values,
      "Saved",
    ];
  }, [posts]);

  useEffect(() => {
    const refreshSaved = () => {
      setSavedVersion(
        (current) => current + 1
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

    return () => {
      window.removeEventListener(
        "storage",
        refreshSaved
      );

      window.removeEventListener(
        "focus",
        refreshSaved
      );
    };
  }, []);

  const visiblePosts =
    useMemo(() => {
      void savedVersion;

      let filtered = posts;

      if (
        activeCategory === "Saved"
      ) {
        if (
          typeof window ===
          "undefined"
        ) {
          return [];
        }

        filtered = filtered.filter(
          (post) =>
            localStorage.getItem(
              `saved_blog_${post.id}`
            ) === "true"
        );
      } else if (
        activeCategory !== "All"
      ) {
        filtered = filtered.filter(
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
        (post) =>
          post.title
            .toLowerCase()
            .includes(search) ||
          post.content
            .toLowerCase()
            .includes(search) ||
          (post.author ?? "")
          .toLowerCase()
          .includes(search)
      );
    }, [
      activeCategory,
      posts,
      query,
      savedVersion,
    ]);

  return (
    <div>
      {/* SEARCH */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value
            )
          }
          placeholder="Search teachings, titles or keywords..."
          className="h-11 w-full rounded-xl border border-white/10 bg-secondary pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
        />

        {query && (
          <button
            type="button"
            onClick={() =>
              setQuery("")
            }
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map(
          (category) => {
            const active =
              activeCategory ===
              category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
                className={`shrink-0 rounded-lg border px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "border-accent bg-accent text-primary"
                    : "border-white/10 bg-secondary text-slate-300 hover:border-accent/30 hover:text-accent"
                }`}
              >
                {category}
              </button>
            );
          }
        )}
      </div>

      {/* RESULTS META */}
      {(query ||
        activeCategory !==
          "All") && (
        <p className="mt-4 text-[11px] font-medium text-slate-500">
          {visiblePosts.length}{" "}
          {visiblePosts.length === 1
            ? "article"
            : "articles"}{" "}
          found
        </p>
      )}

      {/* POSTS */}
      {visiblePosts.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visiblePosts.map(
            (post) => (
              <BlogCard
                key={post.id}
                post={post}
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-secondary px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-400">
            {query
              ? `No articles matched "${query}".`
              : activeCategory ===
                  "Saved"
                ? "No saved articles yet."
                : "No articles are available in this category yet."}
          </p>
        </div>
      )}
    </div>
  );
}