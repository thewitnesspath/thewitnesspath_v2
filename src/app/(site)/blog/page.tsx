import Image from "next/image";
import type { ReactElement } from "react";

import BlogList from "@/components/blog/BlogList";

import {
  listBlogPosts,
} from "@/lib/content/index";

interface BlogMetadata {
  title: string;
  description: string;
}

type BlogPosts = NonNullable<Awaited<ReturnType<typeof listBlogPosts>>>;

export const metadata: BlogMetadata = {
  title: "The Witness Blog | The Witness Path",
  description:
    "Biblical teaching, reflections and encouragement for everyday faith.",
};

export default async function BlogPage(): Promise<ReactElement> {
  let posts: BlogPosts = [];

  try {
    posts =
      await listBlogPosts();
  } catch {
    posts = [];
  }

  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="px-4 pb-5 pt-[96px] sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[420px] max-w-[1380px] overflow-hidden rounded-[24px] border border-[#07162E]/10 bg-white dark:border-white/10 dark:bg-[#0B1A2A]">
          {/* IMAGE */}

          <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
            <Image
              src="/images/hero/hero-2.jpg"
              alt=""
              fill
              priority
              sizes="52vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[#07162E]/15 dark:bg-[#020617]/30" />
          </div>

          {/* DESKTOP FADE */}

          <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#FFFDF8_0%,#FFFDF8_44%,rgba(255,253,248,0.95)_56%,rgba(255,253,248,0.08)_88%)] lg:block dark:bg-[linear-gradient(90deg,#0B1A2A_0%,#0B1A2A_44%,rgba(11,26,42,0.96)_58%,rgba(11,26,42,0.10)_90%)]" />

          {/* MOBILE BACKGROUND */}

          <div className="absolute inset-0 lg:hidden">
            <Image
              src="/images/hero/hero-2.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[#FFFDF8]/94 dark:bg-[#06111F]/91" />
          </div>

          {/* CONTENT */}

          <div className="relative z-10 flex min-h-[420px] max-w-[760px] flex-col justify-center px-6 py-14 sm:px-10 lg:px-14">
            <div className="flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
              <span className="h-px w-7 bg-current" />

              The Witness Blog
            </div>

            <h1 className="mt-4 max-w-[720px] font-serif text-[clamp(3rem,6vw,5.8rem)] leading-[0.94] tracking-[-0.055em] text-[#07162E] dark:text-white">
              Truth for
              <br />

              <span className="text-[#E98208] dark:text-[#F59E0B]">
                everyday faith.
              </span>
            </h1>

            <p className="mt-6 max-w-[590px] text-sm leading-7 text-slate-600 sm:text-[15px] dark:text-slate-300">
              Biblical teaching, reflection and
              encouragement for people learning to
              follow God faithfully through real
              seasons of life.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <span>
                Teaching
              </span>

              <span className="size-1 rounded-full bg-[#F59E0B]" />

              <span>
                Faith
              </span>

              <span className="size-1 rounded-full bg-[#F59E0B]" />

              <span>
                Grace
              </span>

              <span className="size-1 rounded-full bg-[#F59E0B]" />

              <span>
                Kingdom
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          BLOG LIBRARY
      =================================================== */}

      <section className="mx-auto w-full max-w-[1380px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
              Read. Reflect. Grow.
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#07162E] sm:text-4xl dark:text-white">
              The Article Library
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Search teachings, explore a category,
            or return to articles you&apos;ve saved
            for later.
          </p>
        </div>

        <BlogList posts={posts} />
      </section>
    </main>
  );
}