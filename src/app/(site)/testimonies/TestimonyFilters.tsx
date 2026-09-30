"use client";

type Props = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
};

export default function TestimonyFilters({
  categories,
  activeCategory,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("All")}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
          activeCategory === "All"
            ? "bg-[#1f2822] text-white"
            : "border border-black/[0.08] bg-white text-[#5f625c] hover:border-black/20"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            activeCategory === category
              ? "bg-[#1f2822] text-white"
              : "border border-black/[0.08] bg-white text-[#5f625c] hover:border-black/20"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}