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
  "Silent Battles & Difficult Seasons",
  "Mental & Emotional Distress",
  "Life Hardships & Crises",
  "Faith, Doubt & Doctrine",
  "Relationships & Family",
];

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export default function ShareStruggleForm() {
  const [
    category,
    setCategory,
  ] = useState(
    categories[0]
  );

  const [
    question,
    setQuestion,
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
    question
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
          "/api/guidance/questions",
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
                  question,
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
          "Your question has been received."
      );

      setQuestion("");
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
          : "Your submission could not be sent."
      );
    }
  }

  if (
    status ===
    "success"
  ) {
    return (
      <div className="rounded-[22px] border border-[#F59E0B]/30 bg-white p-7 text-center shadow-[0_16px_50px_rgba(7,22,46,0.06)] sm:p-10 dark:bg-[#0B1A2A] dark:shadow-none">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F59E0B]/12 text-[#D97706] dark:text-[#F59E0B]">
          <Check
            size={20}
          />
        </div>

        <span className="mt-6 block text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#D97706] dark:text-[#F59E0B]">
          Safely received
        </span>

        <h3 className="mx-auto mt-3 max-w-md font-serif text-3xl tracking-[-0.04em] text-[#07162E] dark:text-white">
          Thank you for
          sharing.
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
          className="mt-7 rounded-xl border border-[#07162E]/10 px-5 py-3 text-[10px] font-bold text-[#07162E] transition hover:border-[#F59E0B] dark:border-white/10 dark:text-white"
        >
          Share another
          question
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
      <div className="flex items-start gap-3 rounded-xl bg-[#F59E0B]/[0.07] p-4">
        <LockKeyhole
          size={16}
          className="mt-0.5 shrink-0 text-[#D97706] dark:text-[#F59E0B]"
        />

        <div>
          <strong className="text-[10px] text-[#07162E] dark:text-white">
            No name or email
            required
          </strong>

          <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
            Share only what
            you are comfortable
            sharing.
          </p>
        </div>
      </div>

      {/* CATEGORY */}

      <div className="mt-6">
        <label
          htmlFor="guidance-category"
          className="mb-2 block text-[8px] font-extrabold uppercase tracking-[0.17em] text-slate-400"
        >
          Area of need
        </label>

        <select
          id="guidance-category"
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

      {/* QUESTION */}

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="guidance-question"
            className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-slate-400"
          >
            Your struggle or
            question
          </label>

          <span className="text-[8px] text-slate-400">
            {
              question.length
            }
          </span>
        </div>

        <textarea
          id="guidance-question"
          value={
            question
          }
          onChange={(
            event
          ) =>
            setQuestion(
              event.target
                .value
            )
          }
          required
          maxLength={
            3000
          }
          rows={8}
          placeholder="Type freely. Share the question, doubt, difficult season or struggle you're carrying..."
          className="w-full resize-none rounded-xl border border-[#07162E]/10 bg-[#FFFDF8] px-4 py-4 text-[13px] leading-6 text-[#07162E] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 dark:border-white/10 dark:bg-[#06111F] dark:text-white"
        />
      </div>

      {/* HONEYPOT */}

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
          : "Submit Anonymously"}
      </button>
    </form>
  );
}