import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Eye,
  Sparkles,
} from "lucide-react";

import type { Testimony } from "@/lib/types/testimony";
import { getTestimonyImage } from "@/lib/content-images";

type Props = {
  testimony: Testimony;
};

export default function TestimonyCard({
  testimony,
}: Props) {
  const excerpt =
    testimony.content.length > 165
      ? `${testimony.content
          .slice(0, 165)
          .trimEnd()}…`
      : testimony.content;

  const image = getTestimonyImage(
    testimony.category
  );

  return (
    <Link
      href={`/testimonies/${testimony.id}`}
      className="group flex h-full min-h-[480px] flex-col overflow-hidden rounded-[20px] border border-[#07162E]/10 bg-white shadow-[0_12px_35px_rgba(7,22,46,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/40 hover:shadow-[0_22px_55px_rgba(7,22,46,0.10)] dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none"
    >
      {/* IMAGE */}
      <div className="relative h-[210px] shrink-0 overflow-hidden bg-slate-100 dark:bg-[#0E1628]">
        <Image
          src={image}
          alt={`${testimony.category || "Faith"} testimony`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.045]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/55 via-[#06111F]/5 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className="rounded-full border border-[#F59E0B]/60 bg-[#06111F]/70 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.17em] text-white backdrop-blur-md">
            {testimony.category || "Faith"}
          </span>

          <span className="text-[9px] font-semibold text-white/75">
            By {testimony.author || "Anonymous"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-serif text-[28px] leading-[1.04] tracking-[-0.04em] text-[#07162E] transition-colors duration-300 group-hover:text-[#D97706] sm:text-[30px] dark:text-white dark:group-hover:text-[#F59E0B]">
          {testimony.title}
        </h2>

        <p className="mt-4 line-clamp-4 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
          {excerpt ||
            "Read this testimony of God's faithfulness."}
        </p>

        <div className="mt-auto pt-7">
          {/* META */}
          <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles
                size={13}
                className="text-[#D97706] dark:text-[#F59E0B]"
              />

              {testimony.amenCount ?? 0} praise
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Eye size={13} />

              {testimony.views ?? 0} views
            </span>
          </div>

          {/* FOOTER */}
          <div className="mt-4 flex items-center justify-between border-t border-[#07162E]/10 pt-4 dark:border-white/10">
            <span className="text-[11px] font-extrabold text-[#07162E] dark:text-white">
              Read testimony
            </span>

            <span className="flex size-9 items-center justify-center rounded-full border border-[#07162E]/10 text-[#07162E] transition duration-300 group-hover:border-[#F59E0B] group-hover:bg-[#F59E0B] dark:border-white/10 dark:text-white dark:group-hover:text-[#07162E]">
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}