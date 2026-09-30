import { parseContent } from "@/lib/format";

export default function FormattedText({ value = "" }: { value?: string }) {
  return <div className="formatted-text">{parseContent(value).map((block, index) => {
    const content = block.runs.map((run, part) => run.style === "bold" ? <strong key={part}>{run.text}</strong> : run.style === "italic" ? <em key={part}>{run.text}</em> : <span key={part}>{run.text}</span>);
    return block.kind === "quote" ? <blockquote key={index}>{content.length ? content : "\u00a0"}</blockquote> : <p key={index}>{content.length ? content : "\u00a0"}</p>;
  })}</div>;
}
