"use client";

import {
  Loader2,
  X,
} from "lucide-react";

import {
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

export type BlogEditorPost = {
  id: string;

  title: string;

  category: string;

  author: string;

  content: string;
};

type Props = {
  post:
    | BlogEditorPost
    | null;

  categories:
    string[];

  onClose:
    () => void;

  onSaved: (
    message: string
  ) =>
    | Promise<void>
    | void;
};

export default function BlogEditor({
  post,
  categories,
  onClose,
  onSaved,
}: Props) {
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
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * CATEGORY
   */
  const finalCategory =
    category ===
    "__custom"
      ? customCategory.trim()
      : category.trim();

  /*
   * TITLE VALIDATION
   */
  const titleError =
    useMemo(
      () =>
        title.trim()
          ? validateTitle(
              title
            )
          : null,
      [title]
    );

  /*
   * UNIQUE CATEGORIES
   */
  const availableCategories =
    useMemo(
      () =>
        Array.from(
          new Set([
            "Teaching",
            ...categories,
            post?.category,
          ].filter(
            (
              item
            ): item is string =>
              Boolean(
                item
              )
          ))
        ).sort(),
      [
        categories,
        post?.category,
      ]
    );

  /*
   * FORM VALIDITY
   */
  const valid =
    Boolean(
      title.trim() &&
        !titleError &&
        content.trim() &&
        (
          category !==
            "__custom" ||
          customCategory.trim()
        )
    );

  /*
   * SUBMIT
   */
  const submit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const validationError =
        validateTitle(
          title
        );

      if (
        validationError
      ) {
        setError(
          validationError
        );

        return;
      }

      if (
        category ===
          "__custom" &&
        !customCategory.trim()
      ) {
        setError(
          "Enter a category name."
        );

        return;
      }

      if (
        !content.trim()
      ) {
        setError(
          "Article content is required."
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
                  title:
                    title.trim(),

                  category:
                    finalCategory ||
                    "Teaching",

                  author:
                    author.trim() ||
                    "The Witness Team",

                  content:
                    content.trim(),
                }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
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
    <div
      className="fixed inset-0 z-[85] overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-editor-title"
    >
      <div className="mx-auto w-full max-w-[920px] overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-2xl">
        {/* ===================================
            HEADER
        =================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-accent">
              Publishing
            </span>

            <h2
              id="blog-editor-title"
              className="mt-2 text-lg font-extrabold text-white"
            >
              {editing
                ? "Edit article"
                : "Create article"}
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              {editing
                ? "Update the article and save your changes."
                : "Write and publish a new teaching on The Witness Path."}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            aria-label="Close article editor"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <X
              size={15}
            />
          </button>
        </div>

        {/* ===================================
            FORM
        =================================== */}

        <form
          onSubmit={
            submit
          }
          className="p-5"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* ===============================
                EDITOR SIDE
            =============================== */}

            <div>
              {/* TITLE */}

              <div>
                <label className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
                  <span>
                    Article title
                  </span>

                  <span
                    className={`text-[10px] font-bold ${
                      title.length >
                      CONTENT_LIMITS.title
                        ? "text-red-400"
                        : title.length >
                            85
                          ? "text-accent"
                          : "text-slate-600"
                    }`}
                  >
                    {
                      title.length
                    }
                    /
                    {
                      CONTENT_LIMITS.title
                    }
                  </span>
                </label>

                <input
                  type="text"
                  value={
                    title
                  }
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
                  className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                />

                {titleError && (
                  <p className="mt-1.5 text-[10px] font-medium text-red-400">
                    {
                      titleError
                    }
                  </p>
                )}
              </div>

              {/* CATEGORY + AUTHOR */}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* CATEGORY */}

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
                    ) => {
                      setCategory(
                        event.target
                          .value
                      );

                      if (
                        event.target
                          .value !==
                        "__custom"
                      ) {
                        setCustomCategory(
                          ""
                        );
                      }
                    }}
                    className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3 text-xs text-white outline-none transition focus:border-accent/50"
                  >
                    {availableCategories.map(
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

                    <option value="__custom">
                      + New category
                    </option>
                  </select>

                  {category ===
                    "__custom" && (
                    <input
                      type="text"
                      value={
                        customCategory
                      }
                      onChange={(
                        event
                      ) =>
                        setCustomCategory(
                          event.target
                            .value
                        )
                      }
                      placeholder="Category name"
                      className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-primary px-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50"
                    />
                  )}
                </div>

                {/* AUTHOR */}

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Author
                  </label>

                  <input
                    type="text"
                    value={
                      author
                    }
                    onChange={(
                      event
                    ) =>
                      setAuthor(
                        event.target
                          .value
                      )
                    }
                    placeholder="The Witness Team"
                    className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50"
                  />
                </div>
              </div>

              {/* CONTENT */}

              <div className="mt-5">
                <RichTextEditor
                  label="Article content"
                  value={
                    content
                  }
                  onChange={
                    setContent
                  }
                  rows={16}
                  placeholder="Write the teaching..."
                />
              </div>
            </div>

            {/* ===============================
                LIVE PREVIEW
            =============================== */}

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
                  {title.trim() ||
                    "Your article title"}
                </h3>

                <p className="mt-2 text-[10px] text-slate-600">
                  By{" "}
                  {author.trim() ||
                    "The Witness Team"}
                </p>

                <div className="mt-5 max-h-[420px] overflow-y-auto font-serif text-sm leading-7 text-slate-300">
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

          {/* ===================================
              ERROR
          =================================== */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-xs font-medium text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* ===================================
              ACTIONS
          =================================== */}

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                submitting
              }
              className="min-h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400 transition hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                !valid
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xs font-extrabold text-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting && (
                <Loader2
                  size={
                    13
                  }
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