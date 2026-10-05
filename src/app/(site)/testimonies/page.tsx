import Image from "next/image";
import Link from "next/link";

import TestimonyList from "@/components/testimony/TestimonyList";
import { listTestimonies } from "@/lib/content/index";
import type { Testimony } from "@/lib/types/testimony";

export const metadata = {
  title: "Testimonies | The Witness Path",
  description:
    "Read real stories of God's faithfulness, restoration, provision and grace.",
};

export default async function TestimoniesPage() {
  let testimonies: Testimony[] = [];

  try {
    const data =
      await listTestimonies();

    testimonies = data.map(
      (item) => ({
        id: String(
          item.id
        ),
        title:
          item.title ||
          "Untitled testimony",
        content:
          item.content ||
          "",
        author:
          item.author ||
          "Anonymous",
        category:
          item.category ||
          "Faith",
        amenCount: Number(
          item.amenCount ??
            0
        ),
        views: Number(
          item.views ?? 0
        ),
      })
    );
  } catch {
    testimonies = [];
  }

  return (
    <main className="min-h-screen bg-[var(--twp-bg)] text-[var(--twp-text)] transition-colors duration-300">
      {/* ===================================================
          PAGE HERO
      =================================================== */}

      <section className="px-4 pb-5 pt-[96px] sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[420px] max-w-[1380px] overflow-hidden rounded-[24px] border border-[#07162E]/10 bg-[#07162E] dark:border-white/10">
          {/* IMAGE */}

          <div className="absolute inset-0 lg:left-[54%]">
            <Image
              src="/images/hero/hero-1.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-[#07162E]/35" />
          </div>

          {/* LIGHT/DARK READABILITY */}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#FFFDF8_0%,#FFFDF8_48%,rgba(255,253,248,0.90)_58%,rgba(255,253,248,0.08)_86%)] dark:bg-[linear-gradient(90deg,#06111F_0%,#06111F_48%,rgba(6,17,31,0.92)_62%,rgba(6,17,31,0.12)_90%)]" />

          {/* CONTENT */}

          <div className="relative z-10 flex min-h-[420px] max-w-[760px] flex-col justify-center px-6 py-14 sm:px-10 lg:px-14">
            <div className="mb-4 flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
              <span className="h-px w-7 bg-current" />
              The witness sanctuary
            </div>

            <h1 className="max-w-[720px] font-serif text-[clamp(3rem,6vw,5.8rem)] leading-[0.94] tracking-[-0.055em] text-[#07162E] dark:text-white">
              Stories worth
              <br />
              <span className="text-[#E98208] dark:text-[#F59E0B]">
                remembering.
              </span>
            </h1>

            <p className="mt-6 max-w-[590px] text-sm leading-7 text-slate-600 sm:text-[15px] dark:text-slate-300">
              Read real
              testimonies of
              God&apos;s
              faithfulness
              through waiting,
              healing,
              provision,
              restoration and
              everyday life.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/testimonies/share"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#F59E0B] px-5 text-[12px] font-extrabold text-[#07162E] shadow-[0_10px_26px_rgba(245,158,11,0.22)] transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Share your
                testimony

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <span className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                Every story is
                reviewed before
                it is published.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          TESTIMONY LIBRARY
      =================================================== */}

      <section className="mx-auto w-full max-w-[1380px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
              Explore the
              stories
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#07162E] sm:text-4xl dark:text-white">
              The Testimony
              Library
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Search by title,
            story, author or
            category and return
            to the testimonies
            that strengthen your
            faith.
          </p>
        </div>

        <TestimonyList
          testimonies={
            testimonies
          }
        />
      </section>
    </main>
  );
}