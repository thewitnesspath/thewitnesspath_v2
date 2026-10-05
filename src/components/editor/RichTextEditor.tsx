"use client";

import {
  Bold,
  Italic,
  Quote,
} from "lucide-react";

import {
  useRef,
} from "react";

type Props = {
  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder?: string;

  rows?: number;

  label?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here...",
  rows = 10,
  label,
}: Props) {
  const textareaRef =
    useRef<HTMLTextAreaElement>(
      null
    );

  const wrapSelection = (
    before: string,
    after: string
  ) => {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const selected =
      value.slice(
        start,
        end
      );

    const updated =
      value.slice(
        0,
        start
      ) +
      before +
      selected +
      after +
      value.slice(end);

    onChange(updated);

    requestAnimationFrame(
      () => {
        textarea.focus();

        textarea.setSelectionRange(
          start +
            before.length,
          end +
            before.length
        );
      }
    );
  };

  const quoteSelection =
    () => {
      const textarea =
        textareaRef.current;

      if (!textarea) return;

      const start =
        textarea.selectionStart;

      const end =
        textarea.selectionEnd;

      const selected =
        value.slice(
          start,
          end
        );

      const quoteText =
        selected
          ? selected
              .split("\n")
              .map(
                (line) =>
                  `> ${line}`
              )
              .join("\n")
          : "> ";

      const updated =
        value.slice(
          0,
          start
        ) +
        quoteText +
        value.slice(end);

      onChange(updated);

      requestAnimationFrame(
        () => {
          textarea.focus();

          const position =
            start +
            quoteText.length;

          textarea.setSelectionRange(
            position,
            position
          );
        }
      );
    };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-[12px] font-extrabold text-[#07162E] dark:text-slate-100">
          {label}
        </label>
      )}

      <div
        className="
          overflow-hidden
          rounded-[16px]
          border
          border-[#07162E]/10
          bg-[#FFFDF8]
          transition-all
          duration-300

          focus-within:border-[#F59E0B]
          focus-within:ring-4
          focus-within:ring-[#F59E0B]/10

          dark:border-white/10
          dark:bg-[#06111F]
        "
      >
        {/* =========================================
            TOOLBAR
        ========================================= */}

        <div className="flex min-h-[48px] items-center gap-1 border-b border-[#07162E]/10 bg-[#F7F4ED] px-2 py-2 transition-colors dark:border-white/10 dark:bg-[#0E1628]">
          <button
            type="button"
            onClick={() =>
              wrapSelection(
                "**",
                "**"
              )
            }
            title="Bold"
            aria-label="Bold selected text"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition duration-200 hover:bg-[#07162E]/5 hover:text-[#07162E] dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Bold
              size={15}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              wrapSelection(
                "*",
                "*"
              )
            }
            title="Italic"
            aria-label="Italicize selected text"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition duration-200 hover:bg-[#07162E]/5 hover:text-[#07162E] dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Italic
              size={15}
            />
          </button>

          <div className="mx-1 h-5 w-px bg-[#07162E]/10 dark:bg-white/10" />

          <button
            type="button"
            onClick={
              quoteSelection
            }
            title="Scripture quote"
            aria-label="Format selected text as scripture quote"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition duration-200 hover:bg-[#F59E0B]/10 hover:text-[#D97706] dark:text-slate-400 dark:hover:bg-[#F59E0B]/10 dark:hover:text-[#F59E0B]"
          >
            <Quote
              size={15}
            />
          </button>

          <span className="ml-auto hidden pr-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:inline dark:text-slate-600">
            Bold · Italic · Scripture
          </span>
        </div>

        {/* =========================================
            TEXTAREA
        ========================================= */}

        <textarea
          ref={
            textareaRef
          }
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }
          placeholder={
            placeholder
          }
          rows={rows}
          className="
            w-full
            resize-y
            bg-[#FFFDF8]
            px-4
            py-4
            text-sm
            leading-7
            text-[#07162E]
            outline-none
            transition-colors
            placeholder:text-slate-400

            dark:bg-[#06111F]
            dark:text-white
            dark:placeholder:text-slate-600
          "
        />
      </div>

      {/* SMALL EDITOR NOTE */}

      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-[9px] leading-4 text-slate-400 dark:text-slate-600">
          Select text before using formatting tools.
        </p>

        <span className="text-[9px] font-medium text-slate-400 dark:text-slate-600">
          {value.length > 0
            ? `${value.length.toLocaleString()} characters`
            : "Start writing"}
        </span>
      </div>
    </div>
  );
}