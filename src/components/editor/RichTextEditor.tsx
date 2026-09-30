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
  placeholder =
    "Write here...",
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
      value.slice(0, start) +
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

  const quoteSelection = () => {
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
      value.slice(0, start) +
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
    <div>
      {label && (
        <label className="mb-2 block text-xs font-bold text-slate-300">
          {label}
        </label>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-primary transition focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/10">
        {/* TOOLBAR */}
        <div className="flex items-center gap-1 border-b border-white/10 bg-secondary p-2">
          <button
            type="button"
            onClick={() =>
              wrapSelection(
                "**",
                "**"
              )
            }
            title="Bold"
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Bold size={15} />
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
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Italic
              size={15}
            />
          </button>

          <div className="mx-1 h-5 w-px bg-white/10" />

          <button
            type="button"
            onClick={
              quoteSelection
            }
            title="Scripture quote"
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-accent"
          >
            <Quote size={15} />
          </button>

          <span className="ml-auto hidden pr-2 text-[10px] font-medium text-slate-600 sm:inline">
            Bold · Italic · Scripture
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          rows={rows}
          className="w-full resize-y bg-primary px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}