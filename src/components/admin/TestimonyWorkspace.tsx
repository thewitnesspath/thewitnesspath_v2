"use client";

import {
  Check,
  ChevronDown,
  Eye,
  Loader2,
  LockKeyhole,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import FormattedContent from "@/components/editor/FormattedContent";

type Status =
  | "pending"
  | "published";

type TestimonyItem = {
  id: number;

  Title:
    | string
    | null;

  author:
    | string
    | null;

  category:
    | string
    | null;

  content:
    | string
    | null;

  amen_count:
    | number
    | null;

  is_approved:
    | boolean
    | null;

  views:
    | number
    | null;

  created_at?:
    | string
    | null;

  whatsapp_notified_at?:
    | string
    | null;

  Comments?: Array<{
    id: number;
  }>;
};

type Result = {
  success: boolean;

  items: TestimonyItem[];

  counts: {
    pending: number;

    published: number;
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

function formatDateTime(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return "";
  }
}

export default function TestimonyWorkspace() {
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
    useState<Result | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    expandedId,
    setExpandedId,
  ] =
    useState<number | null>(
      null
    );

  const [
    approvingId,
    setApprovingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<TestimonyItem | null>(
      null
    );

  const [
    deletionPin,
    setDeletionPin,
  ] = useState("");

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  /*
   * LOAD TESTIMONIES
   */
  const load =
    useCallback(async () => {
      setLoading(true);

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/admin/testimonies?status=${status}`,
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
            result.message
          );
        }

        setData(result);
      } catch {
        setMessage(
          "Testimonies could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  /*
   * SEARCH
   */
  const filtered =
    useMemo(() => {
      const search =
        query
          .trim()
          .toLowerCase();

      const items =
        data?.items ?? [];

      if (!search) {
        return items;
      }

      return items.filter(
        (item) => {
          const haystack = [
            item.Title,
            item.author,
            item.category,
            item.content,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return haystack.includes(
            search
          );
        }
      );
    }, [
      data,
      query,
    ]);

  /*
   * APPROVE TESTIMONY
   */
  const approve =
    async (
      id: number
    ) => {
      setApprovingId(id);

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/admin/testimonies/${id}`,
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
            result.message
          );
        }

        setMessage(
          "Testimony approved and published."
        );

        await load();
      } catch {
        setMessage(
          "The testimony could not be approved."
        );
      } finally {
        setApprovingId(
          null
        );
      }
    };

  /*
   * DELETE TESTIMONY
   */
  const remove =
    async () => {
      if (
        !deleteTarget ||
        !deletionPin.trim()
      ) {
        return;
      }

      setDeleting(true);

      setMessage("");

      try {
        const response =
          await fetch(
            `/api/admin/testimonies/${deleteTarget.id}`,
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
            result.message
          );
        }

        setDeleteTarget(
          null
        );

        setDeletionPin(
          ""
        );

        setMessage(
          "Testimony deleted."
        );

        await load();
      } catch {
        setMessage(
          "Incorrect deletion password or the testimony could not be deleted."
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <div>
      {/* ===================================
          HEADER
      =================================== */}

      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Moderation
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Testimonies
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Review submitted
            stories before they
            appear publicly.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* ===================================
          TABS
      =================================== */}

      <div className="mt-6 flex gap-2">
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
          Pending{" "}

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

      {/* ===================================
          SEARCH
      =================================== */}

      <div className="relative mt-4">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
        />

        <input
          value={query}
          onChange={(
            event
          ) =>
            setQuery(
              event.target
                .value
            )
          }
          placeholder="Search title, author, category or content..."
          className="h-11 w-full rounded-xl border border-white/10 bg-secondary pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {/* ===================================
          MESSAGE
      =================================== */}

      {message && (
        <div className="mt-4 rounded-xl border border-white/10 bg-secondary px-4 py-3 text-xs text-slate-300">
          {message}
        </div>
      )}

      {/* ===================================
          CONTENT
      =================================== */}

      {loading ? (
        <div className="mt-5 space-y-3">
          {Array.from({
            length: 3,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-white/10 bg-secondary"
              />
            )
          )}
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-secondary px-5 py-14 text-center">
          <p className="text-xs font-semibold text-slate-500">
            {query
              ? "No testimonies match your search."
              : status ===
                  "pending"
                ? "The moderation queue is clear."
                : "No published testimonies found."}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map(
            (item) => {
              const expanded =
                expandedId ===
                item.id;

              return (
                <article
                  key={
                    item.id
                  }
                  className="overflow-hidden rounded-2xl border border-white/10 bg-secondary transition hover:border-white/15"
                >
                  <div className="p-4 sm:p-5">
                    {/* ===========================
                        META
                    =========================== */}

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
                            {item.category ||
                              "Faith"}
                          </span>

                          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
                            {item.is_approved
                              ? "Published"
                              : "Awaiting review"}
                          </span>

                          {/* WHATSAPP BROADCAST STATUS */}
                          {item.is_approved && (
                            <span
                              title={
                                item.whatsapp_notified_at
                                  ? `Broadcast processed ${formatDateTime(
                                      item.whatsapp_notified_at
                                    )}`
                                  : "No WhatsApp broadcast has been recorded."
                              }
                              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${
                                item.whatsapp_notified_at
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                  : "border-white/10 bg-primary text-slate-500"
                              }`}
                            >
                              <Send
                                size={9}
                              />

                              {item.whatsapp_notified_at
                                ? "WhatsApp processed"
                                : "WhatsApp not processed"}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 text-sm font-extrabold leading-6 text-white sm:text-base">
                          {item.Title ||
                            "Untitled testimony"}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
                          <span>
                            By{" "}
                            {item.author ||
                              "Anonymous"}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <Eye
                              size={11}
                            />

                            {item.views ??
                              0}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <MessageCircle
                              size={11}
                            />

                            {item
                              .Comments
                              ?.length ??
                              0}
                          </span>

                          {item.created_at && (
                            <span>
                              {formatDate(
                                item.created_at
                              )}
                            </span>
                          )}
                        </div>

                        {/* WHATSAPP TIMESTAMP */}
                        {item.is_approved &&
                          item.whatsapp_notified_at && (
                            <p className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-semibold text-emerald-400/70">
                              <Send
                                size={9}
                              />

                              Broadcast processed{" "}
                              {formatDateTime(
                                item.whatsapp_notified_at
                              )}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* ===========================
                        CONTENT
                    =========================== */}

                    <div
                      className={`mt-4 overflow-hidden font-serif text-sm leading-7 text-slate-300 ${
                        expanded
                          ? ""
                          : "max-h-[118px]"
                      }`}
                    >
                      <FormattedContent
                        content={
                          item.content ||
                          ""
                        }
                      />
                    </div>

                    {(item.content
                      ?.length ??
                      0) >
                      250 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            expanded
                              ? null
                              : item.id
                          )
                        }
                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 transition hover:text-accent"
                      >
                        {expanded
                          ? "Show less"
                          : "Read full submission"}

                        <ChevronDown
                          size={12}
                          className={
                            expanded
                              ? "rotate-180"
                              : ""
                          }
                        />
                      </button>
                    )}

                    {/* ===========================
                        ACTIONS
                    =========================== */}

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                      {status ===
                        "pending" && (
                        <button
                          type="button"
                          disabled={
                            approvingId ===
                            item.id
                          }
                          onClick={() =>
                            approve(
                              item.id
                            )
                          }
                          className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-accent px-3.5 text-[11px] font-extrabold text-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {approvingId ===
                          item.id ? (
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

                          {approvingId ===
                          item.id
                            ? "Publishing..."
                            : "Approve & publish"}
                        </button>
                      )}

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
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}

      {/* ===================================
          DELETE MODAL
      =================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[410px] rounded-2xl border border-white/10 bg-secondary p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <LockKeyhole
                  size={16}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(
                    null
                  );

                  setDeletionPin(
                    ""
                  );
                }}
                className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                aria-label="Close delete confirmation"
              >
                <X
                  size={15}
                />
              </button>
            </div>

            <h2 className="mt-5 text-lg font-extrabold text-white">
              Delete testimony?
            </h2>

            <p className="mt-2 text-xs leading-6 text-slate-400">
              This permanently
              removes “
              {deleteTarget.Title ||
                "Untitled testimony"}
              ”. Enter the existing
              Witness Path deletion
              password to continue.
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
              className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-red-400/50"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(
                    null
                  );

                  setDeletionPin(
                    ""
                  );
                }}
                disabled={
                  deleting
                }
                className="min-h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400 transition hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={remove}
                disabled={
                  deleting ||
                  !deletionPin.trim()
                }
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-500 px-4 text-xs font-extrabold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting && (
                  <Loader2
                    size={13}
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