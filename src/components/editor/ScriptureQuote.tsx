type Props = {
  children: React.ReactNode;
};

export default function ScriptureQuote({
  children,
}: Props) {
  return (
    <blockquote className="my-7 border-l-2 border-[#b88a45] bg-[#f5efe5] px-5 py-4 font-serif text-lg italic leading-8 text-[#4f473d]">
      {children}
    </blockquote>
  );
}