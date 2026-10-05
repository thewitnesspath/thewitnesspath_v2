import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  createClient,
} from "@supabase/supabase-js";

import PrayerList from "@/components/prayer/PrayerList";
import PrayerRequestForm from "@/components/prayer/PrayerRequestForm";

export const metadata = {
  title:
    "Pray for Me | The Witness Path",
  description:
    "Share a prayer request and stand with others in faith.",
};

export type PrayerRequest = {
  id: string | number;
  category: string | null;
  content: string;
  prayer_count: number | null;
  created_at: string | null;
};

async function getPrayerRequests(): Promise<
  PrayerRequest[]
> {
  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const anonKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey
  ) {
    return [];
  }

  const supabase =
    createClient(
      url,
      anonKey,
      {
        auth: {
          persistSession:
            false,
          autoRefreshToken:
            false,
        },
      }
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "PrayerRequests"
      )
      .select(
        `
          id,
          category,
          content,
          prayer_count,
          created_at
        `
      )
      .eq(
        "is_approved",
        true
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Prayer requests fetch failed:",
      error
    );

    return [];
  }

  return (
    data ?? []
  ) as PrayerRequest[];
}

export default async function PrayerPage() {
  const requests =
    await getPrayerRequests();

  const totalPrayers =
    requests.reduce(
      (
        sum,
        request
      ) =>
        sum +
        (
          request.prayer_count ??
          0
        ),
      0
    );

  return (
    <main className="min-h-screen bg-[#FFFDF8] text-[#07162E] transition-colors duration-300 dark:bg-[#06111F] dark:text-white">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="px-3 pb-5 pt-[94px] sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[590px] max-w-[1420px] overflow-hidden rounded-[26px] border border-[#07162E]/10 bg-[#07162E] dark:border-white/10">
          <Image
            src="/images/hero/hero-3.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,27,0.96)_0%,rgba(4,14,27,0.84)_48%,rgba(4,14,27,0.35)_100%)]" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#06111F]/60 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[590px] max-w-[760px] flex-col justify-between px-6 py-9 text-white sm:px-10 sm:py-11 lg:px-14">
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

                Pray for Me
              </div>

              <h1 className="mt-5 font-serif text-[clamp(3.8rem,7vw,7rem)] leading-[0.9] tracking-[-0.06em]">
                You are not
                <br />

                praying
                <br />

                <span className="text-[#F59E0B]">
                  alone.
                </span>
              </h1>

              <p className="mt-7 max-w-[570px] text-sm leading-7 text-white/70 sm:text-[16px]">
                Share what you are trusting God
                for, or quietly stand with someone
                else in prayer.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#share-prayer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-[11px] font-extrabold text-[#07162E] transition hover:-translate-y-0.5 hover:bg-amber-400"
                >
                  Share a Prayer Request

                  <ArrowUpRight
                    size={14}
                  />
                </a>

                <a
                  href="#prayer-wall"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-6 text-[11px] font-bold text-white backdrop-blur transition hover:border-[#F59E0B]"
                >
                  Pray with Someone
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          LIVE ACTIVITY
      ================================================= */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="rounded-[18px] border border-[#07162E]/10 bg-white p-5 dark:border-white/10 dark:bg-[#0B1A2A]">
            <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Prayer requests
            </span>

            <p className="mt-2 font-serif text-4xl tracking-[-0.04em]">
              {
                requests.length
              }
            </p>
          </div>

          <div className="rounded-[18px] border border-[#07162E]/10 bg-white p-5 dark:border-white/10 dark:bg-[#0B1A2A]">
            <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Prayers offered
            </span>

            <p className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#D97706] dark:text-[#F59E0B]">
              {
                totalPrayers
              }
            </p>
          </div>

          <div className="rounded-[18px] bg-[#07162E] p-5 text-white dark:border dark:border-white/10 dark:bg-[#0E1628]">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={13}
                className="text-[#F59E0B]"
              />

              <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-white/40">
                Anonymous space
              </span>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-white/60">
              Your name is not required when
              sharing a prayer request.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          SHARE REQUEST
      ================================================= */}

      <section
        id="share-prayer"
        className="scroll-mt-28 border-y border-[#07162E]/10 bg-white/55 py-16 dark:border-white/10 dark:bg-[#0B1A2A]/35"
      >
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
              Bring the burden
            </span>

            <h2 className="mt-3 max-w-md font-serif text-4xl leading-[0.98] tracking-[-0.045em] sm:text-5xl">
              What can we pray
              with you about?
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              Share only what you are comfortable
              sharing. Approved requests appear on
              the prayer wall for others to stand
              with you.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex gap-3">
                <ShieldCheck
                  size={15}
                  className="mt-1 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
                />

                <div>
                  <strong className="text-[11px]">
                    Reviewed first
                  </strong>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                    Requests enter moderation
                    before becoming public.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <HeartHandshake
                  size={15}
                  className="mt-1 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
                />

                <div>
                  <strong className="text-[11px]">
                    Others can stand with you
                  </strong>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                    The prayer count grows when
                    people mark that they have
                    prayed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <PrayerRequestForm />
        </div>
      </section>

      {/* =================================================
          PRAYER WALL
      ================================================= */}

      <section
        id="prayer-wall"
        className="scroll-mt-28 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#D97706] dark:text-[#F59E0B]">
              Stand with someone
            </span>

            <h2 className="mt-2 font-serif text-4xl tracking-[-0.045em] sm:text-5xl">
              Prayer Wall
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Read slowly. Pray sincerely. Let
              someone know that their burden was
              carried before God today.
            </p>
          </div>

          <PrayerList
            requests={
              requests
            }
          />
        </div>
      </section>

      {/* =================================================
          SAFE HAVEN NEXT STEPS
      ================================================= */}

      <section className="pb-20">
        <div className="mx-auto grid max-w-[1180px] gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Link
            href="/guidance"
            className="group rounded-[20px] border border-[#07162E]/10 bg-white p-6 transition hover:border-[#F59E0B]/40 dark:border-white/10 dark:bg-[#0B1A2A]"
          >
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#D97706] dark:text-[#F59E0B]">
              Safe Haven
            </span>

            <h3 className="mt-3 font-serif text-2xl tracking-[-0.035em]">
              Need guidance too?
            </h3>

            <p className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Share a struggle or question
              anonymously.
            </p>
          </Link>

          <Link
            href="/salvation"
            className="group rounded-[20px] bg-[#F59E0B] p-6 text-[#07162E] transition hover:-translate-y-0.5"
          >
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#07162E]/45">
              A new beginning
            </span>

            <h3 className="mt-3 font-serif text-2xl tracking-[-0.035em]">
              Give Your Life to Christ
            </h3>

            <p className="mt-3 text-[11px] leading-5 text-[#07162E]/65">
              Understand salvation and what comes
              next in following Jesus.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}