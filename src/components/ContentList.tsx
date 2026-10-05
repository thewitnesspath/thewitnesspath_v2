"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Testimony } from "@/lib/types/testimony";
import type { BlogPost } from "@/lib/types/blog";

type Entry = Testimony | BlogPost;

type ContentListProps = {
  entries: Entry[];
  type: "testimony" | "blog";
};

function getEntryTitle(item: Entry) {
  return "Title" in item
    ? item.Title
    : item.title;
}

function getEntryId(item: Entry) {
  return String(item.id);
}

function getEntryHref(
  item: Entry,
  type: "testimony" | "blog"
) {
  if (type === "testimony") {
    return `/testimonies/${item.id}`;
  }

  /*
   * Blog posts use their slug when available.
   * Fall back to the ID only if necessary.
   */
  if (
    "slug" in item &&
    item.slug
  ) {
    return `/blog/${item.slug}`;
  }

  return `/blog/${item.id}`;
}

export default function ContentList({
  entries,
  type,
}: ContentListProps) {
  const [search, setSearch] =
    useState("");

  const [
    category,
    setCategory,
  ] = useState("All");

  const [
    savedOnly,
    setSavedOnly,
  ] = useState(false);

  const [
    savedIds,
    setSavedIds,
  ] = useState<string[]>(
    []
  );

  /*
   * Load saved entries from
   * localStorage after mount.
   */
  useEffect(() => {
    const ids = entries
      .filter((item) => {
        const id =
          getEntryId(
            item
          );

        return (
          localStorage.getItem(
            `saved_${type}_${id}`
          ) === "true"
        );
      })
      .map((item) =>
        getEntryId(item)
      );

    setSavedIds(ids);
  }, [entries, type]);

  function toggleSaved(
    id: string
  ) {
    const key =
      `saved_${type}_${id}`;

    const currentlySaved =
      savedIds.includes(id);

    const nextSaved =
      !currentlySaved;

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

    setSavedIds(
      (currentIds) =>
        nextSaved
          ? currentIds.includes(
              id
            )
            ? currentIds
            : [
                ...currentIds,
                id,
              ]
          : currentIds.filter(
              (value) =>
                value !== id
            )
    );
  }

  const categories =
    useMemo(() => {
      return [
        "All",

        ...new Set(
          entries.map(
            (item) =>
              item.category ||
              "Other"
          )
        ),
      ];
    }, [entries]);

  const filtered =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return entries.filter(
        (item) => {
          const title =
            getEntryTitle(
              item
            );

          const id =
            getEntryId(
              item
            );

          const searchableText =
            `${title || ""} ${
              item.content ||
              ""
            }`.toLowerCase();

          const matchesSearch =
            !keyword ||
            searchableText.includes(
              keyword
            );

          const matchesCategory =
            category ===
              "All" ||
            item.category ===
              category;

          const matchesSaved =
            !savedOnly ||
            savedIds.includes(
              id
            );

          return (
            matchesSearch &&
            matchesCategory &&
            matchesSaved
          );
        }
      );
    }, [
      entries,
      search,
      category,
      savedOnly,
      savedIds,
    ]);

  return (
    <>
      {/* SEARCH + FILTERS */}
      <div className="feed-tools">
        <label htmlFor="feed-search">
          Search{" "}
          {type ===
          "testimony"
            ? "testimonies"
            : "articles"}
        </label>

        <input
          id="feed-search"
          type="search"
          value={search}
          onChange={(
            event
          ) =>
            setSearch(
              event.target
                .value
            )
          }
          placeholder="Search title or content"
        />

        <div
          className="chips"
          aria-label="Categories"
        >
          <button
            type="button"
            className={
              savedOnly
                ? "chosen"
                : ""
            }
            onClick={() =>
              setSavedOnly(
                (value) =>
                  !value
              )
            }
            aria-pressed={
              savedOnly
            }
          >
            ☆ Saved
          </button>

          {categories.map(
            (name) => (
              <button
                key={name}
                type="button"
                className={
                  !savedOnly &&
                  category ===
                    name
                    ? "chosen"
                    : ""
                }
                aria-pressed={
                  !savedOnly &&
                  category ===
                    name
                }
                onClick={() => {
                  setCategory(
                    name
                  );

                  setSavedOnly(
                    false
                  );
                }}
              >
                {name}
              </button>
            )
          )}
        </div>
      </div>

      {/* RESULT COUNT */}
      <p
        className="result-count"
        aria-live="polite"
      >
        {filtered.length}{" "}
        {type ===
        "testimony"
          ? filtered.length ===
            1
            ? "testimony"
            : "testimonies"
          : filtered.length ===
            1
          ? "article"
          : "articles"}
      </p>

      {/* CONTENT GRID */}
      <div className="story-grid">
        {filtered.map(
          (item) => {
            const id =
              getEntryId(
                item
              );

            const title =
              getEntryTitle(
                item
              );

            const isSaved =
              savedIds.includes(
                id
              );

            const content =
              item.content ||
              "";

            const href =
              getEntryHref(
                item,
                type
              );

            return (
              <article
                className="story-card"
                key={`${type}-${id}`}
              >
                <button
                  type="button"
                  className="save-button"
                  onClick={() =>
                    toggleSaved(
                      id
                    )
                  }
                  aria-label={`${
                    isSaved
                      ? "Remove saved"
                      : "Save"
                  } ${
                    type ===
                    "testimony"
                      ? "testimony"
                      : "article"
                  }`}
                  aria-pressed={
                    isSaved
                  }
                >
                  {isSaved
                    ? "★"
                    : "☆"}
                </button>

                <Link
                  href={href}
                  className="card-link"
                >
                  <span className="pill">
                    {item.category ||
                      "Faith"}
                  </span>

                  <h2>
                    {String(
                      title ||
                        "Untitled"
                    )}
                  </h2>

                  <span className="card-author">
                    By{" "}
                    {item.author ||
                      (type ===
                      "testimony"
                        ? "Anonymous"
                        : "The Witness Team")}
                  </span>

                  <p>
                    {content.slice(
                      0,
                      185
                    )}

                    {content.length >
                    185
                      ? "…"
                      : ""}
                  </p>

                  <strong>
                    Read{" "}
                    {type ===
                    "testimony"
                      ? "testimony"
                      : "article"}{" "}
                    <span
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </strong>
                </Link>
              </article>
            );
          }
        )}
      </div>

      {/* EMPTY STATE */}
      {filtered.length ===
        0 && (
        <p className="empty-state">
          {savedOnly
            ? `You haven't saved any ${
                type ===
                "testimony"
                  ? "testimonies"
                  : "articles"
              } yet.`
            : "No matches found. Try another keyword or category."}
        </p>
      )}
    </>
  );
}