"use client";

import {
  ChevronDown,
  MessageCircle,
  Send,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

import CommentItem from "./CommentItem";

import type {
  TestimonyComment,
} from "@/lib/types/comment";

type Props = {
  testimonyId: string;
  initialCount?: number;
};

export default function Comments({
  testimonyId,
  initialCount = 0,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [loaded, setLoaded] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [comments, setComments] =
    useState<TestimonyComment[]>([]);

  const [author, setAuthor] =
    useState("");

  const [content, setContent] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const loadComments = async () => {
    if (loaded || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/testimonies/${testimonyId}/comments`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error();
      }

      setComments(
        result.comments ?? []
      );

      setLoaded(true);
    } catch {
      setMessage(
        "We couldn't load the encouraging words right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = async () => {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen && !loaded) {
      await loadComments();
    }
  };

  const submitComment = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!content.trim()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/testimonies/${testimonyId}/comments`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            author,
            content,
            website,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to submit comment."
        );
      }

      setAuthor("");
      setContent("");
      setWebsite("");

      setMessage(
        "Your encouraging word has been received and is awaiting review."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your comment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-slate-200 dark:border-slate-800">
      {/* COLLAPSED HEADER */}
      <button
        type="button"
        onClick={toggleComments}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-5 py-6 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <MessageCircle size={17} />
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Community
            </span>

            <h2 className="mt-0.5 text-sm font-extrabold text-slate-900 dark:text-white">
              Encouraging Words

              <span className="ml-2 font-medium text-slate-400">
                ({initialCount})
              </span>
            </h2>
          </div>
        </div>

        <span
          className={`flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition duration-300 dark:border-slate-700 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={17} />
        </span>
      </button>

      {/* COLLAPSIBLE BODY */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-7">
            {loading && (
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />

                    <div className="mt-4 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />

                    <div className="mt-2 h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            )}

            {!loading &&
              loaded &&
              comments.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center dark:border-slate-700">
                  <p className="text-xs text-slate-400">
                    No encouraging words yet.
                    Be the first to leave one.
                  </p>
                </div>
              )}

            {!loading &&
              comments.length > 0 && (
                <div className="space-y-3">
                  {comments.map(
                    (comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={{
                          ...comment,
                          postId: testimonyId,
                        }}
                      />
                    )
                  )}
                </div>
              )}

            {/* LEAVE COMMENT */}
            <form
              onSubmit={submitComment}
              className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Leave an encouraging word
              </h3>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                Your message will be reviewed
                before it appears publicly.
              </p>

              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  value={author}
                  onChange={(event) =>
                    setAuthor(
                      event.target.value
                    )
                  }
                  placeholder="Your name (optional)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  required
                  rows={4}
                  placeholder="Write something encouraging..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs leading-6 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                {/* Honeypot */}
                <input
                  type="text"
                  value={website}
                  onChange={(event) =>
                    setWebsite(
                      event.target.value
                    )
                  }
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute left-[-9999px] h-px w-px"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {message && (
                    <p className="text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                      {message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !content.trim()
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-500"
                >
                  <Send size={14} />

                  {submitting
                    ? "Sending..."
                    : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}