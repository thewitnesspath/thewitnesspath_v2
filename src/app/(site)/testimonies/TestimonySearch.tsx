"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TestimonySearch({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <label
        htmlFor="testimony-search"
        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40"
      >
        Search testimonies
      </label>

      <input
        id="testimony-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, story or keyword..."
        className="w-full rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm outline-none transition placeholder:text-black/30 focus:border-[#b88a45]/60 focus:ring-2 focus:ring-[#b88a45]/10"
      />
    </div>
  );
}