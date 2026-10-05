import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  Archive,
  CreditCard,
  Globe2,
  Heart,
  LockKeyhole,
  Server,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title:
    "Support the Mission | The Witness Path",
  description:
    "Help keep The Witness Path open and sustainable for stories of faith, hope and restoration.",
};

const PAYSTACK_URL =
  "https://paystack.shop/pay/thewitnesspath";

const FLUTTERWAVE_URL =
  "https://flutterwave.com/donate/aqaq2ydfsmsv";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="px-3 pb-5 pt-[94px] sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[620px] max-w-[1420px] overflow-hidden rounded-[26px] border border-[#07162E]/10 bg-[#07162E] dark:border-white/10">
          <Image
            src="/images/hero/hero-1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,27,0.98)_0%,rgba(4,14,27,0.89)_47%,rgba(4,14,27,0.52)_76%,rgba(4,14,27,0.25)_100%)]" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/60 via-transparent to-[#06111F]/10" />

          <div className="relative z-10 flex min-h-[620px] max-w-[850px] flex-col justify-between px-6 py-9 text-white sm:px-10 sm:py-11 lg:px-14">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#06111F]/30 px-4 py-2.5 text-[10px] font-bold text-white/75 backdrop-blur-md transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
            >
              <ArrowLeft
                size={13}
              />

              Back Home
            </Link>

            <div>
              <div className="flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#F59E0B]">
                <span className="h-px w-7 bg-current" />

                Support the Mission
              </div>

              <h1 className="mt-5 font-serif text-[clamp(3.8rem,7.2vw,7.6rem)] leading-[0.89] tracking-[-0.065em]">
                Help us keep
                <br />

                <span className="text-[#F59E0B]">
                  the path open.
                </span>
              </h1>

              <p className="mt-7 max-w-[590px] text-sm leading-7 text-white/68 sm:text-[16px]">
                Help sustain a space where stories
                of faith, hope and restoration can
                be preserved and made available to
                the people who need them.
              </p>

              <a
                href="#give"
                className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-[11px] font-extrabold text-[#07162E] transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Support The Witness Path

                <ArrowUpRight
                  size={14}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          WHY SUPPORT
      ================================================= */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
                Why support matters
              </span>

              <h2 className="mt-3 max-w-md font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Every story needs
                somewhere to remain.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                The Witness Path is being built as
                an enduring home for testimonies,
                guidance and faith-building
                resources.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* HOSTING */}

              <article className="rounded-[22px] border border-[#07162E]/10 bg-white p-6 dark:border-white/10 dark:bg-[#0B1A2A]">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
                  <Server
                    size={18}
                  />
                </div>

                <span className="mt-7 block text-[8px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Platform
                </span>

                <h3 className="mt-2 font-serif text-2xl tracking-[-0.035em]">
                  Hosting
                </h3>

                <p className="mt-3 text-[11px] leading-6 text-slate-500 dark:text-slate-400">
                  Contributions help sustain the
                  infrastructure that keeps the
                  platform accessible.
                </p>
              </article>

              {/* ARCHIVING */}

              <article className="rounded-[22px] border border-[#07162E]/10 bg-white p-6 dark:border-white/10 dark:bg-[#0B1A2A]">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
                  <Archive
                    size={18}
                  />
                </div>

                <span className="mt-7 block text-[8px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Preservation
                </span>

                <h3 className="mt-2 font-serif text-2xl tracking-[-0.035em]">
                  Media Archiving
                </h3>

                <p className="mt-3 text-[11px] leading-6 text-slate-500 dark:text-slate-400">
                  Help preserve testimonies and
                  ministry content so they remain
                  available beyond the moment they
                  were first shared.
                </p>
              </article>

              {/* REACH */}

              <article className="rounded-[22px] border border-[#07162E]/10 bg-[#07162E] p-6 text-white sm:col-span-2 dark:border-white/10 dark:bg-[#0E1628]">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#F59E0B]">
                      Keep the path open
                    </span>

                    <h3 className="mt-3 max-w-lg font-serif text-3xl leading-[1] tracking-[-0.04em]">
                      Every contribution helps the
                      witness remain accessible.
                    </h3>

                    <p className="mt-4 max-w-xl text-[11px] leading-6 text-white/55">
                      Support helps create a more
                      sustainable space for stories
                      of faith, hope and
                      restoration.
                    </p>
                  </div>

                  <Sparkles
                    size={20}
                    className="hidden shrink-0 text-[#F59E0B] sm:block"
                  />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          GIVING
      ================================================= */}

      <section
        id="give"
        className="scroll-mt-28 border-y border-[#07162E]/10 bg-white/50 py-16 sm:py-20 dark:border-white/10 dark:bg-[#0B1A2A]/35"
      >
        <div className="mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
              <Heart
                size={18}
              />
            </div>

            <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
              Give securely
            </span>

            <h2 className="mx-auto mt-3 max-w-2xl font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              Choose how you would
              like to support.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Both options below open the existing
              external payment pages used by The
              Witness Path.
            </p>
          </div>

          {/* PAYMENT OPTIONS */}

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {/* PAYSTACK */}

            <a
              href={PAYSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[290px] flex-col justify-between rounded-[24px] bg-[#07162E] p-7 text-white transition duration-300 hover:-translate-y-1 dark:border dark:border-white/10 dark:bg-[#020617]"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-[#F59E0B]">
                  <CreditCard
                    size={19}
                  />
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-white/40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#F59E0B]"
                />
              </div>

              <div className="mt-12">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#F59E0B]">
                  Primary giving option
                </span>

                <h3 className="mt-2 font-serif text-3xl tracking-[-0.04em]">
                  Give via Paystack
                </h3>

                <p className="mt-3 max-w-sm text-[11px] leading-6 text-white/55">
                  Proceed to The Witness Path
                  secure donation page.
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-extrabold">
                  Proceed to Donation

                  <ArrowUpRight
                    size={13}
                  />
                </span>
              </div>
            </a>

            {/* FLUTTERWAVE */}

            <a
              href={FLUTTERWAVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[290px] flex-col justify-between rounded-[24px] border border-[#07162E]/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/45 dark:border-white/10 dark:bg-[#0B1A2A]"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
                  <Globe2
                    size={19}
                  />
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#D97706] dark:text-slate-600 dark:group-hover:text-[#F59E0B]"
                />
              </div>

              <div className="mt-12">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#D97706] dark:text-[#F59E0B]">
                  Alternative option
                </span>

                <h3 className="mt-2 font-serif text-3xl tracking-[-0.04em]">
                  Give via Flutterwave
                </h3>

                <p className="mt-3 max-w-sm text-[11px] leading-6 text-slate-500 dark:text-slate-400">
                  Use the alternative payment page
                  if that option works better for
                  you.
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#D97706] dark:text-[#F59E0B]">
                  Open Payment Page

                  <ArrowUpRight
                    size={13}
                  />
                </span>
              </div>
            </a>
          </div>

          {/* PRIVACY */}

          <div className="mt-5 flex items-start gap-3 rounded-[16px] border border-[#F59E0B]/25 bg-[#F59E0B]/[0.06] p-4 sm:p-5">
            <LockKeyhole
              size={15}
              className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
            />

            <div>
              <strong className="text-[10px] text-[#07162E] dark:text-white">
                Prefer anonymous giving?
              </strong>

              <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                The existing giving setup allows
                you to use{" "}
                <code className="rounded bg-[#07162E]/5 px-1.5 py-0.5 font-semibold text-[#07162E] dark:bg-white/10 dark:text-white">
                  anonymous@witnesspath.app
                </code>{" "}
                on either payment page if you
                prefer privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SUPPORT IS MORE THAN GIVING
      ================================================= */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
                Carry the mission
              </span>

              <h2 className="mt-3 max-w-lg font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                The witness grows when
                it is carried forward.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 dark:text-slate-400">
                Financial support is one way to
                participate. You can also strengthen
                the mission by sharing your
                testimony and helping another person
                discover the stories already here.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/testimonies/share"
                className="group rounded-[20px] border border-[#07162E]/10 bg-white p-6 transition hover:border-[#F59E0B]/40 dark:border-white/10 dark:bg-[#0B1A2A]"
              >
                <span className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#D97706] dark:text-[#F59E0B]">
                  Tell what God did
                </span>

                <h3 className="mt-3 font-serif text-2xl tracking-[-0.035em]">
                  Share Your Testimony
                </h3>

                <div className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold text-[#D97706] dark:text-[#F59E0B]">
                  Share now

                  <ArrowUpRight
                    size={13}
                  />
                </div>
              </Link>

              <Link
                href="/testimonies"
                className="group rounded-[20px] border border-[#07162E]/10 bg-white p-6 transition hover:border-[#F59E0B]/40 dark:border-white/10 dark:bg-[#0B1A2A]"
              >
                <span className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#D97706] dark:text-[#F59E0B]">
                  Carry hope
                </span>

                <h3 className="mt-3 font-serif text-2xl tracking-[-0.035em]">
                  Read & Share Stories
                </h3>

                <div className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold text-[#D97706] dark:text-[#F59E0B]">
                  Explore testimonies

                  <ArrowUpRight
                    size={13}
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          FINAL NOTE
      ================================================= */}

      <section className="pb-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[26px] bg-[#07162E] px-6 py-12 text-center text-white sm:px-10 sm:py-16 dark:border dark:border-white/10 dark:bg-[#020617]">
            <Sparkles
              size={19}
              className="mx-auto text-[#F59E0B]"
            />

            <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              Thank you for helping
              keep the path open.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-[12px] leading-6 text-white/55">
              Every act of support helps sustain
              the space where these witnesses are
              preserved and shared.
            </p>

            <Link
              href="/vision"
              className="mt-7 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#F59E0B]"
            >
              Read our Vision & Mission

              <ArrowUpRight
                size={13}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}