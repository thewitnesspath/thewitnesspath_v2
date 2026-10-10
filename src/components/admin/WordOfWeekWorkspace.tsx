"use client";

import {
  BookMarked,
  Edit3,
  Loader2,
  LockKeyhole,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
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

import type {
  AdminRole,
} from "@/lib/admin/roles";

import type {
  WordOfWeekAdminItem,
} from "@/lib/types/word-of-week";

type Props = {
  role: AdminRole;
};

type Result = {
  success: boolean;

  items:
    WordOfWeekAdminItem[];

  latest:
    WordOfWeekAdminItem |
    null;

  counts: {
    entries: number;
  };
};

function formatDate(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en",
      {
        day:
          "numeric",

        month:
          "short",

        year:
          "numeric",
      }
    ).format(
      new Date(
        value
      )
    );
  } catch {
    return "";
  }
}

export default function WordOfWeekWorkspace({
  role,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<Result | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    query,
    setQuery,
  ] =
    useState(
      ""
    );

  const [
    editorItem,
    setEditorItem,
  ] =
    useState<
      | WordOfWeekAdminItem
      | "new"
      | null
    >(
      null
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<
      WordOfWeekAdminItem |
      null
    >(
      null
    );

  const [
    deletionPin,
    setDeletionPin,
  ] =
    useState(
      ""
    );

  const [
    deleting,
    setDeleting,
  ] =
    useState(
      false
    );

  const [
    message,
    setMessage,
  ] =
    useState(
      ""
    );

  /*
   * =================================
   * LOAD
   * =================================
   */
  const load =
    useCallback(
      async () => {
        setLoading(
          true
        );

        setMessage(
          ""
        );

        try {
          const response =
            await fetch(
              "/api/admin/word",
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
            throw new Error(
              result.message ||
                "Word of the Week could not be loaded."
            );
          }

          setData(
            result
          );
        } catch (
          error
        ) {
          setMessage(
            error instanceof
              Error &&
              error.message
              ? error.message
              : "Word of the Week could not be loaded."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    load();
  }, [
    load,
  ]);

  /*
   * =================================
   * SEARCH
   * =================================
   */
  const filtered =
    useMemo(() => {
      const items =
        data?.items ??
        [];

      const search =
        query
          .trim()
          .toLowerCase();

      if (
        !search
      ) {
        return items;
      }

      return items.filter(
        (
          item
        ) =>
          [
            item.title,
            item.author,
            item.content,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              search
            )
      );
    }, [
      data,
      query,
    ]);

  /*
   * =================================
   * DELETE
   * =================================
   */
  const remove =
    async () => {
      if (
        !deleteTarget ||
        !deletionPin.trim()
      ) {
        return;
      }

      setDeleting(
        true
      );

      setMessage(
        ""
      );

      try {
        const response =
          await fetch(
            `/api/admin/word/${deleteTarget.id}`,
            {
              method:
                "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  deletionPin:
                    deletionPin.trim(),
                }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            result.message ||
              "The entry could not be deleted."
          );
        }

        setDeleteTarget(
          null
        );

        setDeletionPin(
          ""
        );

        setMessage(
          "Word of the Week deleted."
        );

        await load();
      } catch (
        error
      ) {
        setMessage(
          error instanceof
            Error &&
              error.message
            ? error.message
            : "The Word of the Week could not be deleted."
        );
      } finally {
        setDeleting(
          false
        );
      }
    };

  const closeDeleteModal =
    () => {
      if (
        deleting
      ) {
        return;
      }

      setDeleteTarget(
        null
      );

      setDeletionPin(
        ""
      );
    };

  return (
    <div>
      {/* =================================
          HEADER
      ================================= */}

      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Weekly content
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Word of the Week
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Manage the spiritual
            anchors used across The
            Witness Path.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={
              load
            }
            disabled={
              loading
            }
            className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              size={
                13
              }
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setEditorItem(
                "new"
              )
            }
            className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-accent px-3.5 text-[11px] font-extrabold text-primary transition hover:brightness-105"
          >
            <Plus
              size={
                13
              }
            />

            Add word
          </button>
        </div>
      </div>

      {/* =================================
          STATS
      ================================= */}

      <div className="mt-6">
        <Stat
          label="Bank entries"
          value={
            data?.counts
              .entries ??
            0
          }
        />
      </div>

      {/* =================================
          CURRENTLY DISPLAYED
      ================================= */}

      {data?.latest && (
        <section className="mt-5 overflow-hidden rounded-2xl border border-accent/25 bg-accent/5">
          <div className="border-b border-accent/15 px-4 py-3 sm:px-5">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-accent">
              Currently displayed
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <h2 className="text-lg font-extrabold leading-snug text-white">
              {
                data.latest
                  .title
              }
            </h2>

            <p className="mt-2 text-[10px] font-semibold text-slate-500">
              By{" "}
              {
                data.latest
                  .author
              }
            </p>

            {data.latest
              .createdAt && (
              <p className="mt-1 text-[9px] text-slate-600">
                {formatDate(
                  data.latest
                    .createdAt
                )}
              </p>
            )}

            <div className="mt-4 max-w-3xl font-serif text-sm leading-7 text-slate-300">
              <FormattedContent
                content={
                  data.latest
                    .content
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* =================================
          SEARCH
      ================================= */}

      <div className="relative mt-5">
        <Search
          size={
            15
          }
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
        />

        <input
          value={
            query
          }
          onChange={(
            event
          ) =>
            setQuery(
              event.target
                .value
            )
          }
          placeholder="Search the word bank..."
          className="h-11 w-full rounded-xl border border-white/10 bg-secondary pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {/* =================================
          MESSAGE
      ================================= */}

      {message && (
        <div className="mt-4 rounded-xl border border-white/10 bg-secondary px-4 py-3 text-xs text-slate-300">
          {
            message
          }
        </div>
      )}

      {/* =================================
          CONTENT
      ================================= */}

      {loading ? (
        <div className="mt-5 space-y-3">
          {Array.from({
            length:
              3,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={
                  index
                }
                className="h-32 animate-pulse rounded-2xl border border-white/10 bg-secondary"
              />
            )
          )}
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-secondary py-14 text-center">
          <BookMarked
            size={
              20
            }
            className="mx-auto text-slate-700"
          />

          <p className="mt-3 text-xs font-bold text-slate-500">
            {query
              ? "No entries match your search."
              : "No Word of the Week entries yet."}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map(
            (
              item
            ) => {
              const isCurrent =
                data?.latest
                  ?.id ===
                item.id;

              return (
                <article
                  key={
                    item.id
                  }
                  className="rounded-2xl border border-white/10 bg-secondary p-4 transition hover:border-white/15 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      {/* BADGES */}

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
                          Word bank
                        </span>

                        {isCurrent && (
                          <span className="rounded-lg border border-white/10 bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                            Current
                          </span>
                        )}
                      </div>

                      {/* TITLE */}

                      <h2 className="mt-3 text-sm font-extrabold leading-6 text-white sm:text-base">
                        {
                          item.title
                        }
                      </h2>

                      {/* AUTHOR */}

                      <p className="mt-1 text-[10px] text-slate-500">
                        By{" "}
                        {
                          item.author
                        }
                      </p>

                      {/* CONTENT */}

                      <div className="mt-3 line-clamp-3 max-w-3xl font-serif text-xs leading-6 text-slate-400">
                        <FormattedContent
                          content={
                            item.content
                          }
                        />
                      </div>

                      {/* DATE */}

                      {item.createdAt && (
                        <p className="mt-3 text-[10px] text-slate-600">
                          {formatDate(
                            item.createdAt
                          )}
                        </p>
                      )}
                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditorItem(
                            item
                          )
                        }
                        className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent"
                      >
                        <Edit3
                          size={
                            12
                          }
                        />

                        Edit
                      </button>

                      {role ===
                        "main" && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(
                              item
                            );

                            setDeletionPin(
                              ""
                            );
                          }}
                          className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-red-500/20 px-3 text-[11px] font-bold text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2
                            size={
                              12
                            }
                          />

                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}

      {/* =================================
          EDITOR
      ================================= */}

      {editorItem && (
        <WordEditorModal
          item={
            editorItem ===
            "new"
              ? null
              : editorItem
          }
          onClose={() =>
            setEditorItem(
              null
            )
          }
          onSaved={async (
            savedMessage
          ) => {
            setEditorItem(
              null
            );

            setMessage(
              savedMessage
            );

            await load();
          }}
        />
      )}

      {/* =================================
          DELETE MODAL
      ================================= */}

      {deleteTarget &&
        role ===
          "main" && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-word-title"
          >
            <div className="w-full max-w-[410px] rounded-2xl border border-white/10 bg-secondary p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <LockKeyhole
                    size={
                      16
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    deleting
                  }
                  aria-label="Close delete confirmation"
                  className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  <X
                    size={
                      15
                    }
                  />
                </button>
              </div>

              <h2
                id="delete-word-title"
                className="mt-5 text-lg font-extrabold text-white"
              >
                Delete this word?
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                “
                {
                  deleteTarget.title
                }
                ” will be permanently
                removed from the Word
                of the Week bank.
              </p>

              {data?.latest
                ?.id ===
                deleteTarget.id && (
                <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                  <p className="text-[10px] leading-5 text-amber-300">
                    This is currently
                    the displayed Word
                    of the Week. After
                    deletion, the next
                    newest entry will
                    become current.
                  </p>
                </div>
              )}

              <p className="mt-3 text-[10px] leading-5 text-slate-600">
                Enter the Witness Path
                deletion password to
                continue.
              </p>

              <input
                type="password"
                value={
                  deletionPin
                }
                onChange={(
                  event
                ) =>
                  setDeletionPin(
                    event.target
                      .value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                      "Enter" &&
                    deletionPin.trim() &&
                    !deleting
                  ) {
                    remove();
                  }
                }}
                autoComplete="current-password"
                placeholder="Deletion password"
                className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-red-400/50 focus:ring-4 focus:ring-red-500/10"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    deleting
                  }
                  className="min-h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400 transition hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    remove
                  }
                  disabled={
                    deleting ||
                    !deletionPin.trim()
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-500 px-4 text-xs font-extrabold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleting && (
                    <Loader2
                      size={
                        13
                      }
                      className="animate-spin"
                    />
                  )}

                  {deleting
                    ? "Deleting..."
                    : "Delete permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

/*
 * =================================
 * WORD EDITOR
 * =================================
 */
function WordEditorModal({
  item,
  onClose,
  onSaved,
}: {
  item:
    | WordOfWeekAdminItem
    | null;

  onClose:
    () => void;

  onSaved: (
    message: string
  ) =>
    | Promise<void>
    | void;
}) {
  const editing =
    Boolean(
      item
    );

  const [
    title,
    setTitle,
  ] =
    useState(
      item?.title ??
      ""
    );

  const [
    author,
    setAuthor,
  ] =
    useState(
      item?.author ===
        "The Witness Team"
        ? ""
        : item?.author ??
          ""
    );

  const [
    content,
    setContent,
  ] =
    useState(
      item?.content ??
      ""
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const titleError =
    useMemo(
      () =>
        title.trim()
          ? validateTitle(
              title
            )
          : null,
      [
        title,
      ]
    );

  const valid =
    Boolean(
      title.trim() &&
      !titleError &&
      content.trim()
    );

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
        !content.trim()
      ) {
        setError(
          "Word of the Week content is required."
        );

        return;
      }

      setSubmitting(
        true
      );

      setError(
        ""
      );

      try {
        const response =
          await fetch(
            editing
              ? `/api/admin/word/${item?.id}`
              : "/api/admin/word",
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

                  author:
                    author.trim(),

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
              "Unable to save Word of the Week."
          );

          return;
        }

        await onSaved(
          editing
            ? "Word of the Week updated."
            : "Word of the Week added to the bank."
        );
      } catch {
        setError(
          "Unable to save Word of the Week."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <div
      className="fixed inset-0 z-[85] overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-editor-title"
    >
      <div className="mx-auto w-full max-w-[900px] overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-accent">
              Weekly anchor
            </span>

            <h2
              id="word-editor-title"
              className="mt-2 text-lg font-extrabold text-white"
            >
              {editing
                ? "Edit Word of the Week"
                : "Add Word of the Week"}
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            aria-label="Close Word of the Week editor"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <X
              size={
                15
              }
            />
          </button>
        </div>

        <form
          onSubmit={
            submit
          }
          className="p-5"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* FORM */}

            <div>
              {/* TITLE */}

              <label className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
                <span>
                  Title
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
                placeholder="Word of the Week title"
                className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
              />

              {titleError && (
                <p className="mt-2 text-[10px] font-medium text-red-400">
                  {
                    titleError
                  }
                </p>
              )}

              {/* AUTHOR */}

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold text-slate-300">
                  Author
                </label>

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
                  placeholder="Optional"
                  className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                />

                <p className="mt-2 text-[10px] leading-5 text-slate-600">
                  Leave blank to use
                  The Witness Team.
                </p>
              </div>

              {/* CONTENT */}

              <div className="mt-5">
                <RichTextEditor
                  label="Content"
                  value={
                    content
                  }
                  onChange={
                    setContent
                  }
                  rows={
                    15
                  }
                  placeholder="Write the Word of the Week..."
                />
              </div>
            </div>

            {/* PREVIEW */}

            <aside className="lg:sticky lg:top-5 lg:self-start">
              <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-600">
                Live preview
              </p>

              <div className="rounded-2xl border border-white/10 bg-primary p-4">
                <span className="inline-block rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-accent">
                  Word of the Week
                </span>

                <h3 className="mt-3 text-lg font-extrabold leading-snug text-white">
                  {title.trim() ||
                    "Weekly Anchor"}
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
                      weekly word.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-xs font-medium text-red-400">
                {
                  error
                }
              </p>
            </div>
          )}

          {/* ACTIONS */}

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
                  : "Save to bank"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * =================================
 * STAT
 * =================================
 */
function Stat({
  label,
  value,
}: {
  label:
    string;

  value:
    number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-secondary p-4">
      <p className="text-xl font-extrabold tracking-[-0.03em] text-white">
        {new Intl.NumberFormat(
          "en"
        ).format(
          value
        )}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600 sm:text-[10px]">
        {
          label
        }
      </p>
    </div>
  );
}