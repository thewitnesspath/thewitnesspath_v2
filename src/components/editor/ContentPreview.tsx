import {
  Eye,
} from "lucide-react";

import FormattedContent from "./FormattedContent";

type Props = {
  content: string;
};

export default function ContentPreview({
  content,
}: Props) {
  if (!content.trim()) {
    return (
      <div className="rounded-[16px] border border-dashed border-[#07162E]/15 bg-[#FFFDF8] px-5 py-10 text-center transition-colors dark:border-white/10 dark:bg-[#06111F]">
        <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-[#07162E]/5 text-slate-400 dark:bg-white/[0.05] dark:text-slate-600">
          <Eye
            size={15}
          />
        </div>

        <p className="mt-3 text-[12px] text-slate-400 dark:text-slate-500">
          Your formatted preview will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#07162E]/10 bg-white transition-colors dark:border-white/10 dark:bg-[#0B1A2A]">
      {/* PREVIEW HEADER */}

      <div className="flex items-center justify-between border-b border-[#07162E]/10 bg-[#F7F4ED] px-5 py-3 dark:border-white/10 dark:bg-[#0E1628]">
        <div className="flex items-center gap-2">
          <Eye
            size={13}
            className="text-[#D97706] dark:text-[#F59E0B]"
          />

          <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Preview
          </span>
        </div>

        <span className="text-[9px] text-slate-400 dark:text-slate-600">
          As readers will see it
        </span>
      </div>

      {/* CONTENT */}

      <div className="p-5 sm:p-6">
        <div className="font-serif text-[16px] leading-8 text-[#07162E] sm:text-[17px] dark:text-slate-200">
          <FormattedContent
            content={
              content
            }
          />
        </div>
      </div>
    </div>
  );
}