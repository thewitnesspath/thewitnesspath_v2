"use client";

import {
  Edit3,
  Eye,
  Heart,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import BlogEditor, {
  type BlogEditorPost,
} from "@/components/admin/BlogEditor";

import type {
  AdminRole,
} from "@/lib/admin/roles";

type Props = {
  role: AdminRole;
};

type BlogAdminPost =
  BlogEditorPost & {
    slug: string;

    likes: number;

    views: number;

    createdAt?:
      | string
      | null;

    commentCount: number;

    approvedComments: number;
  };

type BlogResult = {
  success: boolean;

  posts:
    BlogAdminPost[];

  categories:
    string[];

  counts: {
    posts: number;

    comments: number;

    views: number;
  };
};

function formatDate(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return "";
  }
}

export default function BlogWorkspace({
  role,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<BlogResult | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    category,
    setCategory,
  ] =
    useState("All");

  const [
    editorPost,
    setEditorPost,
  ] =
    useState<
      BlogAdminPost |
      "new" |
      null
    >(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<
      BlogAdminPost | null
    >(null);

  const [
    deletionPin,
    setDeletionPin,
  ] =
    useState("");

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  /*
   * LOAD BLOG DATA
   */
  const load =
    useCallback(async () => {
      setLoading(true);

      setMessage("");

      try {
        const response =
          await fetch(
            "/api/admin/blog",
            {
              cache:
                "no-store",
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            result.message ||
              "Unable to load blog."
          );
        }

        setData(
          result
        );
      } catch {
        setMessage(
          "Blog content could not be loaded."
        );
      } finally {
        setLoading(
          false
        );
      }
    }, []);

  useEffect(() => {
    load();
  }, [load]);

  /*
   * FILTER ARTICLES
   */
  const filtered =
    useMemo(() => {
      let posts =
        data?.posts ?? [];

      if (
        category !==
        "All"
      ) {
        posts =
          posts.filter(
            (post) =>
              post.category ===
              category
          );
      }

      const search =
        query
          .trim()
          .toLowerCase();

      if (
        !search
      ) {
        return posts;
      }

      return posts.filter(
        (post) =>
          [
            post.title,
            post.author,
            post.category,
            post.content,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              search
            )
      );
    }, [
      data,
      category,
      query,
    ]);

  /*
   * DELETE ARTICLE
   */
  const remove =
    async () => {
      if (
        !deleteTarget ||
        !deletionPin.trim()
      ) {
        return;
      }

      setDeleting(
        true
      );

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/admin/blog/${deleteTarget.id}`,
            {
              method:
                "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    deletionPin,
                  }
                ),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            result.message ||
              "Unable to delete article."
          );
        }

        setDeleteTarget(
          null
        );

        setDeletionPin(
          ""
        );

        setMessage(
          "Article deleted."
        );

        await load();
      } catch (
        error
      ) {
        setMessage(
          error instanceof
            Error &&
            error.message
            ? error.message
            : "Incorrect deletion password or the article could not be deleted."
        );
      } finally {
        setDeleting(
          false
        );
      }
    };

  /*
   * CLOSE DELETE MODAL
   */
  const closeDeleteModal =
    () => {
      if (
        deleting
      ) {
        return;
      }

      setDeleteTarget(
        null
      );

      setDeletionPin(
        ""
      );
    };

  return (
    <div>
      {/* ===================================
          HEADER
      =================================== */}

      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Publishing
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Blog
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Create and manage
            teachings published on
            The Witness Path.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={
              load
            }
            disabled={
              loading
            }
            className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setEditorPost(
                "new"
              )
            }
            className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-accent px-3.5 text-[11px] font-extrabold text-primary transition hover:brightness-105"
          >
            <Plus
              size={
                13
              }
            />

            New article
          </button>
        </div>
      </div>

      {/* ===================================
          STATS
      =================================== */}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <BlogStat
          label="Articles"
          value={
            data?.counts
              .posts ??
            0
          }
        />

        <BlogStat
          label="Views"
          value={
            data?.counts
              .views ??
            0
          }
        />

        <BlogStat
          label="Comments"
          value={
            data?.counts
              .comments ??
            0
          }
        />
      </div>

      {/* ===================================
          SEARCH + CATEGORY FILTER
      =================================== */}

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_190px]">
        <div className="relative">
          <Search
            size={
              15
            }
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />

          <input
            value={
              query
            }
            onChange={(
              event
            ) =>
              setQuery(
                event
                  .target
                  .value
              )
            }
            placeholder="Search articles..."
            className="h-11 w-full rounded-xl border border-white/10 bg-secondary pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
          />
        </div>

        <select
          value={
            category
          }
          onChange={(
            event
          ) =>
            setCategory(
              event
                .target
                .value
            )
          }
          className="h-11 rounded-xl border border-white/10 bg-secondary px-3 text-xs font-semibold text-slate-300 outline-none transition focus:border-accent/40"
        >
          <option value="All">
            All categories
          </option>

          {(
            data?.categories ??
            []
          ).map(
            (
              item
            ) => (
              <option
                key={
                  item
                }
                value={
                  item
                }
              >
                {
                  item
                }
              </option>
            )
          )}
        </select>
      </div>

      {/* ===================================
          MESSAGE
      =================================== */}

      {message && (
        <div className="mt-4 rounded-xl border border-white/10 bg-secondary px-4 py-3 text-xs text-slate-300">
          {
            message
          }
        </div>
      )}

      {/* ===================================
          LOADING
      =================================== */}

      {loading ? (
        <div className="mt-5 space-y-3">
          {Array.from({
            length: 4,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={
                  index
                }
                className="h-36 animate-pulse rounded-2xl border border-white/10 bg-secondary"
              />
            )
          )}
        </div>
      ) : filtered.length ===
        0 ? (
        /* =================================
           EMPTY STATE
        ================================= */

        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-secondary py-14 text-center">
          <p className="text-xs font-bold text-slate-400">
            {query ||
            category !==
              "All"
              ? "No articles match your filters."
              : "No articles found."}
          </p>
        </div>
      ) : (
        /* =================================
           ARTICLE LIST
        ================================= */

        <div className="mt-5 space-y-3">
          {filtered.map(
            (
              post
            ) => (
              <article
                key={
                  post.id
                }
                className="rounded-2xl border border-white/10 bg-secondary p-4 transition hover:border-white/15 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* ARTICLE INFO */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
                        {
                          post.category
                        }
                      </span>
                    </div>

                    <h2 className="mt-3 text-sm font-extrabold leading-6 text-white sm:text-base">
                      {
                        post.title
                      }
                    </h2>

                    <p className="mt-1 text-[10px] font-medium text-slate-500">
                      By{" "}
                      {
                        post.author
                      }
                    </p>

                    <p className="mt-3 line-clamp-2 max-w-3xl text-xs leading-6 text-slate-400">
                      {
                        post.content
                      }
                    </p>

                    {/* ARTICLE STATS */}

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Eye
                          size={
                            11
                          }
                        />

                        {
                          post.views
                        }{" "}
                        views
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Heart
                          size={
                            11
                          }
                        />

                        {
                          post.likes
                        }{" "}
                        likes
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <MessageCircle
                          size={
                            11
                          }
                        />

                        {
                          post.commentCount
                        }{" "}
                        comments
                      </span>

                      {post.createdAt && (
                        <span>
                          {formatDate(
                            post.createdAt
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* =================================
                      ACTIONS
                  ================================= */}

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditorPost(
                          post
                        )
                      }
                      className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent"
                    >
                      <Edit3
                        size={
                          12
                        }
                      />

                      Edit
                    </button>

                    {/* DELETE ONLY FOR MAIN ADMIN */}

                    {role ===
                      "main" && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(
                            post
                          );

                          setDeletionPin(
                            ""
                          );
                        }}
                        className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-red-500/20 px-3 text-[11px] font-bold text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2
                          size={
                            12
                          }
                        />

                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}

      {/* ===================================
          ARTICLE EDITOR
      =================================== */}

      {editorPost && (
        <BlogEditor
          post={
            editorPost ===
            "new"
              ? null
              : editorPost
          }
          categories={
            data?.categories ??
            [
              "Teaching",
            ]
          }
          onClose={() =>
            setEditorPost(
              null
            )
          }
          onSaved={async (
            text
          ) => {
            setEditorPost(
              null
            );

            setMessage(
              text
            );

            await load();
          }}
        />
      )}

      {/* ===================================
          DELETE MODAL
      =================================== */}

      {deleteTarget &&
        role ===
          "main" && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-blog-title"
          >
            <div className="w-full max-w-[410px] rounded-2xl border border-white/10 bg-secondary p-5 shadow-2xl">
              {/* MODAL TOP */}

              <div className="flex items-start justify-between gap-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <LockKeyhole
                    size={
                      16
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    deleting
                  }
                  aria-label="Close delete confirmation"
                  className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  <X
                    size={
                      15
                    }
                  />
                </button>
              </div>

              {/* TITLE */}

              <h2
                id="delete-blog-title"
                className="mt-5 text-lg font-extrabold text-white"
              >
                Delete article?
              </h2>

              {/* DESCRIPTION */}

              <p className="mt-2 text-xs leading-6 text-slate-400">
                This permanently
                removes “
                {
                  deleteTarget.title
                }
                ”.
              </p>

              <p className="mt-2 text-[10px] leading-5 text-slate-600">
                Enter the Witness
                Path deletion
                password to
                continue.
              </p>

              {/* PASSWORD */}

              <input
                type="password"
                value={
                  deletionPin
                }
                onChange={(
                  event
                ) =>
                  setDeletionPin(
                    event
                      .target
                      .value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                      "Enter" &&
                    deletionPin.trim() &&
                    !deleting
                  ) {
                    remove();
                  }
                }}
                autoComplete="current-password"
                placeholder="Deletion password"
                className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-red-400/50 focus:ring-4 focus:ring-red-500/10"
              />

              {/* ACTIONS */}

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    deleting
                  }
                  className="min-h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400 transition hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    remove
                  }
                  disabled={
                    deleting ||
                    !deletionPin.trim()
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-500 px-4 text-xs font-extrabold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleting && (
                    <Loader2
                      size={
                        13
                      }
                      className="animate-spin"
                    />
                  )}

                  {deleting
                    ? "Deleting..."
                    : "Delete permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

/*
 * BLOG STAT CARD
 */
function BlogStat({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-secondary p-3 sm:p-4">
      <p className="text-lg font-extrabold text-white sm:text-xl">
        {new Intl.NumberFormat(
          "en"
        ).format(
          value
        )}
      </p>

      <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600 sm:text-[10px]">
        {
          label
        }
      </p>
    </div>
  );
}