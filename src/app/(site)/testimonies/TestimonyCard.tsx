import Link from "next/link";
import type { Testimony } from "@/lib/types/testimony";

type Props = {
  testimony: Testimony;
};

export default function TestimonyCard({ testimony }: Props) {
  const excerpt =
    testimony.content.length > 180
      ? `${testimony.content.slice(0, 180).trimEnd()}…`
      : testimony.content;

  return (
    <Link
      href={`/testimonies/${testimony.id}`}
      className="group flex h-full flex-col justify-between rounded-[24px] border border-black/[0.07] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b88a45]/30 hover:shadow-[0_18px_50px_rgba(20,20,20,0.06)]"
    >
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#f4eee4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9d7135]">
            {testimony.category || "Faith"}
          </span>

          <span className="text-[10px] uppercase tracking-[0.14em] text-black/35">
            {testimony.author || "Anonymous"}
          </span>
        </div>

        <h2 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-[#1d201d] sm:text-3xl">
          {testimony.title}
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#6d706a]">
          {excerpt}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-black/[0.07] pt-5 text-sm font-semibold text-[#4c504b]">
        <span>Read testimony</span>

        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          ↗
        </span>
      </div>
    </Link>
  );
}