import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ShareTestimonyForm from "@/components/testimony/ShareTestimonyForm";

export const metadata = {
  title: "Share Your Testimony | The Witness Path",
  description:
    "Share what God has done and encourage someone else through your testimony.",
};

export default function ShareTestimonyPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* ===================================================
          INTRO / HERO
      =================================================== */}

      <section className="px-4 pb-5 pt-[96px] sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[390px] max-w-[1380px] overflow-hidden rounded-[24px] border border-[#07162E]/10 bg-white dark:border-white/10 dark:bg-[#0B1A2A]">
          {/* RIGHT IMAGE */}

          <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
            <Image
              src="/images/hero/hero-3.jpg"
              alt=""
              fill
              priority
              sizes="48vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[#07162E]/15 dark:bg-[#020617]/30" />
          </div>

          {/* LIGHT MODE FADE */}

          <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#FFFDF8_0%,#FFFDF8_45%,rgba(255,253,248,0.94)_57%,rgba(255,253,248,0.08)_86%)] lg:block dark:bg-[linear-gradient(90deg,#0B1A2A_0%,#0B1A2A_45%,rgba(11,26,42,0.95)_58%,rgba(11,26,42,0.12)_88%)]" />

          {/* MOBILE IMAGE TREATMENT */}

          <div className="absolute inset-0 lg:hidden">
            <Image
              src="/images/hero/hero-3.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[#FFFDF8]/95 dark:bg-[#06111F]/92" />
          </div>

          {/* CONTENT */}

          <div className="relative z-10 flex min-h-[390px] max-w-[760px] flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
            <Link
              href="/testimonies"
              className="group mb-9 inline-flex w-fit items-center gap-2 text-[11px] font-bold text-slate-500 transition hover:text-[#D97706] dark:text-slate-400 dark:hover:text-[#F59E0B]"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Back to testimonies
            </Link>

            <div className="flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
              <span className="h-px w-7 bg-current" />

              Your voice matters
            </div>

            <h1 className="mt-4 max-w-[700px] font-serif text-[clamp(3rem,6vw,5.6rem)] leading-[0.94] tracking-[-0.055em] text-[#07162E] dark:text-white">
              Tell the story of
              <br />

              <span className="text-[#E98208] dark:text-[#F59E0B]">
                what God has done.
              </span>
            </h1>

            <p className="mt-6 max-w-[590px] text-sm leading-7 text-slate-600 sm:text-[15px] dark:text-slate-300">
              You do not need perfect words.
              Share honestly, thoughtfully, and
              at your own pace. Your testimony
              may become the encouragement
              someone else has been praying for.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          FORM SECTION
      =================================================== */}

      <section className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* SECTION HEADING */}

        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
              Share your story
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#07162E] sm:text-4xl dark:text-white">
              Take your time.
              <span className="block text-slate-400 dark:text-slate-500">
                There is no rush here.
              </span>
            </h2>
          </div>

          <div className="flex max-w-sm items-start gap-3 rounded-xl border border-[#07162E]/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0B1A2A]">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
            />

            <p className="text-[10px] leading-5 text-slate-500 dark:text-slate-400">
              Testimonies are reviewed before
              publication to protect privacy and
              preserve a thoughtful community.
            </p>
          </div>
        </div>

        {/* FORM SHELL */}

        <div
          className="
            rounded-[24px]
            border
            border-[#07162E]/10
            bg-white
            p-5
            shadow-[0_20px_60px_rgba(7,22,46,0.06)]
            transition-colors
            duration-300
            sm:p-7
            lg:p-9

            dark:border-white/10
            dark:bg-[#0B1A2A]
            dark:shadow-[0_22px_70px_rgba(0,0,0,0.22)]

            [&_label]:text-[#07162E]
            dark:[&_label]:text-slate-200

            [&_input]:border-[#07162E]/10
            [&_input]:bg-[#FFFDF8]
            [&_input]:text-[#07162E]
            [&_input]:placeholder:text-slate-400

            dark:[&_input]:border-white/10
            dark:[&_input]:bg-[#06111F]
            dark:[&_input]:text-white
            dark:[&_input]:placeholder:text-slate-600

            [&_textarea]:border-[#07162E]/10
            [&_textarea]:bg-[#FFFDF8]
            [&_textarea]:text-[#07162E]
            [&_textarea]:placeholder:text-slate-400

            dark:[&_textarea]:border-white/10
            dark:[&_textarea]:bg-[#06111F]
            dark:[&_textarea]:text-white
            dark:[&_textarea]:placeholder:text-slate-600

            [&_select]:border-[#07162E]/10
            [&_select]:bg-[#FFFDF8]
            [&_select]:text-[#07162E]

            dark:[&_select]:border-white/10
            dark:[&_select]:bg-[#06111F]
            dark:[&_select]:text-white
          "
        >
          <ShareTestimonyForm />
        </div>

        {/* BOTTOM NOTE */}

        <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-[#F59E0B]/20 bg-[#F59E0B]/[0.06] px-5 py-4 dark:border-[#F59E0B]/20 dark:bg-[#F59E0B]/[0.07]">
          <Sparkles
            size={16}
            className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
          />

          <p className="text-[11px] leading-5 text-slate-600 dark:text-slate-400">
            Your story does not need to sound
            polished to matter. Write it as you
            remember it, in your own words.
          </p>
        </div>
      </section>
    </main>
  );
}