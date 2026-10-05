import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Flame,
  HeartHandshake,
  Quote,
  Sparkles,
} from "lucide-react";

import {
  supabase,
} from "@/lib/supabase/client";

/* =========================================================
   METADATA
========================================================= */

export const metadata = {
  title:
    "Vision & Mission | The Witness Path",
  description:
    "Why The Witness Path exists: to preserve and amplify testimonies of God's mighty acts, strengthen faith and point lives to Christ.",
};

/* =========================================================
   TYPES
========================================================= */

type VisionMissionContent = {
  id: number;
  vision: string | null;
  mission: string | null;
  updated_at: string | null;
};

/* =========================================================
   ORIGINAL CONTENT FALLBACKS
========================================================= */

const defaultVision =
  "To build an enduring, global repository of God’s mighty acts—so that no weary heart suffers in darkness, doubt, or spiritual isolation, and everyone may see that God still works miracles today.";

const defaultMission =
  "To provide a seamless digital platform where believers record, preserve, and amplify real testimonies of God’s intervention; turning individual victories into active catalysts for collective faith and salvation.";

/* =========================================================
   CORE PILLARS
========================================================= */

const pillars = [
  {
    number: "01",
    title:
      "No One Should Suffer in Silence",
    text:
      "Across the world, countless individuals carry heavy burdens, trapped in despair simply because they do not know that God is attentive to the deepest desires of their hearts. Without knowledge, hope dies. Without light, people lose the strength to continue.",
    scripture:
      "Come and hear, all ye that fear God, and I will declare what he hath done for my soul.",
    reference:
      "Psalm 66:16",
    icon: HeartHandshake,
  },

  {
    number: "02",
    title:
      "Sustained by Spoken Truth When Experience Delays",
    text:
      "Even when believers know that God is able, delay in personal manifestation can cause conviction to wane. The Witness Path gives voice to living testimonies that renew boldness and sustain belief while people wait on God.",
    scripture:
      "I believed, and therefore have I spoken; we also believe, and therefore speak.",
    reference:
      "2 Corinthians 4:13",
    icon: Flame,
  },

  {
    number: "03",
    title:
      "Your Testimony Is Someone Else’s Breakthrough",
    text:
      "Faith becomes reachable when we see God’s hand at work in real time. Testimonies bridge the gap between promise and tangible reality, reminding another person that what God has done before can become fuel for their own faith.",
    scripture:
      "Go home to your friends, and tell them what great things the Lord has done for you.",
    reference:
      "Mark 5:19",
    icon: Sparkles,
  },
];

/* =========================================================
   DATA
========================================================= */

