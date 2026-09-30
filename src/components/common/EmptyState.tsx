type Props = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title = "Nothing found",
  description = "Try another search or category.",
}: Props) {
  return (
    <div className="rounded-[24px] border border-dashed border-black/[0.12] bg-white/60 px-6 py-16 text-center">
      <span className="text-2xl">✦</span>

      <h3 className="mt-4 font-serif text-2xl tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#73766f]">
        {description}
      </p>
    </div>
  );
}