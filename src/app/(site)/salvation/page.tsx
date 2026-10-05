import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowDown,
  BookOpen,
  Church,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import SalvationDecisionCard from "@/components/salvation/SalvationDecisionCard";

export const metadata = {
  title:
    "Give Your Life to Christ | The Witness Path",
  description:
    "Understand salvation, surrender your life to Jesus Christ, and take your first steps in faith.",
};

const nextSteps = [
  {
    number: "01",
    title: "Talk to God Daily",
    description:
      "Prayer is simply talking to your Heavenly Father. Share your thoughts, joys and struggles with Him every day.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Read the Bible",
    description:
      "Start with the Gospel of John in the New Testament. God's Word will help you know Christ and grow in faith.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Find Fellowship",
    description:
      "Find a Bible-believing, Christ-centered church where you can worship, learn and grow with other believers.",
    icon: Church,
  },
];

export default function SalvationPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="px-3 pb-5 pt-[94px] sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[650px] max-w-[1420px] overflow-hidden rounded-[26px] border border-[#07162E]/10 bg-[#07162E] dark:border-white/10">
          <Image
            src="/images/testimonies/categories/faith.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,27,0.97)_0%,rgba(4,14,27,0.88)_44%,rgba(4,14,27,0.45)_78%,rgba(4,14,27,0.22)_100%)]" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/55 via-transparent to-[#06111F]/15" />

          <div className="relative z-10 flex min-h-[650px] max-w-[830px] flex-col justify-between px-6 py-9 text-white sm:px-10 sm:py-11 lg:px-14">
            <Link
              href="/guidance"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#06111F]/30 px-4 py-2.5 text-[10px] font-bold text-white/75 backdrop-blur-md transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
            >
              <ArrowLeft
                size={13}
              />

              Safe Haven
            </Link>

            <div>
              <div className="flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#F59E0B]">
                <span className="h-px w-7 bg-current" />

                The Greatest Breakthrough
              </div>

              <h1 className="mt-5 font-serif text-[clamp(3.7rem,7vw,7.5rem)] leading-[0.89] tracking-[-0.065em]">
                A new life
                <br />

                can begin
                <br />

                <span className="text-[#F59E0B]">
                  here.
                </span>
              </h1>

              <p className="mt-7 max-w-[590px] text-sm leading-7 text-white/70 sm:text-[16px]">
                Your past does not define your
                future. God&apos;s grace is
                available to you, and salvation
                begins with Jesus Christ.
              </p>

              <a
                href="#understand"
                className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-[11px] font-extrabold text-[#07162E] transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Understand Salvation

                <ArrowDown
                  size={14}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          INTRO
      ================================================= */}

      <section
        id="understand"
        className="scroll-mt-28 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            {/* LEFT */}

            <div className="lg:sticky lg:top-[110px]">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
                Start here
              </span>

              <h2 className="mt-3 max-w-md font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                What does it
                mean to give
                your life to
                Christ?
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
                Christianity does not begin with
                becoming perfect. It begins with
                receiving what Jesus has already
                done for you.
              </p>
            </div>

            {/* RIGHT */}

            <div className="space-y-4">
              {/* 01 */}

              <div className="rounded-[22px] border border-[#07162E]/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#0B1A2A]">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#D97706] dark:text-[#F59E0B]">
                    01
                  </span>

                  <div>
                    <h3 className="font-serif text-2xl tracking-[-0.035em] sm:text-3xl">
                      We all need grace.
                    </h3>

                    <p className="mt-4 text-[13px] leading-7 text-slate-600 dark:text-slate-300">
                      The Bible teaches that all
                      have sinned and fallen short
                      of God&apos;s glory. Sin
                      separates humanity from God.
                    </p>

                    <span className="mt-4 inline-flex rounded-full bg-[#07162E]/5 px-3 py-1.5 text-[9px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                      Romans 3:23
                    </span>
                  </div>
                </div>
              </div>

              {/* 02 */}

              <div className="rounded-[22px] border border-[#07162E]/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#0B1A2A]">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#D97706] dark:text-[#F59E0B]">
                    02
                  </span>

                  <div>
                    <h3 className="font-serif text-2xl tracking-[-0.035em] sm:text-3xl">
                      God came toward us in love.
                    </h3>

                    <p className="mt-4 text-[13px] leading-7 text-slate-600 dark:text-slate-300">
                      God demonstrated His love
                      toward us while we were still
                      sinners: Christ died for us.
                      You do not have to earn your
                      way back to God.
                    </p>

                    <span className="mt-4 inline-flex rounded-full bg-[#07162E]/5 px-3 py-1.5 text-[9px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                      Romans 5:8
                    </span>
                  </div>
                </div>
              </div>

              {/* 03 */}

              <div className="rounded-[22px] border border-[#F59E0B]/35 bg-[#F59E0B]/[0.07] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#D97706] dark:text-[#F59E0B]">
                    03
                  </span>

                  <div>
                    <h3 className="font-serif text-2xl tracking-[-0.035em] sm:text-3xl">
                      Salvation is received by
                      faith.
                    </h3>

                    <p className="mt-4 text-[13px] leading-7 text-slate-600 dark:text-slate-300">
                      Romans 10:9 teaches that
                      salvation involves confessing
                      Jesus as Lord and believing in
                      your heart that God raised Him
                      from the dead.
                    </p>

                    <span className="mt-4 inline-flex rounded-full bg-[#F59E0B]/15 px-3 py-1.5 text-[9px] font-bold text-[#D97706] dark:text-[#F59E0B]">
                      Romans 10:9
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          THE INVITATION
      ================================================= */}

      <section className="border-y border-[#07162E]/10 bg-[#07162E] py-16 text-white dark:border-white/10 dark:bg-[#020617] sm:py-20">
        <div className="mx-auto max-w-[950px] px-4 text-center sm:px-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]">
            <Heart
              size={18}
            />
          </div>

          <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#F59E0B]">
            The invitation
          </span>

          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl leading-[0.97] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            You can surrender
            your life to Jesus
            today.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/60">
            A prayer does not save because of
            perfect wording. It is an expression
            of genuine faith, repentance and
            surrender to Jesus Christ.
          </p>
        </div>
      </section>

      {/* =================================================
          PRAYER OF SURRENDER
      ================================================= */}

      <section
        id="prayer-of-surrender"
        className="py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[960px] px-4 sm:px-6">
          <div className="rounded-[26px] border border-[#07162E]/10 bg-white p-6 shadow-[0_22px_70px_rgba(7,22,46,0.06)] sm:p-10 lg:p-12 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
            <div className="text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
                A simple prayer of surrender
              </span>

              <h2 className="mt-3 font-serif text-3xl tracking-[-0.045em] sm:text-4xl">
                Pray from your heart.
              </h2>
            </div>

            <blockquote className="mx-auto mt-8 max-w-[760px] border-l-2 border-[#F59E0B] bg-[#FFFDF8] px-5 py-6 font-serif text-[19px] leading-9 text-[#26354A] sm:px-8 sm:py-8 sm:text-[22px] sm:leading-10 dark:bg-[#06111F] dark:text-slate-200">
              Lord Jesus, I come to You today. I
              acknowledge that I am a sinner and I
              need Your forgiveness. I believe You
              died on the cross for my sins and
              rose again on the third day. Today,
              I open my heart and invite You to be
              my Lord and personal Savior. Take
              control of my life, wash me clean,
              and write my name in the Book of
              Life. Thank You, Jesus, for saving
              me. Amen.
            </blockquote>

            <p className="mx-auto mt-7 max-w-xl text-center text-[11px] leading-6 text-slate-500 dark:text-slate-400">
              If those words express the decision
              of your heart, continue below. We
              would love to help you take your
              first steps.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          DECISION
      ================================================= */}

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-[960px] px-4 sm:px-6">
          <SalvationDecisionCard />
        </div>
      </section>

      {/* =================================================
          WHAT NEXT
      ================================================= */}

      <section
        id="what-next"
        className="border-y border-[#07162E]/10 bg-white/55 py-16 dark:border-white/10 dark:bg-[#0B1A2A]/35 sm:py-20"
      >
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
              Your new walk
            </span>

            <h2 className="mt-3 font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              What comes next?
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Following Jesus is not only a moment.
              It is the beginning of a relationship
              and a new way of life.
            </p>
          </div>

          {/* MOBILE CAROUSEL / DESKTOP GRID */}

          <div
            className="
              -mx-4
              mt-9
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
            {nextSteps.map(
              ({
                number,
                title,
                description,
                icon: Icon,
              }) => (
                <article
                  key={number}
                  className="min-w-[86%] snap-start rounded-[22px] border border-[#07162E]/10 bg-white p-6 sm:min-w-[65%] md:min-w-0 dark:border-white/10 dark:bg-[#0B1A2A]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
                      <Icon
                        size={18}
                      />
                    </div>

                    <span className="font-serif text-lg text-slate-300 dark:text-slate-700">
                      {number}
                    </span>
                  </div>

                  <h3 className="mt-7 font-serif text-[27px] leading-[1.05] tracking-[-0.04em]">
                    {title}
                  </h3>

                  <p className="mt-4 text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          KEEP WALKING
      ================================================= */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[26px] bg-[#07162E] text-white dark:border dark:border-white/10 dark:bg-[#0E1628]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <Sparkles
                  size={20}
                  className="text-[#F59E0B]"
                />

                <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#F59E0B]">
                  Keep walking
                </span>

                <h2 className="mt-3 max-w-lg font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                  You don&apos;t have to figure
                  everything out today.
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-white/60">
                  Ask questions. Pray. Read. Find
                  believers who will walk with you.
                  Growth happens one faithful step
                  at a time.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/guidance"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F59E0B] px-5 text-[10px] font-extrabold text-[#07162E]"
                  >
                    Ask a Question
                  </Link>

                  <Link
                    href="/prayer"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-[10px] font-bold text-white"
                  >
                    Request Prayer
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[300px] lg:min-h-full">
                <Image
                  src="/images/testimonies/categories/faith.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#07162E] via-[#07162E]/20 to-transparent lg:block" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}