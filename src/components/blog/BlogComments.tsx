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
  const [open, setOpen] =
    useState(false);

  const [loaded, setLoaded] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [comments, setComments] =
    useState<BlogComment[]>([]);

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

  const loadComments =
    async () => {
      if (loaded || loading) {
        return;
      }

      setLoading(true);

      try {
        const response =
          await fetch(
            `/api/blog/${postId}/comments`,
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
          "Comments could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    };

  const toggle = async () => {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (
      nextOpen &&
      !loaded
    ) {
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
      const response =
        await fetch(
          `/api/blog/${postId}/comments`,
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
        "Your comment has been received and is awaiting review."
      );
    } catch {
      setMessage(
        "Your comment could not be submitted."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-white/10">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <MessageCircle
              size={16}
            />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Discussion
            </span>

            <h2 className="mt-1 text-sm font-extrabold text-white">
              Comments{" "}
              <span className="font-medium text-slate-500">
                ({initialCount})
              </span>
            </h2>
          </div>
        </div>

        <span
          className={`flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown
            size={15}
          />
        </span>
      </button>

      {open && (
        <div className="pb-8">
          {loading && (
            <p className="text-xs text-slate-500">
              Loading comments...
            </p>
          )}

          {!loading &&
            loaded &&
            comments.length ===
              0 && (
              <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-slate-500">
                No comments yet.
              </p>
            )}

          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map(
                (comment) => (
                  <BlogCommentItem
                    key={comment.id}
                    comment={comment}
                  />
                )
              )}
            </div>
          )}

          <form
            onSubmit={submitComment}
            className="mt-6 rounded-2xl border border-white/10 bg-secondary p-4"
          >
            <h3 className="text-xs font-extrabold text-white">
              Join the discussion
            </h3>

            <p className="mt-1 text-[11px] text-slate-500">
              Comments are reviewed
              before appearing publicly.
            </p>

            <input
              value={author}
              onChange={(event) =>
                setAuthor(
                  event.target.value
                )
              }
              placeholder="Your name (optional)"
              className="mt-4 w-full rounded-xl border border-white/10 bg-primary px-3.5 py-3 text-xs text-white outline-none focus:border-accent/50"
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
              placeholder="Share your thoughts..."
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-primary px-3.5 py-3 text-xs leading-6 text-white outline-none focus:border-accent/50"
            />

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

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[10px] text-slate-500">
                {message}
              </p>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !content.trim()
                }
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-bold text-primary transition hover:brightness-105 disabled:opacity-40"
              >
                <Send size={14} />

                {submitting
                  ? "Sending..."
                  : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}