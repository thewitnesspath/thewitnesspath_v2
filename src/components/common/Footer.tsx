import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";
import WhatsAppSubscribe from "@/components/newsletter/WhatsAppSubscribe";

/* =========================================================
   FOOTER LINKS
========================================================= */

const testimonyLinks = [
  {
    label: "Read Testimonies",
    href: "/testimonies",
  },
  {
    label: "Share Testimony",
    href: "/testimonies/share",
  },
];

const safeHavenLinks = [
  {
    label: "Share Struggles",
    href: "/guidance",
  },
  {
    label: "Pray for Me",
    href: "/prayer",
  },
  {
    label: "Give Your Life to Christ",
    href: "/salvation",
  },
];

const exploreLinks = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Vision & Mission",
    href: "/vision",
  },
  {
    label: "Support",
    href: "/support",
  },
  {
    label: "Sign in",
    href: "/auth/login",
  },
];

/* =========================================================
   X ICON
========================================================= */

function XIcon({
  size = 16,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#07162E]/10 bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:border-white/10 dark:bg-[#020617] dark:text-white">
      {/* =================================================
          TOP ACCENT
      ================================================= */}

      <div className="h-[2px] bg-[#F59E0B]" />

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="mx-auto w-full max-w-[1420px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 border-b border-[#07162E]/10 pb-12 sm:pb-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16 dark:border-white/10">
          {/* ===============================================
              BRAND
          =============================================== */}

          <div>
            <Link
              href="/"
              aria-label="The Witness Path home"
              className="inline-flex"
            >
              {/* 
                Use the dark logo here because the footer
                automatically switches according to theme.

                If your Logo2.png is the dark-on-light logo
                and Logo2b.png is the light-on-dark logo,
                this setup will work correctly.
              */}

              <div className="relative h-[42px] w-[190px]">
                <Image
                  src="/TheWitnessPathLogo2b.jpg"
                  alt="The Witness Path"
                  fill
                  sizes="190px"
                  className="object-contain object-left dark:hidden"
                />

                <Image
                  src="/witness-icon.jpg"
                  alt="The Witness Path"
                  fill
                  sizes="190px"
                  className="hidden object-contain object-left dark:block"
                />
              </div>
            </Link>

            <p className="mt-7 text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D97706] dark:text-[#F59E0B]">
              Faith · Testimony · Hope · Restoration
            </p>

            <h2 className="mt-4 max-w-[570px] font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              Stories remembered.
              <br />

              <span className="text-[#D97706] dark:text-[#F59E0B]">
                Faith strengthened.
              </span>
            </h2>

            <p className="mt-6 max-w-[520px] text-[13px] leading-7 text-slate-500 dark:text-slate-400">
              A place to preserve testimonies of
              God&apos;s faithfulness and allow
              those stories to become hope,
              strength and evidence for someone
              else&apos;s journey.
            </p>

            {/* =============================================
                SOCIALS
            ============================================= */}

            <div className="mt-7">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
                Follow the journey
              </span>

              <div className="mt-3 flex items-center gap-2">
                {/* INSTAGRAM */}

                <a
                  href="https://instagram.com/the_witnesspath"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="The Witness Path on Instagram"
                  className="flex size-10 items-center justify-center rounded-full border border-[#07162E]/10 bg-white text-slate-500 transition hover:border-[#F59E0B] hover:text-[#D97706] dark:border-white/10 dark:bg-[#0B1A2A] dark:text-slate-400 dark:hover:border-[#F59E0B] dark:hover:text-[#F59E0B]"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x={3} y={3} width={18} height={18} rx={5} />
                    <circle cx={12} cy={12} r={4} />
                    <circle cx={17.5} cy={6.5} r={0.5} fill="currentColor" />
                  </svg>
                </a>

                {/* X */}

                <a
                  href="https://x.com/the_witnesspath"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="The Witness Path on X"
                  className="flex size-10 items-center justify-center rounded-full border border-[#07162E]/10 bg-white text-slate-500 transition hover:border-[#F59E0B] hover:text-[#D97706] dark:border-white/10 dark:bg-[#0B1A2A] dark:text-slate-400 dark:hover:border-[#F59E0B] dark:hover:text-[#F59E0B]"
                >
                  <XIcon
                    size={14}
                  />
                </a>

                <a
                  href="https://instagram.com/the_witnesspath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-[10px] font-semibold text-slate-400 transition hover:text-[#D97706] dark:text-slate-500 dark:hover:text-[#F59E0B]"
                >
                  @the_witnesspath
                </a>
              </div>
            </div>
          </div>

          {/* ===============================================
              NAVIGATION
          =============================================== */}

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {/* TESTIMONIES */}

            <div>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#D97706] dark:text-[#F59E0B]">
                Testimonies
              </span>

              <div className="mt-5 grid gap-3.5">
                {testimonyLinks.map(
                  (link) => (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className="group flex w-fit items-center gap-1.5 text-[12px] font-medium text-slate-500 transition hover:text-[#07162E] dark:text-slate-400 dark:hover:text-white"
                    >
                      {
                        link.label
                      }

                      <ArrowUpRight
                        size={11}
                        className="opacity-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* SAFE HAVEN */}

            <div>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#D97706] dark:text-[#F59E0B]">
                Safe Haven
              </span>

              <div className="mt-5 grid gap-3.5">
                {safeHavenLinks.map(
                  (link) => (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className="group flex w-fit items-center gap-1.5 text-[12px] font-medium leading-5 text-slate-500 transition hover:text-[#07162E] dark:text-slate-400 dark:hover:text-white"
                    >
                      {
                        link.label
                      }

                      <ArrowUpRight
                        size={11}
                        className="shrink-0 opacity-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* EXPLORE */}

            <div>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#D97706] dark:text-[#F59E0B]">
                Explore
              </span>

              <div className="mt-5 grid gap-3.5">
                {exploreLinks.map(
                  (link) => (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className={`group flex w-fit items-center gap-1.5 text-[12px] font-medium transition ${
                        link.href ===
                        "/support"
                          ? "font-bold text-[#D97706] dark:text-[#F59E0B]"
                          : "text-slate-500 hover:text-[#07162E] dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {
                        link.label
                      }

                      <ArrowUpRight
                        size={11}
                        className="opacity-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            WHATSAPP TESTIMONY NEWSLETTER
            ================================================= */}

<div className="border-b border-[#07162E]/10 py-7 dark:border-white/10">
  <WhatsAppSubscribe />
</div>

<div className="border-b border-[#07162E]/10 py-7 dark:border-white/10"></div>

        {/* =================================================
            SUPPORT STRIP
        ================================================= */}

        <div className="border-b border-[#07162E]/10 py-7 dark:border-white/10">
          <div className="flex flex-col gap-5 rounded-[18px] bg-[#07162E] px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border dark:border-white/10 dark:bg-[#0B1A2A]">
            <div>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#F59E0B]">
                Support the mission
              </span>

              <p className="mt-1 font-serif text-xl tracking-[-0.025em] sm:text-2xl">
                Help keep the path open for
                others.
              </p>
            </div>

            <Link
              href="/support"
              className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-[10px] font-extrabold text-[#07162E] transition hover:bg-amber-400"
            >
              Support The Witness Path

              <ArrowUpRight
                size={13}
                className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="flex flex-col gap-5 pt-7 text-[9px] text-slate-400 sm:flex-row sm:items-center sm:justify-between dark:text-slate-600">
          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            The Witness Path. All
            rights reserved.
          </p>

          <p className="font-medium tracking-[0.03em]">
            Witness His grace.
            Strengthen your faith.
          </p>
        </div>
      </div>
    </footer>
  );
}