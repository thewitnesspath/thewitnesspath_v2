"use client";

import {
  Check,
  Copy,
  Share2,
} from "lucide-react";

import { useState } from "react";

type Props = {
  testimonyId: string;
  title: string;
};

export default function ShareTools({
  testimonyId,
  title,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  const getShareData = () => {
    const url =
      `${window.location.origin}/testimonies/${testimonyId}`;

    const text =
      `Read how God worked in this testimony on The Witness Path: ${title}`;

    return {
      url,
      text,
    };
  };

  const nativeShare = async () => {
    const { url, text } =
      getShareData();

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });

        return;
      } catch {
        return;
      }
    }

    await copyLink();
  };

  const shareWhatsApp = () => {
    const { url, text } =
      getShareData();

    const message =
      `${text}\n\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyLink = async () => {
    const { url } =
      getShareData();

    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={shareWhatsApp}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        WhatsApp
      </button>

      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        <Share2 size={14} />

        Share
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        {copied ? (
          <Check size={14} />
        ) : (
          <Copy size={14} />
        )}

        {copied
          ? "Copied"
          : "Copy link"}
      </button>
    </div>
  );
}