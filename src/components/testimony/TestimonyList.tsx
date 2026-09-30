"use client";

import { useMemo, useState } from "react";
import TestimonySearch from "../../app/testimonies/TestimonySearch";
import TestimonyFilters from "../../app/testimonies/TestimonyFilters";
import TestimonyCard from "../../app/testimonies/TestimonyCard";
import EmptyState from "@/components/common/EmptyState";
import type { Testimony } from "@/lib/types/testimony";

type Props = {
  testimonies: Testimony[];
};

export default function TestimonyList({ testimonies }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        testimonies
          .map((item) => item.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    ).sort();
  }, [testimonies]);

  const filteredTestimonies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return testimonies.filter((testimony) => {
      const matchesCategory =
        activeCategory === "All" ||
        testimony.category === activeCategory;

      const searchableText = [
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
        searchableText.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [testimonies, query, activeCategory]);

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <TestimonySearch
          value={query}
          onChange={setQuery}
        />

        <TestimonyFilters
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      <div className="mt-8 flex items-center justify-between text-xs text-black/40">
        <span>
          {filteredTestimonies.length}{" "}
          {filteredTestimonies.length === 1
            ? "testimony"
            : "testimonies"}
        </span>

        {(query || activeCategory !== "All") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
            }}
            className="font-semibold text-[#8d682f] transition hover:text-[#6d4f21]"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6">
        {filteredTestimonies.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTestimonies.map((testimony) => (
              <TestimonyCard
                key={testimony.id}
                testimony={testimony}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No testimonies found"
            description="Try a different keyword or category."
          />
        )}
      </div>
    </>
  );
}