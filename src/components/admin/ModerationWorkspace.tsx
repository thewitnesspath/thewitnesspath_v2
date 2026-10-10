"use client";

import {
  Check,
  ChevronDown,
  Heart,
  Loader2,
  LockKeyhole,
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
} from "react";

import type {
  ModerationItem,
  ModerationKind,
} from "@/lib/types/moderation";

type Filter =
  | "all"
  | "testimony"
  | "blog";

type QueueResult = {
  success: boolean;

  items:
    ModerationItem[];

  counts: {
    total: number;

    testimony: number;

    blog: number;
  };
};

function kindLabel(
  kind: ModerationKind
) {
  switch (
    kind
  ) {
    case "testimony-comment":
      return "Testimony comment";

    case "testimony-reply":
      return "Testimony reply";

    case "blog-comment":
      return "Blog comment";

    case "blog-reply":
      return "Blog reply";
  }
}

export default function ModerationWorkspace() {
  const [
    data,
    setData,
  ] =
    useState<QueueResult | null>(
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
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "all"
    );

  const [
    approvingKey,
    setApprovingKey,
  ] =
    useState<string | null>(
      null
    );

  const [
    expandedKey,
    setExpandedKey,
  ] =
    useState<string | null>(
      null
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<ModerationItem | null>(
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

  const [
    loadError,
    setLoadError,
  ] =
    useState(
      false
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

        setLoadError(
          false
        );

        try {
          const response =
            await fetch(
              "/api/admin/moderation",
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
                "The moderation queue could not be loaded."
            );
          }

          setData(
            result
          );
        } catch (
          error
        ) {
          setLoadError(
            true
          );

          setMessage(
            error instanceof
              Error &&
              error.message
              ? error.message
              : "The moderation queue could not be loaded."
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
   * FILTER
   * =================================
   */
  const filtered =
    useMemo(() => {
      let items =
        data?.items ??
        [];

      if (
        filter ===
        "testimony"
      ) {
        items =
          items.filter(
            (item) =>
              item.kind.startsWith(
                "testimony"
              )
          );
      }

      if (
        filter ===
        "blog"
      ) {
        items =
          items.filter(
            (item) =>
              item.kind.startsWith(
                "blog"
              )
          );
      }

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
            item.author,
            item.content,
            item.parentLabel,
            kindLabel(
              item.kind
            ),
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              search
            )
      );
    }, [
      data,
      filter,
      query,
    ]);

  /*
   * =================================
   * APPROVE
   * =================================
   */
  const approve =
    async (
      item:
        ModerationItem
    ) => {
      const key =
        `${item.kind}-${item.id}`;

      setApprovingKey(
        key
      );

      setMessage(
        ""
      );

      try {
        const response =
          await fetch(
            `/api/admin/moderation/${item.kind}/${item.id}`,
            {
              method:
                "PATCH",
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            result.message ||
              "This item could not be approved."
          );
        }

        setMessage(
          result.alreadyApproved
            ? "This content had already been approved."
            : "Content approved and published."
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
            : "This item could not be approved."
        );
      } finally {
        setApprovingKey(
          null
        );
      }
    };

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
            `/api/admin/moderation/${deleteTarget.kind}/${deleteTarget.id}`,
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
              "Unable to delete this item."
          );
        }

        setDeleteTarget(
          null
        );

        setDeletionPin(
          ""
        );

        setMessage(
          "Content deleted."
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
            : "Unable to delete this item."
        );
      } finally {
        setDeleting(
          false
        );
      }
    };

  const closeDelete =
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
            Content safety
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Moderation queue
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Review comments and
            replies before they
            become publicly visible.
          </p>
        </div>

        <button
          type="button"
          onClick={
            load
          }
          disabled={
            loading
          }
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
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
      </div>

      {/* =================================
          SUMMARY
      ================================= */}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <QueueStat
          label="All"
          value={
            data?.counts
              .total ??
            0
          }
          active={
            filter ===
            "all"
          }
          onClick={() =>
            setFilter(
              "all"
            )
          }
        />

        <QueueStat
          label="Testimony"
          value={
            data?.counts
              .testimony ??
            0
          }
          active={
            filter ===
            "testimony"
          }
          onClick={() =>
            setFilter(
              "testimony"
            )
          }
        />

        <QueueStat
          label="Blog"
          value={
            data?.counts
              .blog ??
            0
          }
          active={
            filter ===
            "blog"
          }
          onClick={() =>
            setFilter(
              "blog"
            )
          }
        />
      </div>

      {/* =================================
          SEARCH
      ================================= */}

      <div className="relative mt-4">
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
          placeholder="Search author, content or parent post..."
          className="h-11 w-full rounded-xl border border-white/10 bg-secondary pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {/* =================================
          MESSAGE
      ================================= */}

      {message && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-xs ${
            loadError
              ? "border-red-500/20 bg-red-500/5 text-red-300"
              : "border-white/10 bg-secondary text-slate-300"
          }`}
        >
          {
            message
          }

          {loadError && (
            <button
              type="button"
              onClick={
                load
              }
              className="ml-3 font-bold text-accent hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* =================================
          QUEUE
      ================================= */}

      {loading ? (
        <div className="mt-5 space-y-3">
          {Array.from({
            length:
              4,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={
                  index
                }
                className="h-36 animate-pulse rounded-2xl border border-white/10 bg-secondary"
              />
            )
          )}
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-secondary py-14 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Check
              size={
                17
              }
            />
          </div>

          <p className="mt-4 text-xs font-bold text-slate-400">
            {query
              ? "No moderation items match your search."
              : filter ===
                  "testimony"
                ? "No testimony comments or replies are awaiting review."
                : filter ===
                    "blog"
                  ? "No blog comments or replies are awaiting review."
                  : "Moderation queue is clear."}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map(
            (
              item
            ) => {
              const key =
                `${item.kind}-${item.id}`;

              const expanded =
                expandedKey ===
                key;

              const approving =
                approvingKey ===
                key;

              return (
                <article
                  key={
                    key
                  }
                  className="rounded-2xl border border-white/10 bg-secondary p-4 transition hover:border-white/15 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
                          {kindLabel(
                            item.kind
                          )}
                        </span>

                        {typeof item.likes ===
                          "number" && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-600">
                            <Heart
                              size={
                                10
                              }
                            />

                            {
                              item.likes
                            }
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-xs font-extrabold text-white">
                        {
                          item.author
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-slate-600">
                        On:{" "}

                        <span className="text-slate-400">
                          {
                            item.parentLabel
                          }
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* COMMENT CONTENT
                      Keep this as plain
                      text intentionally. */}

                  <div
                    className={`mt-4 whitespace-pre-line break-words text-sm leading-7 text-slate-300 ${
                      expanded
                        ? ""
                        : "line-clamp-3"
                    }`}
                  >
                    {
                      item.content
                    }
                  </div>

                  {item.content.length >
                    220 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedKey(
                          expanded
                            ? null
                            : key
                        )
                      }
                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 transition hover:text-accent"
                    >
                      {expanded
                        ? "Show less"
                        : "Read full"}

                      <ChevronDown
                        size={
                          11
                        }
                        className={
                          expanded
                            ? "rotate-180"
                            : ""
                        }
                      />
                    </button>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      disabled={
                        approving ||
                        deleting
                      }
                      onClick={() =>
                        approve(
                          item
                        )
                      }
                      className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-accent px-3.5 text-[11px] font-extrabold text-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {approving ? (
                        <Loader2
                          size={
                            13
                          }
                          className="animate-spin"
                        />
                      ) : (
                        <Check
                          size={
                            13
                          }
                        />
                      )}

                      {approving
                        ? "Approving..."
                        : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        approving
                      }
                      onClick={() => {
                        setDeleteTarget(
                          item
                        );

                        setDeletionPin(
                          ""
                        );
                      }}
                      className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-red-500/20 px-3.5 text-[11px] font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-40"
                    >
                      <Trash2
                        size={
                          13
                        }
                      />

                      Delete
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}

      {/* =================================
          DELETE MODAL
      ================================= */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="moderation-delete-title"
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
                  closeDelete
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
              id="moderation-delete-title"
              className="mt-5 text-lg font-extrabold text-white"
            >
              Delete content?
            </h2>

            <p className="mt-2 text-xs leading-6 text-slate-400">
              This permanently
              removes the selected{" "}
              {kindLabel(
                deleteTarget.kind
              ).toLowerCase()}
              .
            </p>

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
                  closeDelete
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
 * SUMMARY FILTER CARD
 * =================================
 */
function QueueStat({
  label,
  value,
  active,
  onClick,
}: {
  label:
    string;

  value:
    number;

  active:
    boolean;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-pressed={
        active
      }
      className={`rounded-2xl border p-3 text-left transition sm:p-4 ${
        active
          ? "border-accent/40 bg-accent/10"
          : "border-white/10 bg-secondary hover:border-white/20"
      }`}
    >
      <p
        className={`text-lg font-extrabold ${
          active
            ? "text-accent"
            : "text-white"
        }`}
      >
        {new Intl.NumberFormat(
          "en"
        ).format(
          value
        )}
      </p>

      <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600 sm:text-[10px]">
        {
          label
        }
      </p>
    </button>
  );
}