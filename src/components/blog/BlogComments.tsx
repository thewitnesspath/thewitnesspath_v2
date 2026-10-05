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

import BlogCommentItem from "./BlogCommentItem";

import type {
  BlogComment,
} from "@/lib/types/blog-comment";

type Props = {
  postId: string;
  initialCount: number;
};

export default function BlogComments({
  postId,
  initialCount,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    loaded,
    setLoaded,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    comments,
    setComments,
  ] = useState<
    BlogComment[]
  >([]);

  const [
    author,
    setAuthor,
  ] = useState("");

  const [
    content,
    setContent,
  ] = useState("");

  const [
    website,
    setWebsite,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  /* =====================================================
     LOAD COMMENTS
  ===================================================== */

  const loadComments =
    async () => {
      if (
        loaded ||
        loading
      ) {
        return;
      }

      setLoading(true);

      try {
        const response =
          await fetch(
            `/api/blog/${postId}/comments`,
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
          throw new Error();
        }

        setComments(
          result.comments ??
            []
        );

        setLoaded(
          true
        );
      } catch {
        setMessage(
          "Comments could not be loaded."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =====================================================
     TOGGLE
  ===================================================== */

  const toggle =
    async () => {
      const nextOpen =
        !open;

      setOpen(
        nextOpen
      );

      if (
        nextOpen &&
        !loaded
      ) {
        await loadComments();
      }
    };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const submitComment =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !content.trim()
      ) {
        return;
      }

      setSubmitting(
        true
      );

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/blog/${postId}/comments`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    author,
                    content,
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
            result.message
          );
        }

        setAuthor("");
        setContent("");
        setWebsite("");

        setMessage(
          "Your comment has been received and is awaiting review."
        );
      } catch {
        setMessage(
          "Your comment could not be submitted."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#07162E]/10 bg-white dark:border-white/10 dark:bg-[#0B1A2A]">
      {/* =================================================
          TOGGLE HEADER
      ================================================= */}

      <button
        type="button"
        onClick={
          toggle
        }
        aria-expanded={
          open
        }
        className="flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-[#07162E]/[0.025] sm:p-6 dark:hover:bg-white/[0.025]"
      >
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
            <MessageCircle
              size={16}
            />
          </div>

          <div className="min-w-0">
            <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#D97706] dark:text-[#F59E0B]">
              Discussion
            </span>

            <h2 className="mt-1 font-serif text-xl tracking-[-0.025em] text-[#07162E] dark:text-white">
              Comments{" "}
              <span className="font-sans text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                (
                {
                  initialCount
                }
                )
              </span>
            </h2>
          </div>
        </div>

        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-[#07162E]/10 text-slate-400 transition duration-300 dark:border-white/10 ${
            open
              ? "rotate-180 border-[#F59E0B]/50 text-[#D97706] dark:text-[#F59E0B]"
              : ""
          }`}
        >
          <ChevronDown
            size={15}
          />
        </span>
      </button>

      {/* =================================================
          OPEN CONTENT
      ================================================= */}

      {open && (
        <div className="border-t border-[#07162E]/10 px-5 pb-6 pt-5 sm:px-6 sm:pb-7 dark:border-white/10">
          {/* LOADING */}

          {loading && (
            <div className="rounded-xl border border-dashed border-[#07162E]/10 px-5 py-8 text-center dark:border-white/10">
              <p className="text-xs text-slate-400">
                Loading
                comments...
              </p>
            </div>
          )}

          {/* LOAD ERROR */}

          {message ===
            "Comments could not be loaded." && (
            <p className="mb-5 rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-xs text-red-600 dark:text-red-400">
              {message}
            </p>
          )}

          {/* EMPTY */}

          {!loading &&
            loaded &&
            comments.length ===
              0 && (
              <div className="rounded-xl border border-dashed border-[#07162E]/10 px-5 py-9 text-center dark:border-white/10">
                <MessageCircle
                  size={18}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />

                <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  No comments
                  yet.
                </p>

                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  Be the first
                  to join the
                  discussion.
                </p>
              </div>
            )}

          {/* COMMENTS */}

          {comments.length >
            0 && (
            <div className="space-y-3">
              {comments.map(
                (
                  comment
                ) => (
                  <BlogCommentItem
                    key={
                      comment.id
                    }
                    comment={
                      comment
                    }
                  />
                )
              )}
            </div>
          )}

          {/* =================================================
              COMMENT FORM
          ================================================= */}

          <form
            onSubmit={
              submitComment
            }
            className="mt-7 rounded-[16px] border border-[#07162E]/10 bg-[#FFFDF8] p-4 sm:p-5 dark:border-white/10 dark:bg-[#06111F]"
          >
            <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#D97706] dark:text-[#F59E0B]">
              Add your voice
            </span>

            <h3 className="mt-2 font-serif text-xl tracking-[-0.025em] text-[#07162E] dark:text-white">
              Join the
              discussion
            </h3>

            <p className="mt-2 max-w-md text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Comments are
              reviewed before
              appearing
              publicly.
            </p>

            {/* NAME */}

            <div className="mt-5">
              <label
                htmlFor={`blog-comment-author-${postId}`}
                className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500"
              >
                Your name
              </label>

              <input
                id={`blog-comment-author-${postId}`}
                value={
                  author
                }
                onChange={(
                  event
                ) =>
                  setAuthor(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Optional"
                className="min-h-11 w-full rounded-xl border border-[#07162E]/10 bg-white px-3.5 text-xs text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#0B1A2A] dark:text-white"
              />
            </div>

            {/* COMMENT */}

            <div className="mt-4">
              <label
                htmlFor={`blog-comment-content-${postId}`}
                className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500"
              >
                Comment
              </label>

              <textarea
                id={`blog-comment-content-${postId}`}
                value={
                  content
                }
                onChange={(
                  event
                ) =>
                  setContent(
                    event
                      .target
                      .value
                  )
                }
                required
                rows={5}
                placeholder="Share your thoughts..."
                className="w-full resize-none rounded-xl border border-[#07162E]/10 bg-white px-3.5 py-3 text-xs leading-6 text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#0B1A2A] dark:text-white"
              />
            </div>

            {/* HONEYPOT */}

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={
                website
              }
              onChange={(
                event
              ) =>
                setWebsite(
                  event
                    .target
                    .value
                )
              }
              className="absolute left-[-9999px] h-px w-px"
              aria-hidden="true"
            />

            {/* FOOTER */}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                className={`text-[10px] leading-5 ${
                  message.includes(
                    "received"
                  )
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {message}
              </p>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !content.trim()
                }
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-[11px] font-extrabold text-[#07162E] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                <Send
                  size={13}
                />

                {submitting
                  ? "Sending..."
                  : "Submit Comment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}