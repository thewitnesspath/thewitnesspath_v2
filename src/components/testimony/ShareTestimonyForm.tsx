"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
  const [
    title,
    setTitle,
  ] = useState("");

  const [
    author,
    setAuthor,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState(
    "Faith"
  );

  const [
    content,
    setContent,
  ] = useState("");

  const [
    anonymous,
    setAnonymous,
  ] = useState(false);

  const [
    website,
    setWebsite,
  ] = useState("");

  const [
    status,
    setStatus,
  ] =
    useState<SubmissionState>(
      "idle"
    );

  const [
    message,
    setMessage,
  ] = useState("");

  const titleError =
    title.length > 0
      ? validateTitle(
          title
        )
      : null;

  const canSubmit =
    title.trim().length >
      0 &&
    title.length <=
      CONTENT_LIMITS.title &&
    content.trim().length >
      0 &&
    (anonymous ||
      author
        .trim()
        .length > 0) &&
    status !==
      "submitting";

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (!canSubmit) {
        return;
      }

      setStatus(
        "submitting"
      );

      setMessage("");

      try {
        const response =
          await fetch(
            "/api/testimonies",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  title,
                  author,
                  category,
                  content,
                  anonymous,
                  website,
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
              "Submission failed."
          );
        }

        setStatus(
          "success"
        );

        setMessage(
          result.message ||
            "Your testimony has been received."
        );

        setTitle("");
        setAuthor("");
        setCategory(
          "Faith"
        );
        setContent("");
        setAnonymous(
          false
        );
        setWebsite("");
      } catch (
        error
      ) {
        setStatus(
          "error"
        );

        setMessage(
          error instanceof
            Error
            ? error.message
            : "We couldn't submit your testimony."
        );
      }
    };

  /* ======================================================
     SUCCESS STATE
  ====================================================== */

  if (
    status ===
    "success"
  ) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-[#07162E]/10 bg-white shadow-[0_20px_60px_rgba(7,22,46,0.06)] transition-colors duration-300 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        {/* ACCENT */}

        <div className="h-[3px] bg-[#F59E0B]" />

        {/* DECORATIVE GLOW */}

        <div className="pointer-events-none absolute -right-20 top-10 size-64 rounded-full bg-[#F59E0B]/[0.06] blur-3xl dark:bg-[#F59E0B]/[0.04]" />

        <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-14">
          {/* ICON */}

          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#D97706] dark:border-[#F59E0B]/25 dark:bg-[#F59E0B]/10 dark:text-[#F59E0B]">
            <Check
              size={27}
              strokeWidth={
                2
              }
            />
          </div>

          <span className="mt-7 block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
            Testimony
            received
          </span>

          <h2 className="mx-auto mt-3 max-w-[620px] font-serif text-4xl leading-[1.02] tracking-[-0.045em] text-[#07162E] sm:text-5xl dark:text-white">
            Thank you for
            sharing.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {message}
          </p>

          <div className="mx-auto mt-6 flex max-w-lg items-start justify-center gap-2 rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-4 py-3 text-left dark:border-white/10 dark:bg-[#06111F]">
            <ShieldCheck
              size={16}
              className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
            />

            <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Every public
              testimony is
              reviewed before
              publication.
              This helps us
              protect privacy
              and care for the
              community.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setStatus(
                  "idle"
                );

                setMessage(
                  ""
                );
              }}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-xs font-extrabold text-[#07162E] transition hover:-translate-y-0.5 hover:bg-amber-400"
            >
              <RotateCcw
                size={
                  14
                }
                className="transition-transform duration-300 group-hover:-rotate-12"
              />

              Share another
              testimony
            </button>

            <Link
              href="/testimonies"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#07162E]/10 bg-white px-5 text-xs font-bold text-[#07162E] transition hover:border-[#F59E0B]/50 hover:bg-[#FFFDF8] dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:hover:border-[#F59E0B]/40 dark:hover:bg-[#0E1628]"
            >
              <ArrowLeft
                size={
                  14
                }
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Read
              testimonies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     FORM
  ====================================================== */

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-8"
    >
      {/* =================================================
          HONEYPOT
      ================================================= */}

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
          onChange={(
            event
          ) =>
            setWebsite(
              event.target
                .value
            )
          }
        />
      </div>

      {/* =================================================
          INTRO
      ================================================= */}

      <div className="flex flex-col gap-3 border-b border-[#07162E]/10 pb-7 sm:flex-row sm:items-start sm:justify-between dark:border-white/10">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.19em] text-[#D97706] dark:text-[#F59E0B]">
            Your testimony
          </p>

          <h3 className="mt-2 font-serif text-2xl tracking-[-0.035em] text-[#07162E] dark:text-white">
            Share honestly.
            Write freely.
          </h3>
        </div>

        <p className="max-w-sm text-[11px] leading-5 text-slate-500 dark:text-slate-400">
          Fields marked by
          their context are
          required before the
          testimony can be
          submitted.
        </p>
      </div>

      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* TITLE */}

        <div className="md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="testimony-title"
              className="text-[12px] font-extrabold text-[#07162E] dark:text-slate-100"
            >
              Testimony
              title
            </label>

            <span
              className={`text-[10px] font-bold ${
                title.length >
                CONTENT_LIMITS.title
                  ? "text-red-500"
                  : title.length >=
                      80
                    ? "text-[#D97706] dark:text-[#F59E0B]"
                    : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {title.length}/
              {
                CONTENT_LIMITS.title
              }
            </span>
          </div>

          <input
            id="testimony-title"
            type="text"
            value={title}
            maxLength={
              CONTENT_LIMITS.title +
              20
            }
            onChange={(
              event
            ) =>
              setTitle(
                event.target
                  .value
              )
            }
            placeholder="Give your testimony a simple, clear title"
            className="mt-2 min-h-[50px] w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-4 py-3.5 text-sm text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:placeholder:text-slate-600"
          />

          {titleError && (
            <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
              {
                titleError
              }
            </p>
          )}
        </div>

        {/* CATEGORY */}

        <div>
          <label
            htmlFor="testimony-category"
            className="text-[12px] font-extrabold text-[#07162E] dark:text-slate-100"
          >
            Category
          </label>

          <select
            id="testimony-category"
            value={category}
            onChange={(
              event
            ) =>
              setCategory(
                event.target
                  .value
              )
            }
            className="mt-2 min-h-[50px] w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-4 py-3.5 text-sm text-[#07162E] outline-none transition focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white"
          >
            {categories.map(
              (
                categoryName
              ) => (
                <option
                  key={
                    categoryName
                  }
                  value={
                    categoryName
                  }
                >
                  {
                    categoryName
                  }
                </option>
              )
            )}
          </select>
        </div>

        {/* NAME */}

        <div>
          <label
            htmlFor="testimony-author"
            className="text-[12px] font-extrabold text-[#07162E] dark:text-slate-100"
          >
            Your name
          </label>

          <input
            id="testimony-author"
            type="text"
            value={
              anonymous
                ? ""
                : author
            }
            disabled={
              anonymous
            }
            onChange={(
              event
            ) =>
              setAuthor(
                event.target
                  .value
              )
            }
            placeholder={
              anonymous
                ? "Your testimony will appear as Anonymous"
                : "How should your name appear?"
            }
            className="mt-2 min-h-[50px] w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-4 py-3.5 text-sm text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:placeholder:text-slate-600 dark:disabled:bg-[#0E1628] dark:disabled:text-slate-600"
          />

          <label className="mt-3 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={
                anonymous
              }
              onChange={(
                event
              ) =>
                setAnonymous(
                  event.target
                    .checked
                )
              }
              className="mt-0.5 size-4 shrink-0 accent-[#F59E0B]"
            />

            <span className="text-[11px] font-medium leading-5 text-slate-600 dark:text-slate-400">
              Publish my
              testimony
              anonymously
            </span>
          </label>
        </div>
      </div>

      {/* =================================================
          TESTIMONY BODY
      ================================================= */}

      <div className="border-t border-[#07162E]/10 pt-7 dark:border-white/10">
        <div className="mb-4">
          <label className="text-[12px] font-extrabold text-[#07162E] dark:text-slate-100">
            Your testimony
          </label>

          <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-500 dark:text-slate-400">
            Share what
            happened, what
            changed, and what
            you want someone
            else to remember
            from your story.
            The body has no
            character limit.
          </p>
        </div>

        {/* RichTextEditor may have its own styling.
            This wrapper gives it the correct themed
            surrounding surface. */}

        <div className="overflow-hidden rounded-[16px] border border-[#07162E]/10 bg-[#FFFDF8] transition-colors dark:border-white/10 dark:bg-[#06111F]">
          <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your testimony here..."
            />
        </div>
      </div>

      {/* =================================================
          PREVIEW
      ================================================= */}

      {content
        .trim()
        .length >
        0 && (
        <div className="rounded-[16px] border border-[#07162E]/10 bg-[#FFFDF8] p-5 transition-colors dark:border-white/10 dark:bg-[#06111F]">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles
              size={
                14
              }
              className="text-[#D97706] dark:text-[#F59E0B]"
            />

            <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Preview
            </span>
          </div>

         {content.trim().length > 0 && (
            <ContentPreview
              content={content}
            />
          )}
        </div>
      )}

      {/* =================================================
          MODERATION NOTICE
      ================================================= */}

      <div className="flex gap-3 rounded-[16px] border border-[#F59E0B]/25 bg-[#F59E0B]/[0.07] p-4 transition-colors dark:border-[#F59E0B]/20 dark:bg-[#F59E0B]/[0.06]">
        <ShieldCheck
          size={17}
          className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
        />

        <div>
          <p className="text-[11px] font-extrabold text-[#07162E] dark:text-slate-100">
            Reviewed before
            publication
          </p>

          <p className="mt-1 text-[11px] leading-5 text-slate-600 dark:text-slate-400">
            Your testimony
            will first be
            reviewed by The
            Witness Path team
            before it appears
            publicly. This
            helps protect
            privacy and keep
            the platform safe.
          </p>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {status ===
        "error" &&
        message && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 dark:border-red-500/20 dark:bg-red-950/25 dark:text-red-300"
          >
            {message}
          </div>
        )}

      {/* =================================================
          SUBMIT
      ================================================= */}

      <div className="flex flex-col gap-5 border-t border-[#07162E]/10 pt-7 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <p className="max-w-md text-[11px] leading-5 text-slate-500 dark:text-slate-400">
          You can take your
          time. Your story
          does not need to
          sound polished to
          matter.
        </p>

        <button
          type="submit"
          disabled={
            !canSubmit
          }
          className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#07162E] px-6 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(7,22,46,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0B1A2A] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:bg-[#F59E0B] dark:text-[#07162E] dark:shadow-[0_10px_24px_rgba(245,158,11,0.12)] dark:hover:bg-amber-400"
        >
          {status ===
          "submitting" ? (
            <>
              <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />

              Submitting...
            </>
          ) : (
            <>
              Submit
              Testimony

              <Send
                size={
                  14
                }
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}