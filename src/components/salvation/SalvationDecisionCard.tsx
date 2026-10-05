"use client";

import {
  Check,
  Heart,
  MessageCircle,
} from "lucide-react";

import {
  useState,
} from "react";

export default function SalvationDecisionCard() {
  const [
    decided,
    setDecided,
  ] = useState(false);

  if (decided) {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#F59E0B]/35 bg-white text-center shadow-[0_18px_60px_rgba(7,22,46,0.06)] dark:bg-[#0B1A2A] dark:shadow-none">
        <div className="h-1 bg-[#F59E0B]" />

        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
            <Check
              size={22}
            />
          </div>

          <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.21em] text-[#D97706] dark:text-[#F59E0B]">
            A new beginning
          </span>

          <h2 className="mx-auto mt-3 max-w-xl font-serif text-4xl leading-[0.98] tracking-[-0.045em] text-[#07162E] sm:text-5xl dark:text-white">
            We rejoice with you.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-[12px] leading-6 text-slate-500 dark:text-slate-400">
            If you sincerely surrendered your life
            to Jesus today, we would love to help
            you understand what comes next and
            support you as you begin this journey.
          </p>

          <a
            href="https://wa.me/2349030314280?text=Praise%20the%20Lord!%20I%20just%20gave%20my%20life%20to%20Christ%20on%20The%20Witness%20Path.%20I%20want%20to%20know%20what%20next!"
            target="_blank"
            rel="noreferrer"
            className="mx-auto mt-7 inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-[11px] font-extrabold text-[#07162E] transition hover:bg-amber-400"
          >
            <MessageCircle
              size={15}
            />

            Help Me With My Next Steps
          </a>

          <a
            href="#what-next"
            className="mt-4 block text-[10px] font-bold text-slate-400 transition hover:text-[#D97706] dark:hover:text-[#F59E0B]"
          >
            Or continue reading below ↓
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#07162E]/10 bg-white p-6 text-center sm:p-10 dark:border-white/10 dark:bg-[#0B1A2A]">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
        <Heart
          size={19}
        />
      </div>

      <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#D97706] dark:text-[#F59E0B]">
        Your response
      </span>

      <h2 className="mx-auto mt-3 max-w-xl font-serif text-3xl leading-[1] tracking-[-0.04em] sm:text-4xl">
        Did you surrender your life to Christ
        today?
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-[12px] leading-6 text-slate-500 dark:text-slate-400">
        You don&apos;t need to submit personal
        information here. This simply opens the
        next-step guidance for you.
      </p>

      <button
        type="button"
        onClick={() =>
          setDecided(
            true
          )
        }
        className="mt-7 inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-[11px] font-extrabold text-[#07162E] transition hover:-translate-y-0.5 hover:bg-amber-400"
      >
        <Check
          size={14}
        />

        Yes, I Prayed That Prayer
      </button>

      <a
        href="#what-next"
        className="mt-4 block text-[10px] font-semibold text-slate-400 transition hover:text-[#D97706] dark:hover:text-[#F59E0B]"
      >
        I&apos;m still learning — continue
      </a>
    </div>
  );
}