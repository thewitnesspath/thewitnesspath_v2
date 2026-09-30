"use client";

import {
  useEffect,
  useState,
} from "react";

type Props = {
  testimonyId: string;
  initialCount: number;
};

const MAX_PRAISES_PER_BROWSER = 5;

export default function ReactionBar({
  testimonyId,
  initialCount,
}: Props) {
  const [count, setCount] =
    useState(initialCount);

  const [localCount, setLocalCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const stored = Number(
      localStorage.getItem(
        `twp:praise:${testimonyId}`
      ) ?? "0"
    );

    setLocalCount(
      Number.isFinite(stored)
        ? stored
        : 0
    );
  }, [testimonyId]);

  const maxed =
    localCount >=
    MAX_PRAISES_PER_BROWSER;

  const praise = async () => {
    if (loading || maxed) return;

    const previousCount = count;
    const previousLocal = localCount;

    setLoading(true);

    setCount(
      (current) => current + 1
    );

    setLocalCount(
      (current) => current + 1
    );

    try {
      const response =
  await fetch(
    `/api/testimonies/${testimonyId}/praise`,
    {
      method: "POST",
    }
  );

const result =
  await response.json();

if (!response.ok) {
  return;
}

setCount(
  typeof result.count ===
    "number"
    ? result.count
    : count + 1
);

      const nextLocal =
        previousLocal + 1;

      localStorage.setItem(
        `twp:praise:${testimonyId}`,
        String(nextLocal)
      );
    } catch {
      setCount(previousCount);
      setLocalCount(previousLocal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={praise}
      disabled={loading || maxed}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-xs font-bold text-slate-700 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-amber-400"
    >
      <span aria-hidden="true">
        🙌
      </span>

      <span>Praise God</span>

      {count > 0 && (
        <span className="text-slate-400">
          ({count})
        </span>
      )}
    </button>
  );
}