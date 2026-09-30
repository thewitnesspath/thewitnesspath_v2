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
  TestimonyComment,
} from "@/lib/types/comment";

type Props = {
  comment: TestimonyComment;
};

function formatDate(value?: string | null) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(value));
  } catch {
    return "";
  }
}

export default function CommentItem({
  comment,
}: Props) {
  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(comment.likes);

  const [replyOpen, setReplyOpen] =
    useState(false);

  const [replyAuthor, setReplyAuthor] =
    useState("");

  const [replyContent, setReplyContent] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [website, setWebsite] =
    useState("");

  useEffect(() => {
    const stored =
      localStorage.getItem(
        `twp:testimony-comment-liked:${comment.id}`
      );

    setLiked(stored === "true");
  }, [comment.id]);

  const toggleLike = async () => {
    const nextLiked = !liked;
    const delta = nextLiked ? 1 : -1;

    const previousLiked = liked;
    const previousLikes = likes;

    setLiked(nextLiked);

    setLikes((current) =>
      Math.max(0, current + delta)
    );

    try {
      const response = await fetch(
  `/api/comments/${comment.id}/like`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body:
      JSON.stringify({
        delta:
          liked
            ? -1
            : 1,
      }),
  }
);

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error();
      }

      setLikes(result.likes);

      if (nextLiked) {
        localStorage.setItem(
          `twp:testimony-comment-liked:${comment.id}`,
          "true"
        );
      } else {
        localStorage.removeItem(
          `twp:testimony-comment-liked:${comment.id}`
        );
      }
    } catch {
      setLiked(previousLiked);
      setLikes(previousLikes);
    }
  };

  const submitReply = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!replyContent.trim()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/comments/${comment.id}/replies`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            author: replyAuthor,
            content: replyContent,
            website,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to submit reply."
        );
      }

      setReplyAuthor("");
      setReplyContent("");
      setWebsite("");

      setMessage(
        "Reply received and awaiting review."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit reply."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
      {/* COMMENT HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {comment.author}
          </p>

          {comment.createdAt && (
            <p className="mt-1 text-[10px] text-slate-400">
              {formatDate(
                comment.createdAt
              )}
            </p>
          )}
        </div>

        {/* P0 COMMENT LIKE + COUNTER */}
        <button
          type="button"
          onClick={toggleLike}
          className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-bold transition ${
            liked
              ? "border-red-200 bg-red-50 text-red-500 dark:border-red-900/40 dark:bg-red-950/30"
              : "border-slate-200 bg-white text-slate-500 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900"
          }`}
          aria-label={
            liked
              ? "Unlike comment"
              : "Like comment"
          }
        >
          <Heart
            size={14}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />

          <span>{likes}</span>
        </button>
      </div>

      {/* COMMENT */}
      <p className="mt-3 whitespace-pre-line text-xs leading-6 text-slate-700 sm:text-sm dark:text-slate-300">
        {comment.content}
      </p>

      {/* REPLY ACTION */}
      <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
        <button
          type="button"
          onClick={() =>
            setReplyOpen(
              (current) => !current
            )
          }
          className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-500 transition hover:text-amber-600"
        >
          <MessageCircle size={14} />

          {comment.replies.length > 0
            ? `${comment.replies.length} ${
                comment.replies.length === 1
                  ? "reply"
                  : "replies"
              }`
            : "Reply"}
        </button>
      </div>

      {/* REPLIES */}
      {replyOpen && (
        <div className="mt-4 border-l-2 border-amber-300 pl-3 dark:border-amber-700">
          {comment.replies.length > 0 && (
            <div className="space-y-2">
              {comment.replies.map(
                (reply) => (
                  <div
                    key={reply.id}
                    className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                        {reply.author}
                      </span>

                      {reply.createdAt && (
                        <span className="text-[9px] text-slate-400">
                          {formatDate(
                            reply.createdAt
                          )}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 whitespace-pre-line text-[11px] leading-5 text-slate-600 dark:text-slate-400">
                      {reply.content}
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          {/* REPLY FORM */}
          <form
            onSubmit={submitReply}
            className="mt-3 space-y-2"
          >
            <input
              type="text"
              value={replyAuthor}
              onChange={(event) =>
                setReplyAuthor(
                  event.target.value
                )
              }
              placeholder="Your name (optional)"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(event) =>
                  setReplyContent(
                    event.target.value
                  )
                }
                required
                placeholder="Write a reply..."
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <button
                type="submit"
                disabled={
                  submitting ||
                  !replyContent.trim()
                }
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800 disabled:opacity-40 dark:bg-amber-400 dark:text-slate-950"
                aria-label="Submit reply"
              >
                <Send size={14} />
              </button>
            </div>

            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) =>
                setWebsite(
                  event.target.value
                )
              }
              className="absolute left-[-9999px] h-px w-px"
              aria-hidden="true"
            />

            {message && (
              <p className="text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                {message}
              </p>
            )}
          </form>
        </div>
      )}
    </article>
  );
}