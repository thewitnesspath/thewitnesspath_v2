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
  type FormEvent,
} from "react";

import RichTextEditor from "@/components/editor/RichTextEditor";
import FormattedContent from "@/components/editor/FormattedContent";

import {
  CONTENT_LIMITS,
  validateTitle,
} from "@/lib/validation/content";

import type {
  AdminRole,
} from "@/lib/admin/roles";

type Props = {
  role: AdminRole;
};

type BlogAdminPost = {
  id: string;

  title: string;

  slug: string;

  category: string;

  author: string;

  content: string;

  likes: number;

  views: number;

  createdAt?:
    | string
    | null;

  commentCount: number;

  approvedComments: number;

  editCode?:
    | string
    | null;
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
  ] = useState(true);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("All");

  const [
    editorPost,
    setEditorPost,
  ] =
    useState<
      BlogAdminPost | "new" | null
    >(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<BlogAdminPost | null>(
      null
    );

  const [
    deletionPin,
    setDeletionPin,
  ] = useState("");

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

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

        if (!response.ok) {
          throw new Error();
        }

        setData(result);
      } catch {
        setMessage(
          "Blog content could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    useMemo(() => {
      let posts =
        data?.posts ?? [];

      if (
        category !== "All"
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

      if (!search) {
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
            .includes(search)
      );
    }, [
      data,
      category,
      query,
    ]);

  const remove =
    async () => {
      if (
        !deleteTarget ||
        !deletionPin.trim()
      ) {
        return;
      }

      setDeleting(true);
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

        if (!response.ok) {
          throw new Error(
            result.message
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
      } catch {
        setMessage(
          "Incorrect deletion password or the article could not be deleted."
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <div>
      {/* HEADER */}
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

        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent"
          >
            <RefreshCw
              size={13}
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
            className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-accent px-3.5 text-[11px] font-extrabold text-primary"
          >
            <Plus size={13} />

            New article
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <BlogStat
          label="Articles"
          value={
            data?.counts
              .posts ?? 0
          }
        />

        <BlogStat
          label="Views"
          value={
            data?.counts
              .views ?? 0
          }
        />

        <BlogStat
          label="Comments"
          value={
            data?.counts
              .comments ?? 0
          }
        />
      </div>

      {/* FILTER BAR */}
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_190px]">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />

          <input
            value={query}
            onChange={(
              event
            ) =>
              setQuery(
                event.target
                  .value
              )
            }
            placeholder="Search articles..."
            className="h-11 w-full rounded-xl border border-white/10 bg-secondary pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
          />
        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target
                .value
            )
          }
          className="h-11 rounded-xl border border-white/10 bg-secondary px-3 text-xs font-semibold text-slate-300 outline-none focus:border-accent/40"
        >
          <option value="All">
            All categories
          </option>

          {(
            data?.categories ??
            []
          ).map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-white/10 bg-secondary px-4 py-3 text-xs text-slate-300">
          {message}
        </div>
      )}

      {/* LIST */}
      {loading ? (
        <div className="mt-5 space-y-3">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-white/10 bg-secondary"
              />
            )
          )}
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-secondary py-14 text-center">
          <p className="text-xs font-bold text-slate-400">
            No articles found.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map(
            (post) => (
              <article
                key={
                  post.id
                }
                className="rounded-2xl border border-white/10 bg-secondary p-4 transition hover:border-white/15 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
                        {
                          post.category
                        }
                      </span>

                      {role ===
                        "main" &&
                        post.editCode && (
                          <span className="rounded-md border border-white/10 bg-primary px-2 py-1 font-mono text-[9px] text-slate-500">
                            Code:{" "}
                            {
                              post.editCode
                            }
                          </span>
                        )}
                    </div>

                    <h2 className="mt-3 text-sm font-extrabold leading-6 text-white sm:text-base">
                      {post.title}
                    </h2>

                    <p className="mt-1 text-[10px] font-medium text-slate-500">
                      By{" "}
                      {post.author}
                    </p>

                    <p className="mt-3 line-clamp-2 max-w-3xl text-xs leading-6 text-slate-400">
                      {post.content}
                    </p>

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
                          {new Intl.DateTimeFormat(
                            "en",
                            {
                              day: "numeric",
                              month:
                                "short",
                              year: "numeric",
                            }
                          ).format(
                            new Date(
                              post.createdAt
                            )
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
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
                        size={12}
                      />

                      Edit
                    </button>

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
                        size={12}
                      />

                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}

      {/* EDITOR */}
      {editorPost && (
        <BlogEditorModal
          post={
            editorPost ===
            "new"
              ? null
              : editorPost
          }
          categories={
            data?.categories ??
            ["Teaching"]
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

            setMessage(text);

            await load();
          }}
        />
      )}

      {/* DELETE */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[410px] rounded-2xl border border-white/10 bg-secondary p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <LockKeyhole
                  size={16}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
                className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <h2 className="mt-5 text-lg font-extrabold text-white">
              Delete article?
            </h2>

            <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-400">
              {deleteTarget.title}
            </p>

            <input
              type="password"
              value={
                deletionPin
              }
              onChange={(
                event
              ) =>
                setDeletionPin(
                  event.target
                    .value
                )
              }
              placeholder="Deletion password"
              className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-red-400/50"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
                className="min-h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={remove}
                disabled={
                  deleting ||
                  !deletionPin.trim()
                }
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-500 px-4 text-xs font-extrabold text-white disabled:opacity-40"
              >
                {deleting && (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                )}

                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogEditorModal({
  post,
  categories,
  onClose,
  onSaved,
}: {
  post:
    | BlogAdminPost
    | null;

  categories: string[];

  onClose: () => void;

  onSaved: (
    message: string
  ) => Promise<void> | void;
}) {
  const editing =
    Boolean(post);

  const [
    title,
    setTitle,
  ] = useState(
    post?.title ?? ""
  );

  const [
    category,
    setCategory,
  ] = useState(
    post?.category ??
      "Teaching"
  );

  const [
    customCategory,
    setCustomCategory,
  ] = useState("");

  const [
    author,
    setAuthor,
  ] = useState(
    post?.author ?? ""
  );

  const [
    content,
    setContent,
  ] = useState(
    post?.content ?? ""
  );

  const [
    editCode,
    setEditCode,
  ] = useState(
    post?.editCode ?? ""
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const finalCategory =
    category === "__custom"
      ? customCategory.trim()
      : category;

  const submit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const titleError =
      validateTitle(
        title
      );

    if (titleError) {
      setError(
        titleError
      );

      return;
    }

    if (!content.trim()) {
      setError(
        "Article content is required."
      );

      return;
    }

    if (
      editing &&
      !editCode.trim()
    ) {
      setError(
        "Enter the unique edit code."
      );

      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response =
        await fetch(
          editing
            ? `/api/admin/blog/${post?.id}`
            : "/api/admin/blog",
          {
            method:
              editing
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                title,

                category:
                  finalCategory ||
                  "Teaching",

                author,

                content,

                editCode:
                  editing
                    ? editCode
                    : undefined,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to save article."
        );

        return;
      }

      await onSaved(
        editing
          ? "Article updated."
          : "Article published."
      );
    } catch {
      setError(
        "Unable to save article."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[85] overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[920px] overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-accent">
              Publishing
            </span>

            <h2 className="mt-2 text-lg font-extrabold text-white">
              {editing
                ? "Edit article"
                : "Create article"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="p-5"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* EDITOR SIDE */}
            <div>
              <label className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
                <span>
                  Article title
                </span>

                <span
                  className={`text-[10px] ${
                    title.length >
                    CONTENT_LIMITS.title
                      ? "text-red-400"
                      : "text-slate-600"
                  }`}
                >
                  {title.length}/
                  {
                    CONTENT_LIMITS.title
                  }
                </span>
              </label>

              <input
                value={title}
                maxLength={
                  CONTENT_LIMITS.title
                }
                onChange={(
                  event
                ) =>
                  setTitle(
                    event.target
                      .value
                  )
                }
                placeholder="Article title"
                className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-accent/50"
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Category
                  </label>

                  <select
                    value={
                      category
                    }
                    onChange={(
                      event
                    ) =>
                      setCategory(
                        event.target
                          .value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3 text-xs text-white outline-none focus:border-accent/50"
                  >
                    {Array.from(
                      new Set([
                        "Teaching",
                        ...categories,
                      ])
                    ).map(
                      (item) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item}
                        </option>
                      )
                    )}

                    <option value="__custom">
                      + New category
                    </option>
                  </select>

                  {category ===
                    "__custom" && (
                    <input
                      value={
                        customCategory
                      }
                      onChange={(
                        event
                      ) =>
                        setCustomCategory(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Category name"
                      className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-primary px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-accent/50"
                    />
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Author
                  </label>

                  <input
                    value={author}
                    onChange={(
                      event
                    ) =>
                      setAuthor(
                        event.target
                          .value
                      )
                    }
                    placeholder="The Witness Team"
                    className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-accent/50"
                  />
                </div>
              </div>

              <div className="mt-5">
                <RichTextEditor
                  label="Article content"
                  value={content}
                  onChange={
                    setContent
                  }
                  rows={16}
                  placeholder="Write the teaching..."
                />
              </div>

              {editing && (
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Unique edit code
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={14}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type="password"
                      value={
                        editCode
                      }
                      onChange={(
                        event
                      ) =>
                        setEditCode(
                          event.target
                            .value
                        )
                      }
                      placeholder="Enter edit code"
                      className="h-11 w-full rounded-xl border border-white/10 bg-primary pl-10 pr-3.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-accent/50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PREVIEW */}
            <aside className="lg:sticky lg:top-5 lg:self-start">
              <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-600">
                Live preview
              </p>

              <div className="rounded-2xl border border-white/10 bg-primary p-4">
                <span className="inline-block rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-accent">
                  {finalCategory ||
                    "Teaching"}
                </span>

                <h3 className="mt-3 text-lg font-extrabold leading-snug text-white">
                  {title ||
                    "Your article title"}
                </h3>

                <p className="mt-2 text-[10px] text-slate-600">
                  By{" "}
                  {author.trim() ||
                    "The Witness Team"}
                </p>

                <div className="mt-5 max-h-[420px] overflow-y-auto font-serif text-sm text-slate-300">
                  {content.trim() ? (
                    <FormattedContent
                      content={
                        content
                      }
                    />
                  ) : (
                    <p className="text-xs leading-6 text-slate-600">
                      Start writing
                      to preview the
                      article here.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {error && (
            <p className="mt-5 text-xs font-medium text-red-400">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                !title.trim() ||
                !content.trim() ||
                (editing &&
                  !editCode.trim())
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xs font-extrabold text-primary disabled:opacity-40"
            >
              {submitting && (
                <Loader2
                  size={13}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Publish article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
        ).format(value)}
      </p>

      <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}