async function getVisionMission(): Promise<VisionMissionContent | null> {
  try {
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "VisionMissionContent"
        )
        .select(
          `
            id,
            vision,
            mission,
            updated_at
          `
        )
        .eq(
          "id",
          1
        )
        .maybeSingle();

    if (error) {
      console.error(
        "Vision and mission fetch failed:",
        error
      );

      return null;
    }

    return data as VisionMissionContent | null;
  } catch (
    error
  ) {
    console.error(
      "Vision and mission load failed:",
      error
    );

    return null;
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function VisionPage() {
  const content =
    await getVisionMission();

  const vision =
    content?.vision?.trim() ||
    defaultVision;

  const mission =
    content?.mission?.trim() ||
    defaultMission;

  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="px-3 pb-5 pt-[94px] sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[640px] max-w-[1420px] overflow-hidden rounded-[26px] border border-[#07162E]/10 bg-[#07162E] dark:border-white/10">
          <Image
            src="/images/hero/hero-2.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,27,0.97)_0%,rgba(4,14,27,0.88)_48%,rgba(4,14,27,0.45)_80%,rgba(4,14,27,0.25)_100%)]" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/60 via-transparent to-[#06111F]/10" />

          <div className="relative z-10 flex min-h-[640px] max-w-[900px] flex-col justify-end px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#F59E0B]">
              <span className="h-px w-7 bg-current" />

              Vision & Mission
            </div>

            <h1 className="mt-5 font-serif text-[clamp(3.8rem,7.3vw,7.8rem)] leading-[0.88] tracking-[-0.065em]">
              Why we build.
              <br />

              <span className="text-[#F59E0B]">
                Why we testify.
              </span>
            </h1>

            <p className="mt-7 max-w-[570px] text-sm leading-7 text-white/65 sm:text-[16px]">
              The Witness Path exists to preserve
              what God has done, place hope within
              reach and turn individual testimonies
              into fuel for collective faith.
            </p>

            <a
              href="#vision"
              className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 text-[10px] font-bold text-white backdrop-blur-md transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
            >
              Discover the vision

              <ArrowDown
                size={14}
              />
            </a>
          </div>
        </div>
      </section>

      {/* =================================================
          VISION
      ================================================= */}

      <section
        id="vision"
        className="scroll-mt-28 py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.4fr_1.6fr] lg:gap-16">
            {/* LABEL */}

            <div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl text-[#F59E0B]">
                  01
                </span>

                <span className="h-px flex-1 bg-[#07162E]/10 dark:bg-white/10" />
              </div>

              <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
                Our Vision
              </p>
            </div>

            {/* CONTENT */}

            <div>
              <h2 className="max-w-[850px] font-serif text-[clamp(2.8rem,5vw,5.4rem)] leading-[0.94] tracking-[-0.055em]">
                Making Faith
                <br />

                <span className="text-[#D97706] dark:text-[#F59E0B]">
                  Visible and
                  Inescapable.
                </span>
              </h2>

              <p className="mt-8 max-w-[760px] text-[15px] leading-8 text-slate-600 sm:text-[17px] sm:leading-9 dark:text-slate-300">
                {vision}
              </p>

              {/* SCRIPTURE */}

              <div className="mt-10 max-w-[760px] border-l-2 border-[#F59E0B] pl-5 sm:pl-7">
                <Quote
                  size={18}
                  className="text-[#F59E0B]"
                />

                <blockquote className="mt-3 font-serif text-xl italic leading-8 text-[#26354A] sm:text-2xl dark:text-slate-200">
                  One generation shall praise Your
                  works to another, and shall
                  declare Your mighty acts.
                </blockquote>

                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Psalm 145:4
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          VISUAL DIVIDER
      ================================================= */}

      <section className="px-3 sm:px-5 lg:px-7">
        <div className="relative mx-auto h-[330px] max-w-[1420px] overflow-hidden rounded-[24px] sm:h-[420px]">
          <Image
            src="/images/testimonies/categories/breakthrough.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#06111F]/45" />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06111F] to-transparent px-6 pb-8 pt-24 text-white sm:px-10 sm:pb-10">
            <p className="max-w-xl font-serif text-2xl leading-tight tracking-[-0.035em] sm:text-3xl">
              A testimony should never end with the
              person who experienced it.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          MISSION
      ================================================= */}

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.4fr_1.6fr] lg:gap-16">
            {/* LABEL */}

            <div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl text-[#F59E0B]">
                  02
                </span>

                <span className="h-px flex-1 bg-[#07162E]/10 dark:bg-white/10" />
              </div>

              <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
                Our Mission
              </p>
            </div>

            {/* CONTENT */}

            <div>
              <h2 className="max-w-[900px] font-serif text-[clamp(2.8rem,5vw,5.4rem)] leading-[0.94] tracking-[-0.055em]">
                Amplifying
                Breakthroughs
                <br />

                <span className="text-[#D97706] dark:text-[#F59E0B]">
                  to Refuel Believers.
                </span>
              </h2>

              <p className="mt-8 max-w-[760px] text-[15px] leading-8 text-slate-600 sm:text-[17px] sm:leading-9 dark:text-slate-300">
                {mission}
              </p>

              <div className="mt-10 max-w-[760px] border-l-2 border-[#F59E0B] pl-5 sm:pl-7">
                <Quote
                  size={18}
                  className="text-[#F59E0B]"
                />

                <blockquote className="mt-3 font-serif text-xl italic leading-8 text-[#26354A] sm:text-2xl dark:text-slate-200">
                  And they overcame him by the
                  blood of the Lamb and by the word
                  of their testimony.
                </blockquote>

                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Revelation 12:11
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CORE PILLARS
      ================================================= */}

      <section className="border-y border-[#07162E]/10 bg-white/55 py-16 dark:border-white/10 dark:bg-[#0B1A2A]/35 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#D97706] dark:text-[#F59E0B]">
              What we stand on
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              Core Pillars of
              <br />
              The Witness Path.
            </h2>
          </div>

          {/* MOBILE CAROUSEL / DESKTOP GRID */}

          <div
            className="
              -mx-4
              mt-10
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

              lg:mx-0
              lg:grid
              lg:grid-cols-3
              lg:overflow-visible
              lg:px-0
              lg:pb-0
            "
          >
            {pillars.map(
              ({
                number,
                title,
                text,
                scripture,
                reference,
                icon: Icon,
              }) => (
                <article
                  key={number}
                  className="flex min-w-[86%] snap-start flex-col rounded-[22px] border border-[#07162E]/10 bg-white p-6 sm:min-w-[62%] lg:min-w-0 dark:border-white/10 dark:bg-[#0B1A2A]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
                      <Icon
                        size={18}
                      />
                    </div>

                    <span className="font-serif text-xl text-slate-300 dark:text-slate-700">
                      {number}
                    </span>
                  </div>

                  <h3 className="mt-8 font-serif text-[28px] leading-[1.05] tracking-[-0.045em]">
                    {title}
                  </h3>

                  <p className="mt-5 text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                    {text}
                  </p>

                  <div className="mt-auto pt-8">
                    <div className="border-t border-[#07162E]/10 pt-5 dark:border-white/10">
                      <BookOpen
                        size={13}
                        className="text-[#D97706] dark:text-[#F59E0B]"
                      />

                      <p className="mt-3 font-serif text-[13px] italic leading-6 text-slate-600 dark:text-slate-300">
                        “{scripture}”
                      </p>

                      <span className="mt-3 block text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        {reference}
                      </span>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          HOW THE PATH MOVES
      ================================================= */}

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
                From one life to another
              </span>

              <h2 className="mt-3 max-w-lg font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                A witness becomes
                a pathway to hope.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 dark:text-slate-400">
                The work is simple in principle:
                remember what God has done, preserve
                it faithfully, and make it visible
                to the person who needs hope.
              </p>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#07162E]/10 bg-white dark:border-white/10 dark:bg-[#0B1A2A]">
              {[
                {
                  number:
                    "01",
                  title:
                    "God acts",
                  text:
                    "A life encounters His grace, provision, healing, restoration or intervention.",
                },
                {
                  number:
                    "02",
                  title:
                    "Someone testifies",
                  text:
                    "What happened is recorded instead of being allowed to disappear with time.",
                },
                {
                  number:
                    "03",
                  title:
                    "Another person sees",
                  text:
                    "A weary heart encounters evidence that God is still at work.",
                },
                {
                  number:
                    "04",
                  title:
                    "Faith rises again",
                  text:
                    "One person's witness becomes fuel for another person's journey.",
                },
              ].map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.number
                    }
                    className={`grid grid-cols-[48px_1fr] gap-4 p-5 sm:grid-cols-[60px_1fr] sm:p-6 ${
                      index !==
                      3
                        ? "border-b border-[#07162E]/10 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <span className="font-serif text-lg text-[#D97706] dark:text-[#F59E0B]">
                      {
                        item.number
                      }
                    </span>

                    <div>
                      <h3 className="font-serif text-xl tracking-[-0.03em] sm:text-2xl">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                        {
                          item.text
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section className="pb-20">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[26px] bg-[#07162E] text-white dark:border dark:border-white/10 dark:bg-[#020617]">
            <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
              <Image
                src="/images/testimonies/categories/faith.jpg"
                alt=""
                fill
                sizes="48vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#07162E] via-[#07162E]/45 to-transparent dark:from-[#020617]" />
            </div>

            <div className="relative z-10 max-w-[700px] p-7 sm:p-10 lg:p-12">
              <Sparkles
                size={19}
                className="text-[#F59E0B]"
              />

              <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.21em] text-[#F59E0B]">
                Become part of the witness
              </span>

              <h2 className="mt-3 font-serif text-4xl leading-[0.96] tracking-[-0.05em] sm:text-5xl">
                What God has done
                in your life may be
                the hope someone
                else is waiting for.
              </h2>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/testimonies/share"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-[10px] font-extrabold text-[#07162E] transition hover:bg-amber-400"
                >
                  Share Your Testimony

                  <ArrowUpRight
                    size={13}
                  />
                </Link>

                <Link
                  href="/testimonies"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 text-[10px] font-bold transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
                >
                  Read Testimonies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}