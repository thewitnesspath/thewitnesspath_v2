// A small, safe content model shared by the live view and canvas export.
// Supported syntax: **bold**, *italic*, and lines starting with > for quotes.
export type TextRun = { style: "normal" | "bold" | "italic"; text: string };
export type ContentBlock = { kind: "quote" | "paragraph"; runs: TextRun[] };

export function parseContent(value: string = ""): ContentBlock[] {
  return String(value).replace(/\r\n?/g, "\n").split("\n").map(line => {
    const quote = /^>\s?/.test(line);
    const text = quote ? line.replace(/^>\s?/, "") : line;
    const runs: TextRun[] = [];
    const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (index > cursor) runs.push({ style: "normal", text: text.slice(cursor, index) });
      runs.push({ style: match[1] ? "bold" : "italic", text: match[1] || match[2] || "" });
      cursor = index + match[0].length;
    }
    if (cursor < text.length) runs.push({ style: "normal", text: text.slice(cursor) });
    return { kind: quote ? "quote" : "paragraph", runs };
  });
}
