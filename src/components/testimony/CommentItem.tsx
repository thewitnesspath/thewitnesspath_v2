"use client";

import {
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type {
  BlogComment,
} from "@/lib/types/blog-comment";

type Props = {
  comment: BlogComment;
};

export default function BlogCommentItem({
  comment,
}: Props) {
  const [
    liked,
    setLiked,
  ] = useState(false);

  const [
    likes,
    setLikes,
  ] = useState(
    comment.likes ?? 0
  );

  const [
    replyOpen,
    setReplyOpen,
  ] = useState(false);

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

  const replies =
    comment.replies ?? [];

  /* =====================================================
     LOAD LOCAL LIKE STATE
  ===================================================== */

  useEffect(() => {
    setLiked(
      localStorage.getItem(
        `liked_blog_comment_${comment.id}`
      ) === "true"
    );
  }, [comment.id]);

  /* =====================================================
     LIKE COMMENT
  ===================================================== */

  const toggleLike =
    async () => {
      const nextLiked =
        !liked;

      const delta =
        nextLiked ? 1 : -1;

      const previousLiked =
        liked;

      const previousLikes =
        likes;

      /*
       * Optimistic update
       */
      setLiked(
        nextLiked
      );

      setLikes(
        (current) =>
          Math.max(
            0,
            current + delta
          )
      );

      try {
        const response =
          await fetch(
            `/api/blog-comments/${comment.id}/like`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  delta,
                }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error();
        }

        setLikes(
          result.likes
        );

        if (
          nextLiked
        ) {
          localStorage.setItem(
            `liked_blog_comment_${comment.id}`,
            "true"
          );
        } else {
          localStorage.removeItem(
            `liked_blog_comment_${comment.id}`
          );
        }
      } catch {
        /*
         * Restore previous state
         * if request fails.
         */
        setLiked(
          previousLiked
        );

        setLikes(
          previousLikes
        );
      }
    };

  /* =====================================================
     SUBMIT REPLY
  ===================================================== */

  const submitReply =
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
            `/api/blog-comments/${comment.id}/replies`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  author,
                  content,
                  website,
                }),
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
          "Reply received and awaiting review."
        );
      } catch {
        setMessage(
          "Your reply could not be submitted."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <article className="rounded-[16px] border border-[#07162E]/10 bg-[#FFFDF8] p-4 transition sm:p-5 dark:border-white/10 dark:bg-[#06111F]">
      {/* =================================================
          COMMENT HEADER
      ================================================= */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="block truncate text-[11px] font-extrabold text-[#07162E] dark:text-white">
            {comment.author ||
              "Anonymous"}
          </span>

          <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
            Community response
          </span>
        </div>

        {/* LIKE */}

        <button
          type="button"
          onClick={
            toggleLike
          }
          aria-label={
            liked
              ? "Unlike comment"
              : "Like comment"
          }
          aria-pressed={
            liked
          }
          className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[10px] font-bold transition ${
            liked
              ? "border-[#F59E0B]/50 bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]"
              : "border-[#07162E]/10 text-slate-400 hover:border-[#F59E0B]/40 hover:text-[#D97706] dark:border-white/10 dark:text-slate-500 dark:hover:text-[#F59E0B]"
          }`}
        >
          <Heart
            size={13}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />

          {likes}
        </button>
      </div>

      {/* =================================================
          COMMENT CONTENT
      ================================================= */}

      <p className="mt-4 whitespace-pre-line break-words text-[13px] leading-6 text-slate-600 sm:text-sm dark:text-slate-300">
        {comment.content}
      </p>

      {/* =================================================
          REPLY TOGGLE
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          setReplyOpen(
            (current) =>
              !current
          )
        }
        aria-expanded={
          replyOpen
        }
        className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg text-[10px] font-bold text-slate-500 transition hover:text-[#D97706] dark:text-slate-400 dark:hover:text-[#F59E0B]"
      >
        <MessageCircle
          size={13}
        />

        {replies.length >
        0
          ? `${replies.length} ${
              replies.length ===
              1
                ? "reply"
                : "replies"
            }`
          : "Reply"}

        <span
          className={`text-[9px] transition-transform duration-300 ${
            replyOpen
              ? "rotate-180"
              : ""
          }`}
        >
          ↓
        </span>
      </button>

      {/* =================================================
          REPLY DRAWER
      ================================================= */}

      {replyOpen && (
        <div className="mt-4 border-l-2 border-[#F59E0B]/50 pl-3 sm:pl-4">
          {/* =============================================
              EXISTING REPLIES
          ============================================= */}

          {replies.length >
            0 && (
            <div className="space-y-2.5">
              {replies.map(
                (
                  reply
                ) => (
                  <div
                    key={
                      reply.id
                    }
                    className="rounded-[12px] border border-[#07162E]/10 bg-white p-3.5 sm:p-4 dark:border-white/10 dark:bg-[#0B1A2A]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/10 text-[9px] font-extrabold text-[#D97706] dark:text-[#F59E0B]">
                        {(
                          reply.author ||
                          "A"
                        )
                          .charAt(
                            0
                          )
                          .toUpperCase()}
                      </span>

                      <p className="truncate text-[10px] font-extrabold text-[#07162E] dark:text-white">
                        {reply.author ||
                          "Anonymous"}
                      </p>
                    </div>

                    <p className="mt-2 whitespace-pre-line break-words text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                      {
                        reply.content
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          {/* =============================================
              REPLY FORM
          ============================================= */}

          <form
            onSubmit={
              submitReply
            }
            className="mt-4 rounded-[14px] border border-[#07162E]/10 bg-white p-3.5 sm:p-4 dark:border-white/10 dark:bg-[#0B1A2A]"
          >
            <span className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#D97706] dark:text-[#F59E0B]">
              Write a reply
            </span>

            {/* NAME */}

            <input
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
              placeholder="Your name (optional)"
              className="mt-3 min-h-10 w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-3 text-[11px] text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white"
            />

            {/* REPLY */}

            <textarea
              value={
                content
              }
              onChange={(
                event
              ) =>
                setContent(
                  event.target
                    .value
                )
              }
              required
              rows={3}
              placeholder="Write a reply..."
              className="mt-2.5 w-full resize-none rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-3 py-2.5 text-[11px] leading-5 text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white"
            />

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
                  event.target
                    .value
                )
              }
              className="absolute left-[-9999px] h-px w-px"
              aria-hidden="true"
            />

            {/* SUBMIT */}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                className={`text-[9px] leading-4 ${
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
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 text-[10px] font-extrabold text-[#07162E] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                <Send
                  size={13}
                />

                {submitting
                  ? "Sending..."
                  : "Send Reply"}
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}