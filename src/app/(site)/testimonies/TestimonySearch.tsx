"use client";

import {
  Search,
  X,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (
    value: string
  ) => void;
};

export default function TestimonySearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="w-full">
      <label
        htmlFor="testimony-search"
        className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500"
      >
        Search testimonies
      </label>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id="testimony-search"
          type="search"
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }
          placeholder="Search a story, title or keyword..."
          className="min-h-[48px] w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] py-3 pl-11 pr-11 text-[13px] text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B]/70 focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white dark:placeholder:text-slate-600"
        />

        {value && (
          <button
            type="button"
            onClick={() =>
              onChange("")
            }
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-[#07162E]/5 hover:text-[#07162E] dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X
              size={14}
            />
          </button>
        )}
      </div>
    </div>
  );
}