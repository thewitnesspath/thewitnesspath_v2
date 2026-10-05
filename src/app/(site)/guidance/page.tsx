import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  HeartHandshake,
  LockKeyhole,
  MessageCircleQuestion,
  ShieldCheck,
} from "lucide-react";

import GuidanceLibrary from "@/components/guidance/GuidanceLibrary";
import ShareStruggleForm from "@/components/guidance/ShareStruggleForm";

import {
  supabase,
} from "@/lib/supabase/client";

type GuidanceAnswer = {
  id: number | string;
  category: string | null;
  question: string | null;
  answer: string | null;
  author: string | null;
  views: number | null;
  created_at: string | null;
};

async function getGuidanceAnswers(): Promise<GuidanceAnswer[]> {
  const {
    data,
    error,
  } =
    await supabase
      .from("Answers")
      .select(
        `
          id,
          category,
          question,
          answer,
          author,
          views,
          created_at
        `
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Guidance fetch failed:",
      error
    );

    return [];
  }

  return (
    data ?? []
  ) as GuidanceAnswer[];
}

export const metadata = {
  title:
    "Safe Haven | The Witness Path",
  description:
    "A thoughtful space for questions, struggles, prayer and biblical guidance.",
};

export default async function GuidancePage() {
  const answers =
    await getGuidanceAnswers();

  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="px-3 pb-5 pt-[94px] sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[610px] max-w-[1420px] overflow-hidden rounded-[26px] border border-[#07162E]/10 bg-white shadow-[0_24px_80px_rgba(7,22,46,0.10)] dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-[0_28px_90px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-0">
            <Image
              src="/images/hero/hero-3.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,248,0.99)_0%,rgba(255,253,248,0.97)_42%,rgba(255,253,248,0.78)_63%,rgba(255,253,248,0.16)_100%)] dark:bg-[linear-gradient(90deg,rgba(6,17,31,0.99)_0%,rgba(6,17,31,0.96)_43%,rgba(6,17,31,0.78)_66%,rgba(6,17,31,0.20)_100%)]" />
          </div>

          <div className="relative z-10 flex min-h-[610px] max-w-[760px] flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 xl:px-16">
            <div className="flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#D97706] dark:text-[#F59E0B]">
              <span className="h-px w-7 bg-current" />

              Safe Haven
            </div>

            <h1 className="mt-5 font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-[-0.06em] text-[#07162E] dark:text-white">
              You don&apos;t
              <br />

              have to carry
              <br />

              <span className="text-[#E98208] dark:text-[#F59E0B]">
                it alone.
              </span>
            </h1>

            <p className="mt-7 max-w-[570px] text-sm leading-7 text-slate-600 sm:text-[16px] dark:text-slate-300">
              Bring your questions, quiet struggles,
              doubts and difficult seasons into a
              thoughtful space shaped by prayer,
              biblical guidance and compassion.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#share-struggle"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-[12px] font-extrabold text-[#07162E] shadow-[0_12px_28px_rgba(245,158,11,0.22)] transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Share Anonymously

                <ArrowUpRight
                  size={14}
                />
              </a>

              <a
                href="#guidance-library"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#07162E]/15 bg-white/60 px-6 text-[12px] font-bold text-[#07162E] backdrop-blur transition hover:border-[#F59E0B] dark:border-white/15 dark:bg-[#06111F]/35 dark:text-white"
              >
                Read Guidance
              </a>
            </div>

            <div className="mt-8 flex max-w-xl items-start gap-3 border-t border-[#07162E]/10 pt-5 text-[10px] leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
              <LockKeyhole
                size={14}
                className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
              />

              <span>
                No name or email is required to submit
                a struggle or question.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          THREE SAFE HAVEN PATHS
      ================================================= */}

      <section className="py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
              Find the support you need
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] sm:text-4xl dark:text-white">
              Three ways to enter the Safe Haven.
            </h2>
          </div>

          {/* MOBILE CAROUSEL / DESKTOP GRID */}

          <div
            className="
              -mx-4
              flex
              snap-x
              snap-mandatory
              gap-4
              overflow-x-auto
              px-4
              pb-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:-mx-6
              sm:px-6

              md:mx-0
              md:grid
              md:grid-cols-3
              md:overflow-visible
              md:px-0
              md:pb-0
            "
          >
            {/* SHARE STRUGGLES */}

            <a
              href="#share-struggle"
              className="group min-w-[86%] snap-start rounded-[22px] border border-[#07162E]/10 bg-white p-6 transition hover:-translate-y-1 hover:border-[#F59E0B]/40 sm:min-w-[65%] md:min-w-0 dark:border-white/10 dark:bg-[#0B1A2A]"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
                <MessageCircleQuestion
                  size={19}
                />
              </div>

              <span className="mt-8 block text-[8px] font-extrabold uppercase tracking-[0.17em] text-slate-400">
                01 · Guidance
              </span>

              <h3 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#07162E] dark:text-white">
                Share Struggles
              </h3>

              <p className="mt-4 text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                Ask a question or share a difficult
                season without attaching your name
                or email.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#D97706] dark:text-[#F59E0B]">
                Share privately
                <ArrowUpRight
                  size={13}
                />
              </span>
            </a>

            {/* PRAYER */}

            <Link
              href="/prayer"
              className="group min-w-[86%] snap-start rounded-[22px] border border-[#07162E]/10 bg-[#07162E] p-6 text-white transition hover:-translate-y-1 sm:min-w-[65%] md:min-w-0 dark:border-white/10 dark:bg-[#0E1628]"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-[#F59E0B]">
                <HeartHandshake
                  size={19}
                />
              </div>

              <span className="mt-8 block text-[8px] font-extrabold uppercase tracking-[0.17em] text-white/40">
                02 · Prayer
              </span>

              <h3 className="mt-2 font-serif text-3xl tracking-[-0.04em]">
                Pray for Me
              </h3>

              <p className="mt-4 text-[12px] leading-6 text-white/60">
                Share what you are trusting God for
                and let others stand with you in
                prayer.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#F59E0B]">
                Enter prayer space
                <ArrowUpRight
                  size={13}
                />
              </span>
            </Link>

            {/* SALVATION */}

            <Link
              href="/salvation"
              className="group min-w-[86%] snap-start rounded-[22px] border border-[#F59E0B]/40 bg-[#F59E0B] p-6 text-[#07162E] transition hover:-translate-y-1 sm:min-w-[65%] md:min-w-0"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#07162E]/10">
                <ShieldCheck
                  size={19}
                />
              </div>

              <span className="mt-8 block text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#07162E]/45">
                03 · New life
              </span>

              <h3 className="mt-2 font-serif text-3xl tracking-[-0.04em]">
                Give Your Life to Christ
              </h3>

              <p className="mt-4 text-[12px] leading-6 text-[#07162E]/65">
                Learn what salvation means and take
                a thoughtful first step in following
                Jesus.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-extrabold">
                Begin here
                <ArrowUpRight
                  size={13}
                />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================
          SHARE STRUGGLE
      ================================================= */}

      <section
        id="share-struggle"
        className="scroll-mt-28 border-y border-[#07162E]/10 bg-white/55 py-16 dark:border-white/10 dark:bg-[#0B1A2A]/35"
      >
        <div className="mx-auto grid max-w-[1220px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:px-8">
          <div className="lg:sticky lg:top-[110px]">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
              A quiet place to speak
            </p>

            <h2 className="mt-3 max-w-lg font-serif text-4xl leading-[0.98] tracking-[-0.045em] sm:text-5xl dark:text-white">
              Say what you&apos;ve
              been carrying.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              Share a struggle, question, doubt or
              difficult season. Your submission
              enters the guidance queue for review.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex gap-3">
                <LockKeyhole
                  size={15}
                  className="mt-1 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
                />

                <div>
                  <strong className="text-[11px] text-[#07162E] dark:text-white">
                    No identity required
                  </strong>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                    No name or email field is
                    required.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck
                  size={15}
                  className="mt-1 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
                />

                <div>
                  <strong className="text-[11px] text-[#07162E] dark:text-white">
                    Reviewed before publication
                  </strong>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                    Questions are handled through
                    the moderation workflow before
                    guidance is published.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ShareStruggleForm />
        </div>
      </section>

      {/* =================================================
          GUIDANCE LIBRARY
      ================================================= */}

      <section
        id="guidance-library"
        className="scroll-mt-28 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
              Shared questions. Thoughtful answers.
            </p>

            <h2 className="mt-2 font-serif text-4xl tracking-[-0.045em] sm:text-5xl dark:text-white">
              Guidance Library
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Explore questions others have carried
              and the biblical perspectives shared
              in response.
            </p>
          </div>

          <GuidanceLibrary
            answers={
              answers
            }
          />
        </div>
      </section>
    </main>
  );
}