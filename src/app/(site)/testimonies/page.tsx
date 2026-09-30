import Link from "next/link";
import TestimonyList from "@/components/testimony/TestimonyList";
import { listTestimonies } from "@/lib/content/index";
import type { Testimony } from "@/lib/types/testimony";

export const metadata = {
  title: "Testimonies",
  description:
    "Read real stories of God's faithfulness, restoration, provision and grace.",
};

export default async function TestimoniesPage() {
  let testimonies: Testimony[] = [];

  try {
    const data = await listTestimonies();

    testimonies = data.map((item) => ({
      id: String(item.id),
      title: item.title || "Untitled testimony",
      content: item.content || "",
      author: item.author || "Anonymous",
      category: item.category || "Faith",
      amenCount: Number(item.amenCount ?? 0),
      views: Number(item.views ?? 0),
    }));
  } catch {
    testimonies = [];
  }

  return (
    <main className="bg-[#fbfaf6]">
      {/* HEADER */}
      <section className="border-b border-black/[0.06]">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b88a45]">
              <span className="h-px w-6 bg-current" />
              The witness sanctuary
            </div>

            <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Stories of grace,
              <span className="block text-[#b88a45]">
                preserved for the journey.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#73766f] sm:text-base">
              Search, read and return to testimonies of God&apos;s faithfulness
              from people walking through real seasons of life.
            </p>

            <Link
              href="/testimonies/share"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#1f2822] px-5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#151b17]"
            >
              Share your testimony
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONY LIBRARY */}
      <section className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <TestimonyList testimonies={testimonies} />
      </section>
    </main>
  );
}