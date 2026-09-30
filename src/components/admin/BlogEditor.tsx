"use client";

import {
  useMemo,
  useState,
} from "react";

import RichTextEditor from "@/components/editor/RichTextEditor";
import FormattedContent from "@/components/editor/FormattedContent";

import {
  CONTENT_LIMITS,
  validateTitle,
} from "@/lib/validation/content";

type BlogEditorValue = {
  title: string;
  category: string;
  author: string;
  content: string;
};

type Props = {
  initialValue?: Partial<BlogEditorValue>;

  mode?:
    | "create"
    | "edit";

  onSubmit?: (
    value: BlogEditorValue
  ) => Promise<void> | void;
};

const categories = [
  "Teaching",
  "Faith",
  "Christian Living",
  "Prayer",
  "Relationships",
  "Spiritual Growth",
];

export default function BlogEditor({
  initialValue,
  mode = "create",
  onSubmit,
}: Props) {
  const [title, setTitle] =
    useState(
      initialValue?.title ?? ""
    );

  const [
    category,
    setCategory,
  ] = useState(
    initialValue?.category ??
      "Teaching"
  );

  const [author, setAuthor] =
    useState(
      initialValue?.author ?? ""
    );

  const [
    content,
    setContent,
  ] = useState(
    initialValue?.content ?? ""
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const titleError =
    useMemo(
      () =>
        title.length
          ? validateTitle(title)
          : null,
      [title]
    );

  const valid =
    Boolean(
      title.trim() &&
        !titleError &&
        category.trim() &&
        content.trim()
    );

  const submit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const error =
      validateTitle(title);

    if (error) {
      setMessage(error);
      return;
    }

    if (!content.trim()) {
      setMessage(
        "Article content is required."
      );

      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await onSubmit?.({
        title:
          title.trim(),

        category:
          category.trim(),

        author:
          author.trim() ||
          "The Witness Team",

        content:
          content.trim(),
      });
    } catch {
      setMessage(
        "The article could not be saved."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      {/* TITLE */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-xs font-bold text-slate-300">
            Article title
          </label>

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
            {title.length}/
            {
              CONTENT_LIMITS.title
            }
          </span>
        </div>

        <input
          type="text"
          value={title}
          maxLength={
            CONTENT_LIMITS.title
          }
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          placeholder="Article title"
          className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
        />

        {titleError && (
          <p className="mt-1.5 text-[10px] text-red-400">
            {titleError}
          </p>
        )}
      </div>

      {/* META */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold text-slate-300">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none focus:border-accent/50"
          >
            {categories.map(
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

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-300">
            Author
          </label>

          <input
            type="text"
            value={author}
            onChange={(event) =>
              setAuthor(
                event.target.value
              )
            }
            placeholder="The Witness Team"
            className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-accent/50"
          />
        </div>
      </div>

      {/* CONTENT */}
      <RichTextEditor
        label="Article content"
        value={content}
        onChange={setContent}
        rows={16}
        placeholder="Write the article..."
      />

      {/* PREVIEW */}
      {content.trim() && (
        <div className="rounded-2xl border border-white/10 bg-primary p-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
            Live Preview
          </span>

          <div className="mt-4 font-serif text-sm text-slate-200">
            <FormattedContent
              content={content}
            />
          </div>
        </div>
      )}

      {/* MESSAGE */}
      {message && (
        <p className="text-xs text-red-400">
          {message}
        </p>
      )}

      {/* SUBMIT */}
      <div className="flex justify-end border-t border-white/10 pt-5">
        <button
          type="submit"
          disabled={
            !valid ||
            submitting
          }
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-xs font-extrabold text-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Publish Article"}
        </button>
      </div>
    </form>
  );
}