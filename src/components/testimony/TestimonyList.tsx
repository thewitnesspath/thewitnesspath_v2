"use client";

import {
  useMemo,
  useState,
} from "react";

import TestimonySearch from "../../app/(site)/testimonies/TestimonySearch";
import TestimonyFilters from "../../app/(site)/testimonies/TestimonyFilters";
import TestimonyCard from "../../app/(site)/testimonies/TestimonyCard";

import EmptyState from "@/components/common/EmptyState";
import type { Testimony } from "@/lib/types/testimony";

type Props = {
  testimonies: Testimony[];
};

export default function TestimonyList({
  testimonies,
}: Props) {
  const [
    query,
    setQuery,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const categories =
    useMemo(() => {
      return Array.from(
        new Set(
          testimonies
            .map((item) =>
              item.category?.trim()
            )
            .filter(
              (
                category
              ): category is string =>
                Boolean(
                  category
                )
            )
        )
      ).sort();
    }, [testimonies]);

  const filteredTestimonies =
    useMemo(() => {
      const normalizedQuery =
        query
          .trim()
          .toLowerCase();

      return testimonies.filter(
        (testimony) => {
          const matchesCategory =
            activeCategory ===
              "All" ||
            testimony.category ===
              activeCategory;

          const searchableText =
            [
              testimony.title,
              testimony.content,
              testimony.author,
              testimony.category,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            !normalizedQuery ||
            searchableText.includes(
              normalizedQuery
            );

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      testimonies,
      query,
      activeCategory,
    ]);

  const hasFilters =
    Boolean(query.trim()) ||
    activeCategory !==
      "All";

  function clearFilters() {
    setQuery("");
    setActiveCategory(
      "All"
    );
  }

  return (
    <>
      {/* FILTER PANEL */}

      <div className="rounded-[20px] border border-[#07162E]/10 bg-white p-4 shadow-[0_10px_35px_rgba(7,22,46,0.04)] sm:p-5 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
        <div className="grid gap-5 xl:grid-cols-[minmax(320px,0.8fr)_1.4fr] xl:items-end">
          <TestimonySearch
            value={query}
            onChange={
              setQuery
            }
          />

          <TestimonyFilters
            categories={
              categories
            }
            activeCategory={
              activeCategory
            }
            onChange={
              setActiveCategory
            }
          />
        </div>
      </div>

      {/* RESULT META */}

      <div className="mt-6 flex min-h-8 items-center justify-between gap-4">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-extrabold text-[#07162E] dark:text-white">
            {
              filteredTestimonies.length
            }
          </span>{" "}
          {filteredTestimonies.length ===
          1
            ? "testimony"
            : "testimonies"}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="text-[11px] font-bold text-[#D97706] transition hover:text-[#A85D00] dark:text-[#F59E0B] dark:hover:text-amber-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* CARDS */}

      <div className="mt-5">
        {filteredTestimonies.length >
        0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTestimonies.map(
              (
                testimony,
              ) => (
                <TestimonyCard
                  key={testimony.id}
                  testimony={testimony}
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#07162E]/15 bg-white/60 py-8 dark:border-white/10 dark:bg-[#0B1A2A]/60">
            <EmptyState
              title="No testimonies found"
              description="Try another keyword or select a different category."
            />

            {hasFilters && (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="rounded-xl bg-[#F59E0B] px-4 py-2.5 text-[11px] font-extrabold text-[#07162E]"
                >
                  Reset search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}