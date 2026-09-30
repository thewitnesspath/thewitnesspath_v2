"use client";

import {
  BookOpen,
  BookMarked,
  Clock3,
  Eye,
  HeartHandshake,
  MessageSquareQuote,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AdminRole,
  AdminSection,
} from "@/lib/admin/roles";

type Props = {
  role: AdminRole;

  onOpen: (
    section: AdminSection
  ) => void;
};

type OverviewData = {
  success: boolean;

  role: AdminRole;

  stats: {
    pendingTestimonies?: number;
    publishedTestimonies?: number;
    blogPosts?: number;
    prayerRequests?: number;
    unansweredGuidance?: number;
    visits7d?: number;
    uniqueVisitors7d?: number;
    wordEntries?: number;
    publishedAnswers?: number;
  };

  top: {
    blogs: Array<{
      id: number;
      title: string | null;
      views: number | null;
    }>;

    testimonies: Array<{
      id: number;
      Title: string | null;
      views: number | null;
    }>;

    guidance: Array<{
      id: number;
      question: string | null;
      views: number | null;
    }>;
  };
};

function number(
  value?: number
) {
  return new Intl.NumberFormat(
    "en"
  ).format(
    value ?? 0
  );
}

export default function AdminOverview({
  role,
  onOpen,
}: Props) {
  const [data, setData] =
    useState<OverviewData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const load =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await fetch(
            "/api/admin/overview",
            {
              cache:
                "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error();
        }

        setData(result);
      } catch {
        setError(
          "Dashboard data could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards =
    useMemo(() => {
      if (!data) return [];

      if (
        role ===
        "blogger"
      ) {
        return [
          {
            label:
              "Published articles",

            value:
              data.stats
                .blogPosts,

            icon: BookOpen,
          },

          {
            label:
              "Word bank entries",

            value:
              data.stats
                .wordEntries,

            icon: BookMarked,
          },
        ];
      }

      if (
        role ===
        "counselor"
      ) {
        return [
          {
            label:
              "Awaiting guidance",

            value:
              data.stats
                .unansweredGuidance,

            icon:
              HeartHandshake,
          },

          {
            label:
              "Published answers",

            value:
              data.stats
                .publishedAnswers,

            icon:
              MessageSquareQuote,
          },
        ];
      }

      return [
        {
          label:
            "Pending testimonies",

          value:
            data.stats
              .pendingTestimonies,

          icon: Clock3,
        },

        {
          label:
            "Published testimonies",

          value:
            data.stats
              .publishedTestimonies,

          icon:
            MessageSquareQuote,
        },

        {
          label:
            "Blog articles",

          value:
            data.stats
              .blogPosts,

          icon: BookOpen,
        },

        {
          label:
            "Prayer requests",

          value:
            data.stats
              .prayerRequests,

          icon: ShieldCheck,
        },

        {
          label:
            "Awaiting guidance",

          value:
            data.stats
              .unansweredGuidance,

          icon:
            HeartHandshake,
        },

        {
          label:
            "Visits · 7 days",

          value:
            data.stats
              .visits7d,

          icon: Eye,
        },
      ];
    }, [data, role]);

  if (loading) {
    return (
      <div>
        <div className="h-7 w-44 animate-pulse rounded-lg bg-secondary" />

        <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-secondary" />

        <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-white/10 bg-secondary"
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm font-bold text-red-300">
          {error}
        </p>

        <button
          type="button"
          onClick={load}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-accent"
        >
          <RefreshCw
            size={14}
          />

          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
            Dashboard
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white sm:text-3xl">
            Platform overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            A quick view of what
            needs attention and how
            the platform is moving.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          aria-label="Refresh dashboard"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-500 transition hover:border-accent/30 hover:text-accent"
        >
          <RefreshCw
            size={15}
          />
        </button>
      </div>

      {/* MAIN ADMIN MODERATION ALERT */}
      {role === "main" &&
        (
          data.stats
            .pendingTestimonies ??
          0
        ) > 0 && (
          <button
            type="button"
            onClick={() =>
              onOpen(
                "testimonies"
              )
            }
            className="mt-7 flex w-full items-center justify-between gap-4 rounded-2xl border border-accent/25 bg-accent/10 p-4 text-left transition hover:border-accent/50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Clock3
                  size={16}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white">
                  Testimonies
                  waiting for review
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  {
                    data.stats
                      .pendingTestimonies
                  }{" "}
                  pending
                </p>
              </div>
            </div>

            <span className="shrink-0 text-xs font-bold text-accent">
              Review →
            </span>
          </button>
        )}

      {/* STATS */}
      <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-3">
        {cards.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-secondary p-4"
            >
              <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-primary text-slate-500">
                <Icon
                  size={14}
                />
              </div>

              <p className="mt-4 text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl">
                {number(
                  value
                )}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-[11px]">
                {label}
              </p>
            </div>
          )
        )}
      </div>

      {/* TOP CONTENT */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-sm font-extrabold text-white">
            Content performance
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            Most viewed content
            across your available
            areas.
          </p>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          {data.top.blogs.length >
            0 && (
            <PerformanceCard
              title="Blog"
              items={data.top.blogs.map(
                (item) => ({
                  id:
                    item.id,

                  label:
                    item.title ||
                    "Untitled",

                  views:
                    item.views ??
                    0,
                })
              )}
            />
          )}

          {data.top
            .testimonies
            .length > 0 && (
            <PerformanceCard
              title="Testimonies"
              items={data.top.testimonies.map(
                (item) => ({
                  id:
                    item.id,

                  label:
                    item.Title ||
                    "Untitled",

                  views:
                    item.views ??
                    0,
                })
              )}
            />
          )}

          {data.top.guidance
            .length > 0 && (
            <PerformanceCard
              title="Safe Haven"
              items={data.top.guidance.map(
                (item) => ({
                  id:
                    item.id,

                  label:
                    item.question ||
                    "Question",

                  views:
                    item.views ??
                    0,
                })
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PerformanceCard({
  title,
  items,
}: {
  title: string;

  items: Array<{
    id: number;
    label: string;
    views: number;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-secondary p-4">
      <h3 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-accent">
        {title}
      </h3>

      <div className="mt-3 divide-y divide-white/5">
        {items.map(
          (item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <p className="min-w-0 truncate text-xs font-semibold text-slate-300">
                {item.label}
              </p>

              <span className="shrink-0 text-[10px] font-bold text-slate-600">
                {number(
                  item.views
                )}{" "}
                views
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}