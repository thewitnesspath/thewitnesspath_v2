"use client";

import {
  Search,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import PrayerCard from "./PrayerCard";

import type {
  PrayerRequest,
} from "@/app/(site)/prayer/page";

type Props = {
  requests: PrayerRequest[];
};

export default function PrayerList({
  requests,
}: Props) {
  const [
    category,
    setCategory,
  ] = useState("All");

  const [
    query,
    setQuery,
  ] = useState("");

  const categories =
    useMemo(() => {
      const values =
        Array.from(
          new Set(
            requests
              .map(
                (
                  request
                ) =>
                  request.category
              )
              .filter(
                (
                  value
                ): value is string =>
                  Boolean(
                    value
                  )
              )
          )
        );

      return [
        "All",
        ...values,
      ];
    }, [requests]);

  const visible =
    useMemo(() => {
      const search =
        query
          .trim()
          .toLowerCase();

      return requests.filter(
        (
          request
        ) => {
          if (
            category !==
              "All" &&
            request.category !==
              category
          ) {
            return false;
          }

          if (!search) {
            return true;
          }

          return (
            request.content
              .toLowerCase()
              .includes(
                search
              ) ||
            (
              request.category ||
              ""
            )
              .toLowerCase()
              .includes(
                search
              )
          );
        }
      );
    }, [
      category,
      query,
      requests,
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
            placeholder="Search prayer requests..."
            className="min-h-12 w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] pl-11 pr-11 text-[12px] outline-none focus:border-[#F59E0B] dark:border-white/10 dark:bg-[#06111F] dark:text-white"
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

        {/* FILTERS */}

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(
            (
              item
            ) => {
              const active =
                category ===
                item;

              return (
                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    setCategory(
                      item
                    )
                  }
                  className={`shrink-0 rounded-xl border px-3.5 py-2 text-[9px] font-bold transition ${
                    active
                      ? "border-[#07162E] bg-[#07162E] text-white dark:border-[#F59E0B] dark:bg-[#F59E0B] dark:text-[#07162E]"
                      : "border-[#07162E]/10 text-slate-500 dark:border-white/10 dark:text-slate-400"
                  }`}
                >
                  {item}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* COUNT */}

      <p className="mt-5 text-[10px] text-slate-400">
        <strong className="text-[#07162E] dark:text-white">
          {
            visible.length
          }
        </strong>{" "}
        {visible.length ===
        1
          ? "request"
          : "requests"}
      </p>

      {/* REQUESTS */}

      {visible.length >
      0 ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {visible.map(
            (
              request
            ) => (
              <PrayerCard
                key={
                  request.id
                }
                request={
                  request
                }
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-[18px] border border-dashed border-[#07162E]/15 px-6 py-14 text-center dark:border-white/10">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No prayer requests
            matched your search.
          </p>
        </div>
      )}
    </div>
  );
}