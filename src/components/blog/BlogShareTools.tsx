"use client";

import {
  Check,
  Copy,
  Share2,
} from "lucide-react";

import {
  useState,
} from "react";

type Props = {
  slug: string;
  title: string;
};

export default function BlogShareTools({
  slug,
  title,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  const getData = () => {
    const url =
      `${window.location.origin}/blog/${slug}`;

    const text =
      `Read "${title}" on The Witness Path`;

    return {
      url,
      text,
    };
  };

  const shareWhatsApp = () => {
    const { url, text } =
      getData();

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `${text}\n\n${url}`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const nativeShare =
    async () => {
      const { url, text } =
        getData();

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

  const copyLink = async () => {
    const { url } =
      getData();

    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        2000
      );
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={shareWhatsApp}
        className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-secondary px-3.5 text-xs font-bold text-slate-300 transition hover:border-accent/40 hover:text-accent"
      >
        WhatsApp
      </button>

      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-secondary px-3.5 text-xs font-bold text-slate-300 transition hover:border-accent/40 hover:text-accent"
      >
        <Share2 size={14} />
        Share
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-secondary px-3.5 text-xs font-bold text-slate-300 transition hover:border-accent/40 hover:text-accent"
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