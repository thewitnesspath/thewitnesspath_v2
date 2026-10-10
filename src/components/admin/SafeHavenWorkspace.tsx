"use client";

import {
  BookOpen,
  ChevronDown,
  Edit3,
  Eye,
  Loader2,
  LockKeyhole,
  MessageCircleQuestion,
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

import type {
  AdminRole,
} from "@/lib/admin/roles";

import type {
  GuidanceGroup,
  GuidancePerspective,
  GuidanceQuestion,
} from "@/lib/types/guidance";

type Props = {
  role: AdminRole;
};

type ViewMode =
  | "queue"
  | "published";

type GuidanceResult = {
  success: boolean;

  unanswered:
    GuidanceQuestion[];

  groups:
    GuidanceGroup[];

  counts: {
    unanswered: number;

    published: number;

    questions: number;
  };
};

type EditorState = {
  mode:
    | "create"
    | "alternative"
    | "edit";

  question: string;

  category: string;

  perspective?:
    GuidancePerspective;
};

type DeleteTarget = {
  kind:
    | "question"
    | "answer";

  id: string;

  label: string;
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

export default function SafeHavenWorkspace({
  role,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<GuidanceResult | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    view,
    setView,
  ] =
    useState<ViewMode>(
      "queue"
    );

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    expandedGroup,
    setExpandedGroup,
  ] =
    useState<string | null>(
      null
    );

  const [
    editor,
    setEditor,
  ] =
    useState<EditorState | null>(
      null
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<DeleteTarget | null>(
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

  /*
   * LOAD DATA
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
            "/api/admin/guidance",
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
              "Unable to load Safe Haven."
          );
        }

        setData(
          result
        );
      } catch {
        setMessage(
          "Safe Haven data could not be loaded."
        );
      } finally {
        setLoading(
          false
        );
      }
    }, []);

  useEffect(() => {
    load();
  }, [load]);

  /*
   * SEARCH QUEUE
   */
  const filteredQuestions =
    useMemo(() => {
      const items =
        data?.unanswered ??
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
            item.category,
            item.question,
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
   * SEARCH PUBLISHED
   */
  const filteredGroups =
    useMemo(() => {
      const items =
        data?.groups ??
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
          group
        ) =>
          [
            group.category,
            group.question,

            ...group
              .perspectives
              .map(
                (
                  item
                ) =>
                  `${item.author} ${item.answer}`
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
      query,
    ]);

  /*
   * ANSWER QUESTION
   */
  const openQuestion = (
    question:
      GuidanceQuestion
  ) => {
    setEditor({
      mode:
        "create",

      question:
        question.question,

      category:
        question.category,
    });
  };

  /*
   * ADD ANOTHER PERSPECTIVE
   */
  const addPerspective = (
    group:
      GuidanceGroup
  ) => {
    setEditor({
      mode:
        "alternative",

      question:
        group.question,

      category:
        group.category,
    });
  };

  /*
   * EDIT PUBLISHED PERSPECTIVE
   */
  const editPerspective = (
    perspective:
      GuidancePerspective
  ) => {
    setEditor({
      mode:
        "edit",

      question:
        perspective.question,

      category:
        perspective.category,

      perspective,
    });
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
            `/api/admin/guidance/${deleteTarget.kind}/${deleteTarget.id}`,
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
              "Unable to delete content."
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
            : "The content could not be deleted."
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
            Safe Haven
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Guidance
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Respond to submitted
            questions and manage
            published perspectives.
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
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:opacity-50"
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
        <StatCard
          label="Awaiting"
          value={
            data?.counts
              .unanswered ??
            0
          }
        />

        <StatCard
          label="Questions"
          value={
            data?.counts
              .questions ??
            0
          }
        />

        <StatCard
          label="Perspectives"
          value={
            data?.counts
              .published ??
            0
          }
        />
      </div>

      {/* TABS */}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setView(
              "queue"
            )
          }
          className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
            view ===
            "queue"
              ? "border-accent bg-accent text-primary"
              : "border-white/10 bg-secondary text-slate-400 hover:text-white"
          }`}
        >
          Awaiting response{" "}

          <span className="ml-1 opacity-70">
            {
              data?.counts
                .unanswered ??
              0
            }
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setView(
              "published"
            )
          }
          className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
            view ===
            "published"
              ? "border-accent bg-accent text-primary"
              : "border-white/10 bg-secondary text-slate-400 hover:text-white"
          }`}
        >
          Published guidance
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
          placeholder="Search questions, categories or answers..."
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
            length: 3,
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
      ) : view ===
        "queue" ? (
        <QuestionQueue
          items={
            filteredQuestions
          }
          role={
            role
          }
          onAnswer={
            openQuestion
          }
          onDelete={(
            item
          ) =>
            setDeleteTarget({
              kind:
                "question",

              id:
                item.id,

              label:
                item.question,
            })
          }
        />
      ) : (
        <PublishedGuidance
          groups={
            filteredGroups
          }
          role={
            role
          }
          expandedGroup={
            expandedGroup
          }
          setExpandedGroup={
            setExpandedGroup
          }
          onAddPerspective={
            addPerspective
          }
          onEdit={
            editPerspective
          }
          onDelete={(
            item
          ) =>
            setDeleteTarget({
              kind:
                "answer",

              id:
                item.id,

              label:
                item.question,
            })
          }
        />
      )}

      {/* GUIDANCE EDITOR */}

      {editor && (
        <GuidanceEditorModal
          state={
            editor
          }
          onClose={() =>
            setEditor(
              null
            )
          }
          onSaved={async (
            savedMessage
          ) => {
            setEditor(
              null
            );

            setMessage(
              savedMessage
            );

            await load();

            setView(
              "published"
            );
          }}
        />
      )}

      {/* DELETE MODAL */}

      {deleteTarget &&
        role ===
          "main" && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="safe-haven-delete-title"
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
                id="safe-haven-delete-title"
                className="mt-5 text-lg font-extrabold text-white"
              >
                Delete content?
              </h2>

              <p className="mt-2 line-clamp-3 text-xs leading-6 text-slate-400">
                {
                  deleteTarget.label
                }
              </p>

              <p className="mt-2 text-[10px] leading-5 text-slate-600">
                This action is
                permanent. Enter
                the Witness Path
                deletion password
                to continue.
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
                  className="min-h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-400 disabled:opacity-40"
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
 * QUESTION QUEUE
 */
function QuestionQueue({
  items,
  role,
  onAnswer,
  onDelete,
}: {
  items:
    GuidanceQuestion[];

  role:
    AdminRole;

  onAnswer: (
    item:
      GuidanceQuestion
  ) => void;

  onDelete: (
    item:
      GuidanceQuestion
  ) => void;
}) {
  if (
    items.length ===
    0
  ) {
    return (
      <EmptyState
        title="No unanswered questions"
        text="The Safe Haven queue is currently clear."
      />
    );
  }

  return (
    <div className="mt-5 space-y-3">
      {items.map(
        (
          item
        ) => (
          <article
            key={
              item.id
            }
            className="rounded-2xl border border-white/10 bg-secondary p-4 sm:p-5"
          >
            <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
              {
                item.category
              }
            </span>

            <h2 className="mt-3 text-sm font-extrabold leading-6 text-white">
              {
                item.question
              }
            </h2>

            {item.createdAt && (
              <p className="mt-2 text-[10px] text-slate-600">
                Submitted{" "}
                {formatDate(
                  item.createdAt
                )}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() =>
                  onAnswer(
                    item
                  )
                }
                className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-accent px-3.5 text-[11px] font-extrabold text-primary transition hover:brightness-105"
              >
                <MessageCircleQuestion
                  size={
                    13
                  }
                />

                Answer
              </button>

              {role ===
                "main" && (
                <button
                  type="button"
                  onClick={() =>
                    onDelete(
                      item
                    )
                  }
                  className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-red-500/20 px-3.5 text-[11px] font-bold text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2
                    size={
                      13
                    }
                  />

                  Delete
                </button>
              )}
            </div>
          </article>
        )
      )}
    </div>
  );
}

/*
 * PUBLISHED GUIDANCE
 */
function PublishedGuidance({
  groups,
  role,
  expandedGroup,
  setExpandedGroup,
  onAddPerspective,
  onEdit,
  onDelete,
}: {
  groups:
    GuidanceGroup[];

  role:
    AdminRole;

  expandedGroup:
    string | null;

  setExpandedGroup: (
    value:
      string | null
  ) => void;

  onAddPerspective: (
    group:
      GuidanceGroup
  ) => void;

  onEdit: (
    item:
      GuidancePerspective
  ) => void;

  onDelete: (
    item:
      GuidancePerspective
  ) => void;
}) {
  if (
    groups.length ===
    0
  ) {
    return (
      <EmptyState
        title="No published guidance"
        text="Published answers will appear here."
      />
    );
  }

  return (
    <div className="mt-5 space-y-3">
      {groups.map(
        (
          group
        ) => {
          const key =
            group.question
              .trim()
              .toLowerCase();

          const expanded =
            expandedGroup ===
            key;

          return (
            <section
              key={
                key
              }
              className="overflow-hidden rounded-2xl border border-white/10 bg-secondary"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedGroup(
                    expanded
                      ? null
                      : key
                  )
                }
                className="flex w-full items-start justify-between gap-4 p-4 text-left sm:p-5"
              >
                <div>
                  <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-accent">
                    {
                      group.category
                    }
                  </span>

                  <h2 className="mt-3 text-sm font-extrabold leading-6 text-white">
                    {
                      group.question
                    }
                  </h2>

                  <p className="mt-2 text-[10px] text-slate-600">
                    {
                      group
                        .perspectives
                        .length
                    }{" "}

                    {group
                      .perspectives
                      .length ===
                    1
                      ? "perspective"
                      : "perspectives"}
                  </p>
                </div>

                <ChevronDown
                  size={
                    16
                  }
                  className={`mt-1 shrink-0 text-slate-500 transition ${
                    expanded
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {expanded && (
                <div className="border-t border-white/10 px-4 pb-4 sm:px-5 sm:pb-5">
                  <button
                    type="button"
                    onClick={() =>
                      onAddPerspective(
                        group
                      )
                    }
                    className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-3.5 text-[11px] font-bold text-accent transition hover:border-accent/40"
                  >
                    <Plus
                      size={
                        13
                      }
                    />

                    Add perspective
                  </button>

                  <div className="mt-4 space-y-3">
                    {group
                      .perspectives
                      .map(
                        (
                          perspective,
                          index
                        ) => (
                          <article
                            key={
                              perspective.id
                            }
                            className="rounded-xl border border-white/10 bg-primary p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                  Perspective{" "}
                                  {
                                    index +
                                    1
                                  }
                                </p>

                                <p className="mt-1 text-xs font-bold text-white">
                                  {
                                    perspective.author
                                  }
                                </p>
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                  <Eye
                                    size={
                                      11
                                    }
                                  />

                                  {
                                    perspective.views
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 font-serif text-sm leading-7 text-slate-300">
                              <FormattedContent
                                content={
                                  perspective.answer
                                }
                              />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                              <button
                                type="button"
                                onClick={() =>
                                  onEdit(
                                    perspective
                                  )
                                }
                                className="inline-flex min-h-8 items-center gap-2 rounded-lg border border-white/10 px-3 text-[10px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent"
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
                                  onClick={() =>
                                    onDelete(
                                      perspective
                                    )
                                  }
                                  className="inline-flex min-h-8 items-center gap-2 rounded-lg border border-red-500/20 px-3 text-[10px] font-bold text-red-400 transition hover:bg-red-500/10"
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
                          </article>
                        )
                      )}
                  </div>
                </div>
              )}
            </section>
          );
        }
      )}
    </div>
  );
}

/*
 * GUIDANCE EDITOR
 */
function GuidanceEditorModal({
  state,
  onClose,
  onSaved,
}: {
  state:
    EditorState;

  onClose:
    () => void;

  onSaved: (
    message: string
  ) =>
    | Promise<void>
    | void;
}) {
  const [
    answer,
    setAnswer,
  ] =
    useState(
      state.perspective
        ?.answer ??
        ""
    );

  const [
    author,
    setAuthor,
  ] =
    useState(
      state.perspective
        ?.author ??
        ""
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const submit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !answer.trim()
      ) {
        setError(
          "Guidance answer is required."
        );

        return;
      }

      setSubmitting(
        true
      );

      setError("");

      try {
        const editing =
          state.mode ===
          "edit";

        const response =
          await fetch(
            editing
              ? `/api/admin/guidance/answer/${state.perspective?.id}`
              : "/api/admin/guidance",
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
                  category:
                    state.category,

                  question:
                    state.question,

                  answer:
                    answer.trim(),

                  author:
                    author.trim() ||
                    "The Witness Team",
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
              "Unable to save guidance."
          );

          return;
        }

        await onSaved(
          editing
            ? "Perspective updated."
            : state.mode ===
                "alternative"
              ? "New perspective published."
              : "Guidance answer published."
        );
      } catch {
        setError(
          "Unable to save guidance."
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
      aria-labelledby="guidance-editor-title"
    >
      <div className="mx-auto w-full max-w-[720px] rounded-2xl border border-white/10 bg-secondary shadow-2xl">
        {/* TOP */}

        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-accent">
              {
                state.category
              }
            </span>

            <h2
              id="guidance-editor-title"
              className="mt-2 text-lg font-extrabold text-white"
            >
              {state.mode ===
              "edit"
                ? "Edit perspective"
                : state.mode ===
                    "alternative"
                  ? "Add perspective"
                  : "Answer question"}
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
            aria-label="Close guidance editor"
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
          {/* QUESTION */}

          <div className="rounded-xl border border-white/10 bg-primary p-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-600">
              Question
            </span>

            <p className="mt-2 text-sm font-bold leading-6 text-white">
              {
                state.question
              }
            </p>
          </div>

          {/* AUTHOR */}

          <div className="mt-5">
            <label className="mb-2 block text-xs font-bold text-slate-300">
              Answered by
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
              placeholder="The Witness Team"
              className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
            />
          </div>

          {/* ANSWER */}

          <div className="mt-5">
            <RichTextEditor
              label="Guidance answer"
              value={
                answer
              }
              onChange={
                setAnswer
              }
              rows={
                12
              }
              placeholder="Write the guidance response..."
            />
          </div>

          {/* LIVE PREVIEW */}

          {answer.trim() && (
            <div className="mt-5 rounded-xl border border-white/10 bg-primary p-4">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-accent">
                Live preview
              </span>

              <div className="mt-4 font-serif text-sm leading-7 text-slate-300">
                <FormattedContent
                  content={
                    answer
                  }
                />
              </div>
            </div>
          )}

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
                !answer.trim()
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
                : state.mode ===
                    "edit"
                  ? "Save changes"
                  : "Publish guidance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * STAT CARD
 */
function StatCard({
  label,
  value,
}: {
  label:
    string;

  value:
    number;
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

/*
 * EMPTY STATE
 */
function EmptyState({
  title,
  text,
}: {
  title:
    string;

  text:
    string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-secondary px-5 py-14 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <BookOpen
          size={
            17
          }
        />
      </div>

      <p className="mt-4 text-xs font-bold text-slate-400">
        {
          title
        }
      </p>

      <p className="mt-1 text-[10px] text-slate-600">
        {
          text
        }
      </p>
    </div>
  );
}