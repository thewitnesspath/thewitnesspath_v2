import Image from "next/image";
import Link from "next/link";

import HeroCarousel from "@/components/home/HeroCarousel";

import {
  listTestimonies,
  wordOfTheWeek,
  type WordOfWeek,
} from "@/lib/content/index";
import WhatsAppSubscribe from "@/components/whatsapp/WhatsAppSubscribe";

import { supabase } from "@/lib/supabase/client";
import {
  getTestimonyImage,
  getBlogImage,
  wordOfTheWeekImage,
} from "@/lib/content-images";

type Testimony =
  Awaited<
    ReturnType<
      typeof listTestimonies
    >
  >[number];

type HomeBlogPost = {
  id: number | string;
  title: string | null;
  slug: string | null;
  category: string | null;
  author: string | null;
  content: string | null;
  created_at:
    | string
    | null;
};



function createExcerpt(
  text: string,
  limit = 180
) {
  const clean =
    text.trim();

  if (!clean) return "";

  if (
    clean.length <= limit
  ) {
    return clean;
  }

  return `${clean
    .slice(0, limit)
    .trimEnd()}…`;
}

function formatDate(
  value:
    | string
    | null
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

async function getLatestBlogPosts(): Promise<
  HomeBlogPost[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("BlogPosts")
    .select(
      `
        id,
        title,
        slug,
        category,
        author,
        content,
        created_at
      `
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(3);

  if (error) {
    console.error(
      "Homepage blog fetch failed:",
      error
    );

    return [];
  }

  return (
    data ?? []
  ) as HomeBlogPost[];
}

export default async function HomePage() {
  let testimonies:
    Testimony[] = [];

  let weekly:
    | WordOfWeek
    | null = null;

  let blogPosts:
    HomeBlogPost[] =
    [];

  try {
    [
      testimonies,
      weekly,
      blogPosts,
    ] =
      await Promise.all([
        listTestimonies(),
        wordOfTheWeek(),
        getLatestBlogPosts(),
      ]);
  } catch (
    error
  ) {
    console.error(
      "Homepage content failed:",
      error
    );
  }

  const featuredTestimonies =
    testimonies.slice(
      0,
      3
    );

  return (
    <main className="overflow-hidden bg-[#FFFDF8] text-[#0B1930] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* ===================================
          HERO
      =================================== */}

      <section className="px-3 pb-5 pt-[82px] sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[690px] w-full max-w-[1420px] overflow-hidden rounded-[26px] border border-[#0B1930]/10 bg-white shadow-[0_26px_90px_rgba(11,25,48,0.12)] dark:border-white/10 dark:bg-[#081626] dark:shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
          <HeroCarousel />

          {/* left readability treatment */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,248,0.99)_0%,rgba(255,253,248,0.96)_37%,rgba(255,253,248,0.56)_57%,rgba(255,253,248,0.02)_82%)] dark:bg-[linear-gradient(90deg,rgba(6,17,31,0.99)_0%,rgba(6,17,31,0.96)_38%,rgba(6,17,31,0.67)_61%,rgba(6,17,31,0.08)_88%)]" />

          <div className="relative z-10 flex min-h-[690px] flex-col justify-center px-6 py-16 sm:px-10 lg:w-[58%] lg:px-14 xl:px-16">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
              <span className="h-px w-7 bg-current" />

              Real people.
              A faithful God.
            </div>

            <h1 className="max-w-[780px] font-serif text-[clamp(3.2rem,6vw,6.7rem)] leading-[0.92] tracking-[-0.055em] text-[#07162E] dark:text-white">
              Testimonies
              <br />

              of{" "}
              <span className="text-[#E98208] dark:text-[#F59E0B]">
                Grace,
                Hope
              </span>
              <br />

              and Unshakable
              Faith.
            </h1>

            <p className="mt-7 max-w-[570px] text-[14px] leading-7 text-slate-600 sm:text-[16px] dark:text-slate-300">
              The Witness Path
              is a community
              of real people
              sharing how God
              is working in
              their lives.
              Honest stories.
              Lasting hope.
              A reminder that
              no one walks
              alone.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/testimonies"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#F59E0B] px-6 text-[13px] font-extrabold text-[#07162E] shadow-[0_12px_28px_rgba(245,158,11,0.25)] transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Read
                Testimonies

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/testimonies/share"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#0B1930]/20 bg-white/55 px-6 text-[13px] font-bold text-[#0B1930] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#F59E0B] dark:border-white/20 dark:bg-[#06111F]/35 dark:text-white dark:hover:border-[#F59E0B]"
              >
                <span className="flex size-6 items-center justify-center rounded-full border border-[#F59E0B] text-[10px] text-[#D97706] dark:text-[#F59E0B]">
                  ▶
                </span>

                Share Your
                Testimony
              </Link>
            </div>

            {/* no fake statistics */}
            <div className="mt-10 grid max-w-[610px] gap-5 border-t border-[#0B1930]/10 pt-6 sm:grid-cols-3 dark:border-white/10">
              <div>
                <span className="block text-lg text-[#F59E0B]">
                  ✦
                </span>

                <strong className="mt-1 block text-xs text-[#0B1930] dark:text-white">
                  Real Stories
                </strong>

                <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                  Shared by
                  everyday
                  people
                </span>
              </div>

              <div>
                <span className="block text-lg text-[#F59E0B]">
                  ♥
                </span>

                <strong className="mt-1 block text-xs text-[#0B1930] dark:text-white">
                  Shared With
                  Care
                </strong>

                <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                  Moderated
                  before
                  publishing
                </span>
              </div>

              <div>
                <span className="block text-lg text-[#F59E0B]">
                  ◉
                </span>

                <strong className="mt-1 block text-xs text-[#0B1930] dark:text-white">
                  Faith
                  Community
                </strong>

                <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                  Hope carried
                  forward
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================
          FEATURED TESTIMONIES
      =================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-7 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
                Real stories.
                Eternal
                impact.
              </p>

              <h2 className="mt-2 font-serif text-4xl tracking-[-0.045em] text-[#07162E] sm:text-5xl dark:text-white">
                Featured
                Testimonies
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Stories of
                God&apos;s
                faithfulness
                through real
                struggles,
                breakthroughs,
                waiting and
                restoration.
              </p>
            </div>

            <Link
              href="/testimonies"
              className="hidden shrink-0 items-center gap-3 rounded-full border border-[#F59E0B] px-5 py-2.5 text-[11px] font-bold text-[#0B1930] transition hover:bg-[#F59E0B] sm:inline-flex dark:text-white dark:hover:text-[#07162E]"
            >
              View All
              Testimonies
              <span>→</span>
            </Link>
          </div>

          {featuredTestimonies.length >
          0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {featuredTestimonies.map(
                (
                  testimony,
                ) => (
                  <article
                    key={
                      testimony.id
                    }
                    className="group overflow-hidden rounded-[18px] border border-[#0B1930]/10 bg-white shadow-[0_12px_35px_rgba(11,25,48,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,25,48,0.10)] dark:border-white/10 dark:bg-[#0B1A2A]"
                  >
                    <div className="relative h-[190px] overflow-hidden">
                      <Image
                        src={getTestimonyImage(
                          testimony.category
                        )}
                        alt={`${testimony.category || "Faith"} testimony`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/45 to-transparent" />

                      <span className="absolute bottom-4 left-4 rounded-full border border-[#F59E0B] bg-[#06111F]/70 px-3 py-1 text-[8px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur">
                        {testimony.category ||
                          "Faith"}
                      </span>
                    </div>

                    <Link
                      href={`/testimonies/${testimony.id}`}
                      className="block p-5"
                    >
                      <h3 className="font-serif text-[25px] leading-tight tracking-[-0.035em] text-[#07162E] transition group-hover:text-[#D97706] dark:text-white dark:group-hover:text-[#F59E0B]">
                        {testimony.title ||
                          "Untitled testimony"}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                        {createExcerpt(
                          testimony.content ||
                            "",
                          155
                        )}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-[#0B1930]/10 pt-4 dark:border-white/10">
                        <div>
                          <strong className="block text-[11px] text-[#07162E] dark:text-white">
                            {testimony.author ||
                              "Anonymous"}
                          </strong>

                          <span className="text-[9px] text-slate-400">
                            Witness
                            community
                          </span>
                        </div>

                        <span className="flex size-9 items-center justify-center rounded-full border border-[#0B1930]/15 text-sm transition group-hover:border-[#F59E0B] group-hover:text-[#D97706] dark:border-white/15 dark:group-hover:text-[#F59E0B]">
                          →
                        </span>
                      </div>
                    </Link>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#0B1930]/15 px-6 py-16 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
              Approved
              testimonies will
              appear here as
              they are shared
              with the
              community.
            </div>
          )}

          <Link
            href="/testimonies"
            className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#D97706] sm:hidden dark:text-[#F59E0B]"
          >
            View all
            testimonies →
          </Link>
        </div>
      </section>

      {/* ===================================
          WORD OF THE WEEK
      =================================== */}

      <section className="px-4 py-3 sm:px-6">
        <div className="relative mx-auto min-h-[330px] max-w-[1360px] overflow-hidden rounded-[22px] border border-[#0B1930]/10 dark:border-white/10">
          <Image
            src="/images/hero/word-of-the-week/word-of-the-week.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-white/80 dark:bg-[#06111F]/78" />

          <div className="relative z-10 grid min-h-[330px] items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:px-12">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
                Word of the
                Week
              </span>

              <h2 className="mt-3 max-w-sm font-serif text-4xl leading-[0.98] tracking-[-0.045em] text-[#07162E] sm:text-5xl dark:text-white">
                {weekly?.title ||
                  "A light for your journey"}
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
                Scripture,
                reflection and
                encouragement
                for the week
                ahead.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/60 bg-white/80 p-7 shadow-[0_20px_50px_rgba(11,25,48,0.12)] backdrop-blur-xl sm:p-9 dark:border-white/15 dark:bg-[#0B1A2A]/85">
              <div className="text-5xl leading-none text-[#F59E0B]">
                “
              </div>

              <p className="mt-1 font-serif text-xl leading-8 text-[#07162E] sm:text-2xl dark:text-white">
                {weekly?.content
                  ? createExcerpt(
                      weekly.content,
                      280
                    )
                  : "A weekly reflection for faith, encouragement and the journey ahead."}
              </p>

              <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#0B1930]/10 pt-5 dark:border-white/10">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {weekly?.author ||
                    "The Witness Team"}
                </span>

                <Link
                  href="/word-of-the-week"
                  className="flex size-10 items-center justify-center rounded-full border border-[#F59E0B] text-[#D97706] transition hover:bg-[#F59E0B] hover:text-[#07162E] dark:text-[#F59E0B]"
                  aria-label="Read Word of the Week"
                >
                  →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================
          LATEST BLOG
      =================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-7 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
                Insights.
                Encouragement.
                Real life.
              </p>

              <h2 className="mt-2 font-serif text-4xl tracking-[-0.045em] text-[#07162E] sm:text-5xl dark:text-white">
                Latest from the
                Blog
              </h2>
            </div>

            <Link
              href="/blog"
              className="hidden rounded-full border border-[#F59E0B] px-5 py-2.5 text-[11px] font-bold transition hover:bg-[#F59E0B] hover:text-[#07162E] sm:inline-flex"
            >
              View All
              Articles →
            </Link>
          </div>

          {blogPosts.length >
          0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {blogPosts.map(
                (
                  post,
                ) => {
                  const href =
                    post.slug
                      ? `/blog/${post.slug}`
                      : `/blog/${post.id}`;

                  return (
                    <Link
                      key={
                        post.id
                      }
                      href={
                        href
                      }
                      className="group overflow-hidden rounded-[18px] border border-[#0B1930]/10 bg-white shadow-[0_12px_30px_rgba(11,25,48,0.05)] transition hover:-translate-y-1 dark:border-white/10 dark:bg-[#0B1A2A]"
                    >
                      <div className="relative h-[180px] overflow-hidden">
                        <Image
                            src={getBlogImage(
                              post.category
                            )}
                            alt={`${post.category || "Teaching"} article`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          <span>
                            {formatDate(
                              post.created_at
                            )}
                          </span>

                          {post.category && (
                            <>
                              <span>
                                •
                              </span>

                              <span>
                                {
                                  post.category
                                }
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="mt-3 font-serif text-[24px] leading-[1.05] tracking-[-0.035em] text-[#07162E] transition group-hover:text-[#D97706] dark:text-white dark:group-hover:text-[#F59E0B]">
                          {post.title ||
                            "Untitled article"}
                        </h3>

                        <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-slate-600 dark:text-slate-400">
                          {createExcerpt(
                            post.content ||
                              "",
                            120
                          )}
                        </p>

                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {post.author ||
                              "The Witness Team"}
                          </span>

                          <span className="flex size-8 items-center justify-center rounded-full border border-[#0B1930]/15 transition group-hover:border-[#F59E0B] group-hover:text-[#D97706] dark:border-white/15 dark:group-hover:text-[#F59E0B]">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          ) : (
            <Link
              href="/blog"
              className="group block rounded-[22px] border border-[#0B1930]/10 bg-white p-8 transition hover:border-[#F59E0B]/60 dark:border-white/10 dark:bg-[#0B1A2A]"
            >
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#D97706] dark:text-[#F59E0B]">
                The Witness
                Blog
              </span>

              <h3 className="mt-4 max-w-2xl font-serif text-3xl tracking-[-0.04em] sm:text-4xl">
                Teachings,
                reflections
                and
                encouragement
                for everyday
                faith.
              </h3>

              <span className="mt-7 inline-flex text-xs font-bold text-[#D97706] dark:text-[#F59E0B]">
                Explore the
                blog →
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* ===================================
          DISTINCT TESTIMONY CTAs
      =================================== */}

      <section className="pb-16">
        <div className="mx-auto grid max-w-[1360px] gap-4 px-5 sm:px-7 lg:grid-cols-2 lg:px-10">
          <Link
            href="/testimonies"
            className="group flex min-h-[290px] flex-col justify-between rounded-[22px] bg-[#07162E] p-7 text-white transition hover:-translate-y-1 sm:p-9 dark:bg-[#0B1A2A] dark:ring-1 dark:ring-white/10"
          >
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
              <span>
                01
              </span>

              <span>
                Read
              </span>
            </div>

            <div>
              <h3 className="font-serif text-4xl tracking-[-0.045em]">
                Discover
                testimonies.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                Read real
                accounts of
                God&apos;s
                faithfulness
                and find
                courage for
                your own
                journey.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/15 pt-5 text-xs font-bold">
              <span>
                Explore
                stories
              </span>

              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/testimonies/share"
            className="group flex min-h-[290px] flex-col justify-between rounded-[22px] bg-[#F59E0B] p-7 text-[#07162E] transition hover:-translate-y-1 hover:bg-amber-400 sm:p-9"
          >
            <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#07162E]/55">
              <span>
                02
              </span>

              <span>
                Share
              </span>
            </div>

            <div>
              <h3 className="font-serif text-4xl tracking-[-0.045em]">
                Tell what God
                has done.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-6 text-[#07162E]/70">
                Your story
                could be the
                encouragement
                someone needs
                while they are
                still waiting.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#07162E]/15 pt-5 text-xs font-extrabold">
              <span>
                Share your
                testimony
              </span>

              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>

        {/* ===================================
            PRAYER
        =================================== */}

        <section className="px-4 pb-6 sm:px-6">
          <div className="relative mx-auto min-h-[330px] max-w-[1360px] overflow-hidden rounded-[22px]">
            <Image
              src="/images/hero/hero-3.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,22,46,0.96)_0%,rgba(7,22,46,0.88)_48%,rgba(7,22,46,0.68)_100%)]" />

            <div className="relative z-10 grid min-h-[330px] items-center gap-8 px-6 py-10 text-white sm:px-10 lg:grid-cols-[1fr_0.85fr] lg:px-12">
              <div className="max-w-xl">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#F59E0B]">
                  Prayer & Support
                </p>

                <h2 className="mt-3 font-serif text-4xl tracking-[-0.045em] sm:text-5xl">
                  You&apos;re Not Alone.
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">
                  No matter what
                  you&apos;re going
                  through, we believe in
                  the power of prayer.
                  Share a request or
                  stand with someone
                  else.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/prayer"
                  className="group rounded-[16px] border border-white/15 bg-[#06111F]/45 p-5 backdrop-blur-md transition hover:border-[#F59E0B]/60"
                >
                  <span className="text-xl text-[#F59E0B]">
                    ◫
                  </span>

                  <h3 className="mt-5 font-serif text-xl">
                    Submit a Prayer
                    Request
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-white/55">
                    Let our community
                    stand with you.
                  </p>

                  <span className="mt-5 inline-flex text-[10px] font-bold text-[#F59E0B]">
                    Send a Request →
                  </span>
                </Link>

                <Link
                  href="/prayer"
                  className="group rounded-[16px] border border-white/15 bg-[#06111F]/45 p-5 backdrop-blur-md transition hover:border-[#F59E0B]/60"
                >
                  <span className="text-xl text-[#F59E0B]">
                    ♡
                  </span>

                  <h3 className="mt-5 font-serif text-xl">
                    Pray for Others
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-white/55">
                    Lift up and
                    encourage someone
                    today.
                  </p>

                  <span className="mt-5 inline-flex text-[10px] font-bold text-[#F59E0B]">
                    View Requests →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================
            WHATSAPP TESTIMONY UPDATES
        =================================== */}

        <section className="mx-auto w-full max-w-[1380px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <WhatsAppSubscribe />
        </section>
      </main>
  );
}