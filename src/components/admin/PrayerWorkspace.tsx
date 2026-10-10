"use client";

import {
  Check,
  ChevronDown,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import FormattedContent from "@/components/editor/FormattedContent";

import type {
  PrayerRequest,
} from "@/lib/types/prayer";

type Status =
  | "pending"
  | "published";

type PrayerResult = {
  success: boolean;

  requests:
    PrayerRequest[];

  counts: {
    pending: number;

    published: number;

    prayers: number;
  };
};

function formatDate(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return "";
  }
}

export default function PrayerWorkspace() {
  const [
    status,
    setStatus,
  ] =
    useState<Status>(
      "pending"
    );

  const [
    data,
    setData,
  ] =
    useState<PrayerResult | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    expandedId,
    setExpandedId,
  ] =
    useState<string | null>(
      null
    );

  const [
    approvingId,
    setApprovingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<PrayerRequest | null>(
      null
    );

  const [
    deletionPin,
    setDeletionPin,
  ] =
    useState("");

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  /*
   * LOAD
   */
  const load =
    useCallback(async () => {
      setLoading(
        true
      );

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/admin/prayer?status=${status}`,
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
              "Prayer requests could not be loaded."
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
            : "Prayer requests could not be loaded."
        );
      } finally {
        setLoading(
          false
        );
      }
    }, [
      status,
    ]);

  useEffect(() => {
    load();
  }, [
    load,
  ]);

  /*
   * FILTER
   */
  const filtered =
    useMemo(() => {
      const requests =
        data?.requests ??
        [];

      const search =
        query
          .trim()
          .toLowerCase();

      if (
        !search
      ) {
        return requests;
      }

      return requests.filter(
        (
          request
        ) =>
          [
            request.category,
            request.content,
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
   * APPROVE
   */
  const approve =
    async (
      id: string
    ) => {
      setApprovingId(
        id
      );

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/admin/prayer/${id}`,
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
              "The prayer request could not be approved."
          );
        }

        setMessage(
          result.alreadyApproved
            ? "This prayer request was already published."
            : "Prayer request approved and published."
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
            : "The prayer request could not be approved."
        );
      } finally {
        setApprovingId(
          null
        );
      }
    };

  /*
   * DELETE
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

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/admin/prayer/${deleteTarget.id}`,
            {
              method:
                "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    deletionPin,
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
              "The request could not be deleted."
          );
        }

        setDeleteTarget(
          null
        );

        setDeletionPin(
          ""
        );

        setMessage(
          "Prayer request deleted."
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
            : "The prayer request could not be deleted."
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
      {/* HEADER */}

      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Prayer ministry
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Prayer requests
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Review prayer burdens,
            publish approved requests
            and see how the community
            is standing in prayer.
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
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* STATS */}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <PrayerStat
          label="Pending"
          value={
            data?.counts
              .pending ??
            0
          }
        />

        <PrayerStat
          label="Published"
          value={
            data?.counts
              .published ??
            0
          }
        />

        <PrayerStat
          label="Prayers"
          value={
            data?.counts
              .prayers ??
            0
          }
        />
      </div>

      {/* TABS */}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setStatus(
              "pending"
            )
          }
          className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
            status ===
            "pending"
              ? "border-accent bg-accent text-primary"
              : "border-white/10 bg-secondary text-slate-400 hover:text-white"
          }`}
        >
          Awaiting review{" "}

          <span className="ml-1 opacity-70">
            {
              data?.counts
                .pending ??
              0
            }
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setStatus(
              "published"
            )
          }
          className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
            status ===
            "published"
              ? "border-accent bg-accent text-primary"
              : "border-white/10 bg-secondary text-slate-400 hover:text-white"
          }`}
        >
          Published{" "}

          <span className="ml-1 opacity-70">
            {
              data?.counts
                .published ??
              0
            }
          </span>
        </button>
      </div>

      {/* SEARCH */}

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
          placeholder="Search prayer requests..."
          className="h-11 w-full rounded-xl border border-white/10 bg-secondary pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="mt-4 rounded-xl border border-white/10 bg-secondary px-4 py-3 text-xs text-slate-300">
          {
            message
          }
        </div>
      )}

      {/* CONTENT */}

      {loading ? (
        <div className="mt-5 space-y-3">
          {Array.from({
            length: 4,
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
            <ShieldCheck
              size={
                17
              }
            />
          </div>

          <p className="mt-4 text-xs font-bold text-slate-400">
            {query
              ? "No prayer requests match your search."
              : status ===
                  "pending"
                ? "The prayer moderation queue is clear."
                : "No published prayer requests found."}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map(
            (
              request
            ) => {
              const expanded =
                expandedId ===
                request.id;

              const approving =
                approvingId ===
                request.id;

              return (
                <article
                  key={
                    request.id
                  }
                  className="rounded-2xl border border-white/10 bg-secondary p-4 transition hover:border-white/15 sm:p-5"
                >
                  {/* META */}

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
                        {
                          request.category
                        }
                      </span>

                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                        Anonymous request
                      </p>
                    </div>

                    {request.approved && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-primary px-2.5 py-1.5 text-[10px] font-bold text-slate-500">
                        <Users
                          size={
                            11
                          }
                        />

                        {
                          request.prayerCount
                        }{" "}
                        prayed
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div
                    className={`mt-4 overflow-hidden font-serif text-sm leading-7 text-slate-300 ${
                      expanded
                        ? ""
                        : "max-h-[112px]"
                    }`}
                  >
                    <FormattedContent
                      content={
                        request.content
                      }
                    />
                  </div>

                  {request.content
                    .length >
                    230 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(
                          expanded
                            ? null
                            : request.id
                        )
                      }
                      className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 transition hover:text-accent"
                    >
                      {expanded
                        ? "Show less"
                        : "Read full request"}

                      <ChevronDown
                        size={
                          12
                        }
                        className={
                          expanded
                            ? "rotate-180"
                            : ""
                        }
                      />
                    </button>
                  )}

                  {request.createdAt && (
                    <p className="mt-4 text-[10px] text-slate-600">
                      {formatDate(
                        request.createdAt
                      )}
                    </p>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                    {status ===
                      "pending" && (
                      <button
                        type="button"
                        disabled={
                          approving
                        }
                        onClick={() =>
                          approve(
                            request.id
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
                          ? "Publishing..."
                          : "Approve & publish"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget(
                          request
                        );

                        setDeletionPin(
                          ""
                        );
                      }}
                      className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-red-500/20 px-3.5 text-[11px] font-bold text-red-400 transition hover:bg-red-500/10"
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

      {/* DELETE MODAL */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prayer-delete-title"
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
              id="prayer-delete-title"
              className="mt-5 text-lg font-extrabold text-white"
            >
              Delete prayer request?
            </h2>

            <p className="mt-2 text-xs leading-6 text-slate-400">
              This permanently removes
              the selected prayer
              request.
            </p>

            <p className="mt-2 text-[10px] leading-5 text-slate-600">
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
 * STAT CARD
 */
function PrayerStat({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-secondary p-3 sm:p-4">
      <p className="text-lg font-extrabold text-white sm:text-xl">
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
    </div>
  );
}