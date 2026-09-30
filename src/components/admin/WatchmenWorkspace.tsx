"use client";

import {
  Check,
  Clipboard,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type {
  AdminRole,
} from "@/lib/admin/roles";

type Props = {
  role: AdminRole;
};

type PoolItem = {
  id: string;
  text: string;
};

type Pools = {
  answers: PoolItem[];
  burdens: PoolItem[];
  testimonies: PoolItem[];
  blogs: PoolItem[];
};

type AssignmentType =
  | "Guidance Answer"
  | "Prayer Burden"
  | "Blog Post"
  | "Testimony";

type AssignmentItem = {
  type: AssignmentType;
  text: string;
};

type Assignment = {
  warriorNum: number;
  items: AssignmentItem[];
};

function todayStorageKey() {
  /*
   * Preserve the legacy UTC
   * daily key behavior.
   */
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  return `watchmen_assignments_${today}`;
}

function normalizeStoredAssignments(
  value: unknown
): Assignment[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .map(
      (
        assignment: any
      ): Assignment | null => {
        if (
          typeof assignment
            ?.warriorNum !==
          "number"
        ) {
          return null;
        }

        const items =
          Array.isArray(
            assignment.items
          )
            ? assignment.items
                .map(
                  (
                    item: any
                  ):
                    | AssignmentItem
                    | null => {
                    const type =
                      item?.type as
                        AssignmentType;

                    if (!type) {
                      return null;
                    }

                    /*
                     * New format.
                     */
                    if (
                      typeof item.text ===
                      "string"
                    ) {
                      return {
                        type,
                        text:
                          item.text,
                      };
                    }

                    /*
                     * Legacy format:
                     * { type, data }
                     */
                    const legacy =
                      item.data;

                    const text =
                      legacy
                        ?.question ||
                      legacy?.Title ||
                      legacy?.title ||
                      legacy?.content;

                    if (
                      typeof text !==
                      "string"
                    ) {
                      return null;
                    }

                    return {
                      type,
                      text,
                    };
                  }
                )
                .filter(
                  Boolean
                ) as
                AssignmentItem[]
            : [];

        return {
          warriorNum:
            assignment.warriorNum,

          items,
        };
      }
    )
    .filter(
      Boolean
    ) as Assignment[];
}

export default function WatchmenWorkspace({
  role,
}: Props) {
  const [
    pools,
    setPools,
  ] =
    useState<Pools | null>(
      null
    );

  const [
    locked,
    setLocked,
  ] = useState(false);

  const [
    pin,
    setPin,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    unlocking,
    setUnlocking,
  ] = useState(false);

  const [
    warriorCount,
    setWarriorCount,
  ] = useState("1");

  const [
    assignments,
    setAssignments,
  ] =
    useState<Assignment[]>(
      []
    );

  const [
    message,
    setMessage,
  ] = useState("");

  const loadPools =
    useCallback(async () => {
      setLoading(true);
      setMessage("");

      try {
        const response =
          await fetch(
            "/api/admin/watchmen/pools",
            {
              cache:
                "no-store",
            }
          );

        const result =
          await response.json();

        if (
          response.status ===
          423
        ) {
          setLocked(true);
          setPools(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message
          );
        }

        setLocked(false);
        setPools(
          result.pools
        );
      } catch {
        setMessage(
          "Prayer assignment sources could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  /*
   * Restore today's assignments
   * exactly as the old portal did.
   */
  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const saved =
      sessionStorage.getItem(
        todayStorageKey()
      );

    if (!saved) {
      return;
    }

    try {
      const parsed =
        JSON.parse(saved);

      const restored =
        normalizeStoredAssignments(
          parsed.assignments
        );

      setAssignments(
        restored
      );

      if (
        parsed.warriorCount
      ) {
        setWarriorCount(
          String(
            parsed.warriorCount
          )
        );
      }
    } catch {
      // Ignore malformed
      // session data.
    }
  }, []);

  const unlock =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (!pin.trim()) {
        return;
      }

      setUnlocking(true);
      setMessage("");

      try {
        const response =
          await fetch(
            "/api/admin/watchmen/unlock",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  pin,
                }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          setMessage(
            result.message ||
              "Incorrect Watchmen PIN."
          );

          return;
        }

        setPin("");
        setLocked(false);

        await loadPools();
      } catch {
        setMessage(
          "Watchmen access could not be verified."
        );
      } finally {
        setUnlocking(false);
      }
    };

  const generate =
    () => {
      if (!pools) {
        return;
      }

      const count =
        Number.parseInt(
          warriorCount,
          10
        );

      if (
        Number.isNaN(
          count
        ) ||
        count < 1
      ) {
        setMessage(
          "Enter a valid number of available prayer warriors."
        );

        return;
      }

      setMessage("");

      /*
       * Preserve the existing
       * assignment algorithm.
       */
      let next:
        Assignment[];

      if (
        count <=
        assignments.length
      ) {
        next =
          assignments.slice(
            0,
            count
          );
      } else {
        next = [
          ...assignments,
        ];

        for (
          let i =
            assignments.length;
          i < count;
          i++
        ) {
          const items:
            AssignmentItem[] =
            [];

          if (
            pools.answers
              .length > 0
          ) {
            const item =
              pools.answers[
                i %
                  pools.answers
                    .length
              ];

            items.push({
              type:
                "Guidance Answer",

              text:
                item.text,
            });
          }

          if (
            pools.burdens
              .length > 0
          ) {
            const item =
              pools.burdens[
                i %
                  pools.burdens
                    .length
              ];

            items.push({
              type:
                "Prayer Burden",

              text:
                item.text,
            });
          }

          if (
            pools.blogs
              .length > 0
          ) {
            const item =
              pools.blogs[
                i %
                  pools.blogs
                    .length
              ];

            items.push({
              type:
                "Blog Post",

              text:
                item.text,
            });
          }

          /*
           * Testimonies remain the
           * primary overflow pool.
           */
          while (
            items.length <
              4 &&
            pools
              .testimonies
              .length >
              0
          ) {
            const index =
              (
                i * 4 +
                items.length
              ) %
              pools
                .testimonies
                .length;

            const item =
              pools
                .testimonies[
                index
              ];

            items.push({
              type:
                "Testimony",

              text:
                item.text,
            });
          }

          /*
           * Preserve the legacy
           * fallback sequence.
           */
          while (
            items.length <
            4
          ) {
            if (
              pools
                .testimonies
                .length >
              0
            ) {
              const item =
                pools
                  .testimonies[
                  items.length %
                    pools
                      .testimonies
                      .length
                ];

              items.push({
                type:
                  "Testimony",

                text:
                  item.text,
              });
            } else if (
              pools.answers
                .length > 0
            ) {
              const item =
                pools.answers[
                  items.length %
                    pools
                      .answers
                      .length
                ];

              items.push({
                type:
                  "Guidance Answer",

                text:
                  item.text,
              });
            } else {
              break;
            }
          }

          next.push({
            warriorNum:
              i + 1,

            items,
          });
        }
      }

      setAssignments(
        next
      );

      sessionStorage.setItem(
        todayStorageKey(),
        JSON.stringify({
          warriorCount:
            count,

          assignments:
            next,
        })
      );

      setMessage(
        `${next.length} prayer ${
          next.length === 1
            ? "assignment"
            : "assignments"
        } ready.`
      );
    };

  const copyAssignment =
    async (
      assignment:
        Assignment
    ) => {
      const text =
        `🛡️ PRAYER ASSIGNMENT: WARRIOR #${assignment.warriorNum}\n` +
        assignment.items
          .map(
            (
              item,
              index
            ) =>
              `\n${index + 1}. [${item.type}] ${item.text}`
          )
          .join("");

      try {
        await navigator
          .clipboard
          .writeText(text);

        setMessage(
          `Assignment copied for Warrior #${assignment.warriorNum}.`
        );
      } catch {
        setMessage(
          "The assignment could not be copied automatically."
        );
      }
    };

  /*
   * Main Admin must unlock the
   * Watchmen module.
   *
   * A direct Watchmen login has
   * already been verified.
   */
  if (
    locked &&
    role === "main"
  ) {
    return (
      <div>
        <div className="border-b border-white/10 pb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Internal ministry
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Watchmen
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            This ministry workspace
            keeps its existing
            secondary PIN
            protection.
          </p>
        </div>

        <form
          onSubmit={unlock}
          className="mt-8 max-w-[430px] rounded-2xl border border-white/10 bg-secondary p-5"
        >
          <div className="flex size-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <LockKeyhole
              size={17}
            />
          </div>

          <h2 className="mt-4 text-base font-extrabold text-white">
            Unlock Watchmen
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            Enter the existing
            Watchmen PIN to continue.
          </p>

          <input
            type="password"
            value={pin}
            onChange={(
              event
            ) =>
              setPin(
                event.target
                  .value
              )
            }
            placeholder="Watchmen PIN"
            className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-accent/50"
          />

          {message && (
            <p className="mt-3 text-xs text-red-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={
              unlocking ||
              !pin.trim()
            }
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-xs font-extrabold text-primary disabled:opacity-40"
          >
            {unlocking && (
              <Loader2
                size={13}
                className="animate-spin"
              />
            )}

            Unlock workspace
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Internal ministry
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">
            Watchmen
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
            Prepare structured prayer
            assignments from current
            platform burdens and
            content.
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadPools
          }
          disabled={loading}
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent disabled:opacity-40"
        >
          <RefreshCw
            size={13}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh sources
        </button>
      </div>

      {loading &&
      !pools ? (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-white/10 bg-secondary"
              />
            )
          )}
        </div>
      ) : pools ? (
        <>
          {/* SOURCE COUNTS */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SourceStat
              label="Guidance"
              value={
                pools
                  .answers
                  .length
              }
            />

            <SourceStat
              label="Prayer burdens"
              value={
                pools
                  .burdens
                  .length
              }
            />

            <SourceStat
              label="Testimonies"
              value={
                pools
                  .testimonies
                  .length
              }
            />

            <SourceStat
              label="Blog posts"
              value={
                pools
                  .blogs
                  .length
              }
            />
          </div>

          {/* GENERATOR */}
          <section className="mt-6 rounded-2xl border border-white/10 bg-secondary p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                <Users
                  size={15}
                />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-white">
                  Generate today&apos;s
                  assignments
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Existing assignments
                  for today are retained
                  when the number of
                  available warriors
                  changes.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="w-full sm:max-w-[210px]">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  Available warriors
                </label>

                <input
                  type="number"
                  min={1}
                  step={1}
                  value={
                    warriorCount
                  }
                  onChange={(
                    event
                  ) =>
                    setWarriorCount(
                      event.target
                        .value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-primary px-3.5 text-sm font-bold text-white outline-none focus:border-accent/50"
                />
              </div>

              <button
                type="button"
                onClick={
                  generate
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xs font-extrabold text-primary transition hover:brightness-105"
              >
                <ShieldCheck
                  size={14}
                />

                Generate assignments
              </button>
            </div>
          </section>

          {message && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-secondary px-4 py-3 text-xs text-slate-300">
              <Check
                size={13}
                className="shrink-0 text-accent"
              />

              {message}
            </div>
          )}

          {/* ASSIGNMENTS */}
          {assignments.length >
          0 ? (
            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              {assignments.map(
                (
                  assignment
                ) => (
                  <article
                    key={
                      assignment.warriorNum
                    }
                    className="rounded-2xl border border-white/10 bg-secondary p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-accent">
                          Prayer assignment
                        </p>

                        <h2 className="mt-1 text-sm font-extrabold text-white">
                          Warrior #
                          {
                            assignment.warriorNum
                          }
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          copyAssignment(
                            assignment
                          )
                        }
                        className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[10px] font-bold text-slate-400 transition hover:border-accent/30 hover:text-accent"
                      >
                        <Clipboard
                          size={12}
                        />

                        Copy
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      {assignment.items.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={`${assignment.warriorNum}-${index}`}
                            className="rounded-xl border border-white/10 bg-primary p-3"
                          >
                            <div className="flex items-start gap-3">
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[9px] font-extrabold text-accent">
                                {index +
                                  1}
                              </span>

                              <div className="min-w-0">
                                <span className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                  {
                                    item.type
                                  }
                                </span>

                                <p className="mt-1 text-xs font-medium leading-5 text-slate-300">
                                  {
                                    item.text
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-secondary py-14 text-center">
              <ShieldCheck
                size={20}
                className="mx-auto text-slate-700"
              />

              <p className="mt-3 text-xs font-bold text-slate-500">
                No assignments generated
                yet.
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

function SourceStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-secondary p-4">
      <p className="text-xl font-extrabold tracking-[-0.03em] text-white">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600">
        {label}
      </p>
    </div>
  );
}