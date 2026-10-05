"use client";

import {
  ArrowUpRight,
  Eye,
  Search,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import FormattedContent from "@/components/editor/FormattedContent";

type GuidanceAnswer = {
  id: number | string;
  category: string | null;
  question: string | null;
  answer: string | null;
  author: string | null;
  views: number | null;
  created_at: string | null;
};

type Props = {
  answers: GuidanceAnswer[];
};

type GuidanceGroup = {
  question: string;
  category: string;
  answers: GuidanceAnswer[];
  createdAt: string | null;
};

export default function GuidanceLibrary({
  answers,
}: Props) {
  const [
    query,
    setQuery,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    expanded,
    setExpanded,
  ] = useState<
    string | null
  >(null);

  const groups =
    useMemo(() => {
      const map =
        new Map<
          string,
          GuidanceGroup
        >();

      for (
        const answer of
        answers
      ) {
        const question =
          (
            answer.question ||
            ""
          ).trim();

        if (
          !question
        ) {
          continue;
        }

        const key =
          question.toLowerCase();

        const existing =
          map.get(
            key
          );

        if (
          existing
        ) {
          existing.answers.push(
            answer
          );

          continue;
        }

        map.set(
          key,
          {
            question,
            category:
              answer.category ||
              "General Guidance",

            answers: [
              answer,
            ],

            createdAt:
              answer.created_at,
          }
        );
      }

      return Array.from(
        map.values()
      );
    }, [answers]);

  const categories =
    useMemo(
      () => [
        "All",
        ...Array.from(
          new Set(
            groups.map(
              (
                group
              ) =>
                group.category
            )
          )
        ),
      ],
      [groups]
    );

  const visible =
    useMemo(() => {
      const search =
        query
          .trim()
          .toLowerCase();

      return groups.filter(
        (
          group
        ) => {
          if (
            activeCategory !==
              "All" &&
            group.category !==
              activeCategory
          ) {
            return false;
          }

          if (
            !search
          ) {
            return true;
          }

          return (
            group.question
              .toLowerCase()
              .includes(
                search
              ) ||
            group.category
              .toLowerCase()
              .includes(
                search
              ) ||
            group.answers.some(
              (
                answer
              ) =>
                (
                  answer.answer ||
                  ""
                )
                  .toLowerCase()
                  .includes(
                    search
                  )
            )
          );
        }
      );
    }, [
      activeCategory,
      groups,
      query,
    ]);

  return (
    <div>
      {/* SEARCH */}

      <div className="rounded-[18px] border border-[#07162E]/10 bg-white p-4 dark:border-white/10 dark:bg-[#0B1A2A]">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
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
            placeholder="Search questions, struggles or guidance..."
            className="min-h-12 w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] pl-11 pr-11 text-[12px] text-[#07162E] outline-none transition focus:border-[#F59E0B] dark:border-white/10 dark:bg-[#06111F] dark:text-white"
          />

          {query && (
            <button
              type="button"
              onClick={() =>
                setQuery("")
              }
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400"
            >
              <X
                size={14}
              />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(
            (
              category
            ) => {
              const active =
                activeCategory ===
                category;

              return (
                <button
                  key={
                    category
                  }
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`shrink-0 rounded-xl border px-3.5 py-2 text-[9px] font-bold transition ${
                    active
                      ? "border-[#07162E] bg-[#07162E] text-white dark:border-[#F59E0B] dark:bg-[#F59E0B] dark:text-[#07162E]"
                      : "border-[#07162E]/10 text-slate-500 dark:border-white/10 dark:text-slate-400"
                  }`}
                >
                  {
                    category
                  }
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* RESULTS */}

      {visible.length >
      0 ? (
        <div className="mt-5 space-y-4">
          {visible.map(
            (
              group,
              index
            ) => {
              const key =
                group.question.toLowerCase();

              const open =
                expanded ===
                key;

              const totalViews =
                group.answers.reduce(
                  (
                    sum,
                    answer
                  ) =>
                    sum +
                    (
                      answer.views ??
                      0
                    ),
                  0
                );

              return (
                <article
                  key={
                    key
                  }
                  className="overflow-hidden rounded-[18px] border border-[#07162E]/10 bg-white transition hover:border-[#F59E0B]/35 dark:border-white/10 dark:bg-[#0B1A2A]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(
                        open
                          ? null
                          : key
                      )
                    }
                    className="w-full p-5 text-left sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#F59E0B]/10 px-3 py-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#D97706] dark:text-[#F59E0B]">
                            {
                              group.category
                            }
                          </span>

                          <span className="text-[8px] font-semibold text-slate-400">
                            {
                              group
                                .answers
                                .length
                            }{" "}
                            {group
                              .answers
                              .length ===
                            1
                              ? "perspective"
                              : "perspectives"}
                          </span>
                        </div>

                        <h3 className="mt-4 max-w-3xl font-serif text-[25px] leading-[1.12] tracking-[-0.035em] text-[#07162E] sm:text-[29px] dark:text-white">
                          {
                            group.question
                          }
                        </h3>

                        <div className="mt-4 flex items-center gap-1.5 text-[9px] text-slate-400">
                          <Eye
                            size={
                              12
                            }
                          />

                          {
                            totalViews
                          }{" "}
                          views
                        </div>
                      </div>

                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-[#07162E]/10 transition dark:border-white/10 ${
                          open
                            ? "rotate-90 border-[#F59E0B] bg-[#F59E0B] text-[#07162E]"
                            : ""
                        }`}
                      >
                        <ArrowUpRight
                          size={
                            14
                          }
                        />
                      </span>
                    </div>
                  </button>

                  {open && (
                    <div className="border-t border-[#07162E]/10 px-5 pb-6 pt-5 sm:px-6 dark:border-white/10">
                      <div className="space-y-4">
                        {group.answers.map(
                          (
                            answer,
                            answerIndex
                          ) => (
                            <div
                              key={
                                answer.id
                              }
                              className="rounded-[15px] border border-[#07162E]/10 bg-[#FFFDF8] p-4 sm:p-5 dark:border-white/10 dark:bg-[#06111F]"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#07162E]/10 pb-3 dark:border-white/10">
                                <span className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#D97706] dark:text-[#F59E0B]">
                                  Perspective{" "}
                                  {
                                    answerIndex +
                                    1
                                  }
                                </span>

                                <span className="text-[9px] text-slate-400">
                                  Answered by{" "}
                                  {answer.author ||
                                    "The Witness Team"}
                                </span>
                              </div>

                              <div className="mt-4 font-serif text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                                <FormattedContent
                                  content={
                                    answer.answer ||
                                    ""
                                  }
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-[18px] border border-dashed border-[#07162E]/15 px-6 py-14 text-center dark:border-white/10">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No guidance matched
            your search.
          </p>
        </div>
      )}
    </div>
  );
}