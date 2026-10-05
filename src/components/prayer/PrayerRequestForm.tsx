"use client";

import {
  Check,
  LockKeyhole,
  Send,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

const categories = [
  "Health & Healing",
  "Financial Provision",
  "Career & Business",
  "Family & Marriage",
  "Spiritual Growth & Strength",
  "Other Challenges",
];

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export default function PrayerRequestForm() {
  const [
    category,
    setCategory,
  ] = useState(
    categories[0]
  );

  const [
    content,
    setContent,
  ] = useState("");

  const [
    website,
    setWebsite,
  ] = useState("");

  const [
    status,
    setStatus,
  ] =
    useState<Status>(
      "idle"
    );

  const [
    message,
    setMessage,
  ] = useState("");

  const canSubmit =
    content
      .trim()
      .length >= 10 &&
    status !==
      "submitting";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setStatus(
      "submitting"
    );

    setMessage("");

    try {
      const response =
        await fetch(
          "/api/prayer",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  category,
                  content,
                  website,
                }
              ),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            "Submission failed."
        );
      }

      setStatus(
        "success"
      );

      setMessage(
        result.message ||
          "Your prayer request has been received."
      );

      setContent("");
      setWebsite("");
      setCategory(
        categories[0]
      );
    } catch (
      error
    ) {
      setStatus(
        "error"
      );

      setMessage(
        error instanceof
          Error
          ? error.message
          : "Your prayer request could not be submitted."
      );
    }
  }

  if (
    status ===
    "success"
  ) {
    return (
      <div className="rounded-[22px] border border-[#F59E0B]/30 bg-white px-6 py-12 text-center shadow-[0_16px_50px_rgba(7,22,46,0.06)] sm:px-10 dark:bg-[#0B1A2A] dark:shadow-none">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B]">
          <Check
            size={19}
          />
        </div>

        <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#D97706] dark:text-[#F59E0B]">
          Prayer received
        </span>

        <h3 className="mt-3 font-serif text-3xl tracking-[-0.04em]">
          We&apos;ll stand
          with you.
        </h3>

        <p className="mx-auto mt-4 max-w-md text-[12px] leading-6 text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={() => {
            setStatus(
              "idle"
            );

            setMessage("");
          }}
          className="mt-7 rounded-xl border border-[#07162E]/10 px-5 py-3 text-[10px] font-bold dark:border-white/10"
        >
          Share another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="rounded-[22px] border border-[#07162E]/10 bg-white p-5 shadow-[0_18px_55px_rgba(7,22,46,0.06)] sm:p-7 dark:border-white/10 dark:bg-[#0B1A2A] dark:shadow-none"
    >
      <div className="flex gap-3 rounded-xl bg-[#F59E0B]/[0.07] p-4">
        <LockKeyhole
          size={15}
          className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
        />

        <div>
          <strong className="text-[10px]">
            Anonymous prayer request
          </strong>

          <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
            No name or email is required.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="prayer-category"
          className="mb-2 block text-[8px] font-extrabold uppercase tracking-[0.17em] text-slate-400"
        >
          Prayer category
        </label>

        <select
          id="prayer-category"
          value={
            category
          }
          onChange={(
            event
          ) =>
            setCategory(
              event.target
                .value
            )
          }
          className="min-h-12 w-full rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-4 text-[12px] text-[#07162E] outline-none transition focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white"
        >
          {categories.map(
            (
              item
            ) => (
              <option
                key={
                  item
                }
                value={
                  item
                }
              >
                {item}
              </option>
            )
          )}
        </select>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="prayer-content"
            className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-slate-400"
          >
            Your prayer request
          </label>

          <span className="text-[8px] text-slate-400">
            {
              content.length
            }
            /2500
          </span>
        </div>

        <textarea
          id="prayer-content"
          value={
            content
          }
          onChange={(
            event
          ) =>
            setContent(
              event.target
                .value
            )
          }
          maxLength={
            2500
          }
          rows={7}
          required
          placeholder="Share what you are trusting God for or the challenge you are facing..."
          className="w-full resize-none rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-4 py-4 text-[13px] leading-6 text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white"
        />
      </div>

      {/* Honeypot */}

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={
          website
        }
        onChange={(
          event
        ) =>
          setWebsite(
            event.target
              .value
          )
        }
        className="absolute left-[-9999px] h-px w-px"
        aria-hidden="true"
      />

      {message && (
        <p className="mt-4 text-[10px] text-red-600 dark:text-red-400">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={
          !canSubmit
        }
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 text-[11px] font-extrabold text-[#07162E] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send
          size={14}
        />

        {status ===
        "submitting"
          ? "Submitting..."
          : "Share Prayer Request"}
      </button>
    </form>
  );
}