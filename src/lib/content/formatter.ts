export type ContentBlock =
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "quote";
      content: string;
    };

export type InlineToken = {
  type: "text" | "bold" | "italic";
  content: string;
};

export function parseContentBlocks(
  value: string
): ContentBlock[] {
  if (!value.trim()) return [];

  const lines = value.split(/\r?\n/);

  const blocks: ContentBlock[] = [];

  let paragraphBuffer: string[] = [];
  let quoteBuffer: string[] = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;

    blocks.push({
      type: "paragraph",
      content: paragraphBuffer
        .join(" ")
        .trim(),
    });

    paragraphBuffer = [];
  };

  const flushQuote = () => {
    if (!quoteBuffer.length) return;

    blocks.push({
      type: "quote",
      content: quoteBuffer
        .join(" ")
        .trim(),
    });

    quoteBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushQuote();
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();

      quoteBuffer.push(
        line.replace(/^>\s?/, "").trim()
      );

      continue;
    }

    flushQuote();

    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushQuote();

  return blocks;
}

export function parseInlineFormatting(
  value: string
): InlineToken[] {
  if (!value) return [];

  const tokens: InlineToken[] = [];

  const expression =
    /(\*\*[^*]+?\*\*|\*[^*]+?\*)/g;

  let lastIndex = 0;

  let match: RegExpExecArray | null;

  while (
    (match = expression.exec(value)) !==
    null
  ) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        content: value.slice(
          lastIndex,
          match.index
        ),
      });
    }

    const matched = match[0];

    if (
      matched.startsWith("**") &&
      matched.endsWith("**")
    ) {
      tokens.push({
        type: "bold",
        content: matched.slice(2, -2),
      });
    } else {
      tokens.push({
        type: "italic",
        content: matched.slice(1, -1),
      });
    }

    lastIndex =
      expression.lastIndex;
  }

  if (lastIndex < value.length) {
    tokens.push({
      type: "text",
      content: value.slice(lastIndex),
    });
  }

  if (!tokens.length) {
    return [
      {
        type: "text",
        content: value,
      },
    ];
  }

  return tokens;
}