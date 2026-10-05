"use client";

import {
  Check,
  HeartHandshake,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  PrayerRequest,
} from "@/app/(site)/prayer/page";

type Props = {
  request: PrayerRequest;
};

const MAX_PRAYERS_PER_BROWSER =
  5;

export default function PrayerCard({
  request,
}: Props) {
  const [
    count,
    setCount,
  ] = useState(
    request.prayer_count ??
      0
  );

  const [
    personalCount,
    setPersonalCount,
  ] = useState(0);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    expanded,
    setExpanded,
  ] = useState(false);

  useEffect(() => {
    const stored =
      Number(
        localStorage.getItem(
          `prayed_${request.id}`
        ) || "0"
      );

    setPersonalCount(
      Number.isFinite(
        stored
      )
        ? stored
        : 0
    );
  }, [request.id]);

  const isMaxed =
    personalCount >=
    MAX_PRAYERS_PER_BROWSER;

  const isLong =
    request.content.length >
    260;

  const text =
    !expanded &&
    isLong
      ? `${request.content
          .slice(0, 260)
          .trimEnd()}…`
      : request.content;

  async function pray() {
    if (
      submitting ||
      isMaxed
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          `/api/prayer/${request.id}/pray`,
          {
            method:
              "POST",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error();
      }

      const nextPersonal =
        personalCount + 1;

      setCount(
        result.prayerCount
      );

      setPersonalCount(
        nextPersonal
      );

      localStorage.setItem(
        `prayed_${request.id}`,
        String(
          nextPersonal
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="flex h-full flex-col rounded-[20px] border border-[#07162E]/10 bg-white p-5 shadow-[0_12px_35px_rgba(7,22,46,0.04)] transition hover:border-[#F59E0B]/30 sm:p-6 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-[#F59E0B]/10 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#D97706] dark:text-[#F59E0B]">
          {request.category ||
            "General Prayer"}
        </span>

        <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Anonymous
        </span>
      </div>

      {/* CONTENT */}

      <p className="mt-6 whitespace-pre-line break-words font-serif text-[18px] leading-8 text-[#26354A] dark:text-slate-300">
        {text}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() =>
            setExpanded(
              (
                current
              ) =>
                !current
            )
          }
          className="mt-3 w-fit text-[10px] font-bold text-[#D97706] dark:text-[#F59E0B]"
        >
          {expanded
            ? "Read less"
            : "Read full request"}
        </button>
      )}

      {/* ACTION */}

      <div className="mt-auto pt-7">
        <div className="border-t border-[#07162E]/10 pt-4 dark:border-white/10">
          <button
            type="button"
            onClick={
              pray
            }
            disabled={
              submitting ||
              isMaxed
            }
            className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border text-[10px] font-extrabold transition ${
              isMaxed
                ? "border-[#07162E]/10 bg-[#07162E]/5 text-slate-400 dark:border-white/10 dark:bg-white/5"
                : "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#D97706] hover:border-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#07162E] dark:text-[#F59E0B]"
            }`}
          >
            {isMaxed ? (
              <Check
                size={14}
              />
            ) : (
              <HeartHandshake
                size={14}
              />
            )}

            {submitting
              ? "Marking prayer..."
              : isMaxed
                ? "You stood in prayer"
                : `I Have Prayed${
                    count > 0
                      ? ` (${count})`
                      : ""
                  }`}
          </button>

          {personalCount >
            0 &&
            !isMaxed && (
              <p className="mt-2 text-center text-[8px] text-slate-400">
                You&apos;ve
                prayed for this
                request{" "}
                {
                  personalCount
                }
                /5 times.
              </p>
            )}
        </div>
      </div>
    </article>
  );
}