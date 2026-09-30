import FormattedContent from "./FormattedContent";

type Props = {
  content: string;
};

export default function ContentPreview({
  content,
}: Props) {
  if (!content.trim()) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 px-5 py-10 text-center">
        <p className="text-sm text-black/35">
          Your formatted preview will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6">
      <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
        Preview
      </span>

      <div className="font-serif text-[17px] text-current">
        <FormattedContent content={content} />
      </div>
    </div>
  );
}