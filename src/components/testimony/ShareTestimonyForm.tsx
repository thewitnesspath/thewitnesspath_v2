"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import RichTextEditor from "@/components/editor/RichTextEditor";
import ContentPreview from "@/components/editor/ContentPreview";

import {
  CONTENT_LIMITS,
  validateTitle,
} from "@/lib/validation/content";

const categories = [
  "Provision",
  "Healing",
  "Restoration",
  "Deliverance",
  "Answered Prayer",
  "Faith",
  "Breakthrough",
  "Family",
  "Career",
  "Education",
  "Other",
];

type SubmissionState =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export default function ShareTestimonyForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] =
    useState("Faith");
  const [content, setContent] = useState("");

  const [anonymous, setAnonymous] =
    useState(false);

  const [website, setWebsite] =
    useState("");

  const [status, setStatus] =
    useState<SubmissionState>("idle");

  const [message, setMessage] =
    useState("");

  const titleError =
    title.length > 0
      ? validateTitle(title)
      : null;

  const canSubmit =
    title.trim().length > 0 &&
    title.length <= CONTENT_LIMITS.title &&
    content.trim().length > 0 &&
    (anonymous ||
      author.trim().length > 0) &&
    status !== "submitting";

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canSubmit) return;

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch(
        "/api/testimonies",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title,
            author,
            category,
            content,
            anonymous,
            website,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Submission failed."
        );
      }

      setStatus("success");

      setMessage(
        result.message ||
          "Your testimony has been received."
      );

      setTitle("");
      setAuthor("");
      setCategory("Faith");
      setContent("");
      setAnonymous(false);
      setWebsite("");
    } catch (error) {
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "We couldn't submit your testimony."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
        <div className="h-1 bg-amber-500" />

        <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-600">
            ✓
          </div>

          <span className="mt-6 block text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-700">
            Testimony received
          </span>

          <h2 className="mx-auto mt-3 max-w-lg text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Thank you for sharing what God has done.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {message}
          </p>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-400">
            Every public testimony is reviewed before
            publication.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setMessage("");
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950"
            >
              Share another testimony
            </button>

            <Link
              href="/testimonies"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Read testimonies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >
      {/* Honeypot */}
      <div
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">
          Website
        </label>

        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) =>
            setWebsite(event.target.value)
          }
        />
      </div>

      {/* TITLE */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="testimony-title"
            className="text-sm font-bold text-slate-900 dark:text-white"
          >
            Testimony title
          </label>

          <span
            className={`text-[11px] font-semibold ${
              title.length >
              CONTENT_LIMITS.title
                ? "text-red-500"
                : title.length >= 80
                  ? "text-amber-600"
                  : "text-slate-400"
            }`}
          >
            {title.length}/
            {CONTENT_LIMITS.title}
          </span>
        </div>

        <input
          id="testimony-title"
          type="text"
          value={title}
          maxLength={
            CONTENT_LIMITS.title + 20
          }
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Give your testimony a clear title"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        {titleError && (
          <p className="mt-2 text-xs font-medium text-red-500">
            {titleError}
          </p>
        )}
      </div>

      {/* NAME / ANONYMOUS */}
      <div>
        <label
          htmlFor="testimony-author"
          className="text-sm font-bold text-slate-900 dark:text-white"
        >
          Your name
        </label>

        <input
          id="testimony-author"
          type="text"
          value={
            anonymous ? "" : author
          }
          disabled={anonymous}
          onChange={(event) =>
            setAuthor(event.target.value)
          }
          placeholder="How should your name appear?"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
        />

        <label className="mt-3 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(event) =>
              setAnonymous(
                event.target.checked
              )
            }
            className="size-4 accent-amber-500"
          />

          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Publish my testimony
            anonymously
          </span>
        </label>
      </div>

      {/* CATEGORY */}
      <div>
        <label
          htmlFor="testimony-category"
          className="text-sm font-bold text-slate-900 dark:text-white"
        >
          Category
        </label>

        <select
          id="testimony-category"
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          {categories.map(
            (categoryName) => (
              <option
                key={categoryName}
                value={categoryName}
              >
                {categoryName}
              </option>
            )
          )}
        </select>
      </div>

      {/* TESTIMONY BODY */}
      <div>
        <div className="mb-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white">
            Your testimony
          </label>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Tell the story in your own
            words. The body has no
            character limit.
          </p>
        </div>

        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Share what God has done..."
        />
      </div>

      {/* PREVIEW */}
      <ContentPreview
        content={content}
      />

      {/* MODERATION MESSAGE */}
      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <span
          aria-hidden="true"
          className="mt-0.5"
        >
          ✦
        </span>

        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Reviewed before publication
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
            Your testimony will first be
            reviewed by The Witness Path
            team before it appears publicly.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {status === "error" &&
        message && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
          >
            {message}
          </div>
        )}

      {/* SUBMIT */}
      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <p className="max-w-md text-xs leading-5 text-slate-400">
          Your testimony does not need to
          sound polished. Share it
          honestly.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-500"
        >
          {status === "submitting"
            ? "Submitting..."
            : "Submit Testimony"}
        </button>
      </div>
    </form>
  );
}