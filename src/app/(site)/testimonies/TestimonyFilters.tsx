"use client";

type Props = {
  categories: string[];
  activeCategory: string;
  onChange: (
    category: string
  ) => void;
};

export default function TestimonyFilters({
  categories,
  activeCategory,
  onChange,
}: Props) {
  const allCategories = [
    "All",
    ...categories,
  ];

  return (
    <div className="min-w-0">
      <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        Filter by category
      </p>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:flex-wrap">
        {allCategories.map(
          (category) => {
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
                  onChange(
                    category
                  )
                }
                className={`shrink-0 rounded-xl border px-4 py-2.5 text-[10px] font-bold transition duration-300 ${
                  active
                    ? "border-[#07162E] bg-[#07162E] text-white shadow-[0_7px_18px_rgba(7,22,46,0.14)] dark:border-[#F59E0B] dark:bg-[#F59E0B] dark:text-[#07162E]"
                    : "border-[#07162E]/10 bg-[#FFFDF8] text-slate-500 hover:border-[#F59E0B]/50 hover:text-[#D97706] dark:border-white/10 dark:bg-[#06111F] dark:text-slate-400 dark:hover:border-[#F59E0B]/50 dark:hover:text-[#F59E0B]"
                }`}
              >
                {category}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}