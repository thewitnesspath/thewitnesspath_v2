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
  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(comment.likes);

  const [replyOpen, setReplyOpen] =
    useState(false);

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

  useEffect(() => {
    setLiked(
      localStorage.getItem(
        `liked_blog_comment_${comment.id}`
      ) === "true"
    );
  }, [comment.id]);

  const toggleLike = async () => {
    const nextLiked = !liked;

    const delta =
      nextLiked ? 1 : -1;

    const previousLiked =
      liked;

    const previousLikes =
      likes;

    setLiked(nextLiked);

    setLikes((current) =>
      Math.max(
        0,
        current + delta
      )
    );

    try {
      const response = await fetch(
  `/api/blog-comments/${comment.id}/like`,
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
          `liked_blog_comment_${comment.id}`,
          "true"
        );
      } else {
        localStorage.removeItem(
          `liked_blog_comment_${comment.id}`
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

    if (!content.trim()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/blog-comments/${comment.id}/replies`,
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
      setSubmitting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-secondary p-4">
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-bold text-white">
          {comment.author}
        </span>

        <button
          type="button"
          onClick={toggleLike}
          className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-bold transition ${
            liked
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-white/10 text-slate-400 hover:border-accent/30 hover:text-accent"
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

      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">
        {comment.content}
      </p>

      <button
        type="button"
        onClick={() =>
          setReplyOpen(
            (current) => !current
          )
        }
        className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold text-slate-500 transition hover:text-accent"
      >
        <MessageCircle size={13} />

        {comment.replies.length > 0
          ? `${comment.replies.length} ${
              comment.replies.length === 1
                ? "reply"
                : "replies"
            }`
          : "Reply"}
      </button>

      {replyOpen && (
        <div className="mt-4 border-l-2 border-accent/50 pl-3">
          {comment.replies.length > 0 && (
            <div className="space-y-2">
              {comment.replies.map(
                (reply) => (
                  <div
                    key={reply.id}
                    className="rounded-xl border border-white/10 bg-primary p-3"
                  >
                    <p className="text-[11px] font-bold text-white">
                      {reply.author}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-400">
                      {reply.content}
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          <form
            onSubmit={submitReply}
            className="mt-3 space-y-2"
          >
            <input
              value={author}
              onChange={(event) =>
                setAuthor(
                  event.target.value
                )
              }
              placeholder="Your name (optional)"
              className="w-full rounded-lg border border-white/10 bg-primary px-3 py-2 text-xs text-white outline-none focus:border-accent/50"
            />

            <div className="flex gap-2">
              <input
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                required
                placeholder="Write a reply..."
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-primary px-3 py-2 text-xs text-white outline-none focus:border-accent/50"
              />

              <button
                type="submit"
                disabled={
                  submitting ||
                  !content.trim()
                }
                className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>

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
              <p className="text-[10px] text-slate-500">
                {message}
              </p>
            )}
          </form>
        </div>
      )}
    </article>
  );
}