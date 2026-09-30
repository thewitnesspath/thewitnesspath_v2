import {
  parseContentBlocks,
  parseInlineFormatting,
  type InlineToken,
} from "@/lib/content/formatter";

type Props = {
  content: string;
};

function InlineContent({
  tokens,
}: {
  tokens: InlineToken[];
}) {
  return (
    <>
      {tokens.map(
        (token, index) => {
          if (
            token.type === "bold"
          ) {
            return (
              <strong
                key={index}
                className="font-bold"
              >
                {token.content}
              </strong>
            );
          }

          if (
            token.type ===
            "italic"
          ) {
            return (
              <em
                key={index}
                className="italic"
              >
                {token.content}
              </em>
            );
          }

          return (
            <span key={index}>
              {token.content}
            </span>
          );
        }
      )}
    </>
  );
}

export default function FormattedContent({
  content,
}: Props) {
  const blocks =
    parseContentBlocks(content);

  if (!blocks.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map(
        (block, index) => {
          const tokens =
            parseInlineFormatting(
              block.content
            );

          if (
            block.type === "quote"
          ) {
            return (
              <blockquote
                key={index}
                className="border-l-[3px] border-accent bg-secondary/5 px-5 py-3 font-serif italic leading-[1.9] text-inherit"
              >
                <InlineContent
                  tokens={tokens}
                />
              </blockquote>
            );
          }

          return (
            <p
              key={index}
              className="leading-[1.9]"
            >
              <InlineContent
                tokens={tokens}
              />
            </p>
          );
        }
      )}
    </div>
  );
}