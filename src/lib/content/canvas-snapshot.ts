import type {
  FormattedSnapshotData,
  SnapshotBlock,
} from "./snapshot";

import type {
  InlineToken,
} from "./formatter";

type CanvasRun = {
  text: string;
  font: string;
};

type CanvasLine = {
  runs: CanvasRun[];
  type: "paragraph" | "quote";
  firstQuoteLine: boolean;
  lastBlockLine: boolean;
};

type SnapshotOptions = {
  data: FormattedSnapshotData;

  contentType:
    | "Testimony"
    | "Blog";

  filePrefix: string;

  id?: string;
};

const COLORS = {
  primary: "#020617",
  secondary: "#0E1628",
  accent: "#F59E0B",

  white: "#FFFFFF",
  text: "#F8FAFC",
  muted: "#94A3B8",
};

function tokenFont(
  token: InlineToken,
  quote: boolean
) {
  if (quote) {
    if (token.type === "bold") {
      return "italic 700 34px Georgia, serif";
    }

    return "italic 34px Georgia, serif";
  }

  if (token.type === "bold") {
    return "700 36px system-ui, -apple-system, sans-serif";
  }

  if (token.type === "italic") {
    return "italic 36px system-ui, -apple-system, sans-serif";
  }

  return "400 36px system-ui, -apple-system, sans-serif";
}

function tokensToRuns(
  tokens: InlineToken[],
  quote: boolean
): CanvasRun[] {
  const result: CanvasRun[] = [];

  for (const token of tokens) {
    const pieces =
      token.content.split(/(\s+)/);

    for (const piece of pieces) {
      if (!piece) continue;

      result.push({
        text: piece,

        font: tokenFont(
          token,
          quote
        ),
      });
    }
  }

  return result;
}

function wrapRuns(
  ctx: CanvasRenderingContext2D,
  runs: CanvasRun[],
  maxWidth: number
): CanvasRun[][] {
  const lines: CanvasRun[][] = [];

  let currentLine: CanvasRun[] = [];
  let currentWidth = 0;

  for (const run of runs) {
    ctx.font = run.font;

    const runWidth =
      ctx.measureText(
        run.text
      ).width;

    if (
      currentLine.length > 0 &&
      currentWidth + runWidth >
        maxWidth
    ) {
      lines.push(
        currentLine
      );

      currentLine = [];
      currentWidth = 0;
    }

    if (
      currentLine.length === 0 &&
      /^\s+$/.test(run.text)
    ) {
      continue;
    }

    currentLine.push(run);
    currentWidth += runWidth;
  }

  if (currentLine.length) {
    lines.push(currentLine);
  }

  return lines;
}

function buildCanvasLines(
  ctx: CanvasRenderingContext2D,
  blocks: SnapshotBlock[],
  maxWidth: number
): CanvasLine[] {
  const result: CanvasLine[] = [];

  for (const block of blocks) {
    const quote =
      block.type === "quote";

    const runs =
      tokensToRuns(
        block.tokens,
        quote
      );

    const wrapped =
      wrapRuns(
        ctx,
        runs,
        quote
          ? maxWidth - 50
          : maxWidth
      );

    wrapped.forEach(
      (line, index) => {
        result.push({
          runs: line,

          type: block.type,

          firstQuoteLine:
            quote &&
            index === 0,

          lastBlockLine:
            index ===
            wrapped.length - 1,
        });
      }
    );
  }

  return result;
}

function drawRuns(
  ctx: CanvasRenderingContext2D,
  runs: CanvasRun[],
  x: number,
  y: number
) {
  let currentX = x;

  for (const run of runs) {
    ctx.font = run.font;

    ctx.fillText(
      run.text,
      currentX,
      y
    );

    currentX +=
      ctx.measureText(
        run.text
      ).width;
  }
}

function wrapPlainText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words =
    text.split(/\s+/);

  const lines: string[] = [];

  let current = "";

  for (const word of words) {
    const candidate =
      current
        ? `${current} ${word}`
        : word;

    if (
      ctx.measureText(candidate)
        .width <= maxWidth
    ) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string
) {
  const anchor =
    document.createElement("a");

  anchor.href =
    canvas.toDataURL(
      "image/png"
    );

  anchor.download = filename;

  document.body.appendChild(
    anchor
  );

  anchor.click();

  document.body.removeChild(
    anchor
  );
}

export async function downloadFormattedSnapshot({
  data,
  contentType,
  filePrefix,
  id,
}: SnapshotOptions) {
  const canvas =
    document.createElement(
      "canvas"
    );

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas is not supported."
    );
  }

  const width = 1440;
  const height = 1800;

  canvas.width = width;
  canvas.height = height;

  /*
   * TITLE
   */

  const titleFont =
    "700 52px system-ui, -apple-system, sans-serif";

  ctx.font = titleFont;

  const titleLines =
    wrapPlainText(
      ctx,
      data.title,
      1200
    );

  const titleStartY = 235;

  const authorY =
    titleStartY +
    titleLines.length * 64 +
    18;

  const boxTop =
    Math.max(
      430,
      authorY + 55
    );

  const boxBottom = 1640;

  const textStartY =
    boxTop + 80;

  const textLeft = 150;

  const bodyWidth = 1140;

  const lineHeight = 58;

  /*
   * FORMAT CONTENT ONCE
   */

  const formattedLines =
    buildCanvasLines(
      ctx,
      data.blocks,
      bodyWidth
    );

  /*
   * PAGE SPLITTING
   */

  const availableHeight =
    boxBottom -
    textStartY -
    45;

  const approximateLines =
    Math.max(
      1,
      Math.floor(
        availableHeight /
          lineHeight
      )
    );

  const pages: CanvasLine[][] =
    [];

  let currentPage: CanvasLine[] =
    [];

  let usedHeight = 0;

  for (
    const line of formattedLines
  ) {
    const extra =
      line.lastBlockLine
        ? 24
        : 0;

    const lineSpace =
      lineHeight + extra;

    if (
      currentPage.length > 0 &&
      usedHeight + lineSpace >
        availableHeight
    ) {
      pages.push(
        currentPage
      );

      currentPage = [];
      usedHeight = 0;
    }

    currentPage.push(line);

    usedHeight += lineSpace;
  }

  if (currentPage.length) {
    pages.push(currentPage);
  }

  if (!pages.length) {
    pages.push([]);
  }

  /*
   * RENDER EACH PAGE
   */

  for (
    let pageIndex = 0;
    pageIndex < pages.length;
    pageIndex++
  ) {
    /*
     * BACKGROUND
     */

    ctx.fillStyle =
      COLORS.primary;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    /*
     * ACCENT BAR
     */

    ctx.fillStyle =
      COLORS.accent;

    ctx.fillRect(
      0,
      0,
      width,
      18
    );

    /*
     * BRAND
     */

    ctx.fillStyle =
      COLORS.white;

    ctx.textAlign =
      "right";

    ctx.font =
      "700 30px system-ui, -apple-system, sans-serif";

    ctx.fillText(
      "The Witness Path",
      1360,
      102
    );

    /*
     * CONTENT TYPE
     */

    ctx.textAlign =
      "left";

    ctx.fillStyle =
      COLORS.muted;

    ctx.font =
      "700 18px system-ui, -apple-system, sans-serif";

    ctx.fillText(
      contentType.toUpperCase(),
      80,
      102
    );

    /*
     * CATEGORY PILL
     */

    const category =
      data.category.toUpperCase();

    ctx.font =
      "700 21px system-ui, -apple-system, sans-serif";

    const categoryWidth =
      ctx.measureText(
        category
      ).width;

    const pillWidth =
      Math.max(
        175,
        categoryWidth + 52
      );

    ctx.fillStyle =
      "rgba(245,158,11,0.12)";

    ctx.beginPath();

    ctx.roundRect(
      80,
      130,
      pillWidth,
      52,
      12
    );

    ctx.fill();

    ctx.strokeStyle =
      "rgba(245,158,11,0.30)";

    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.fillStyle =
      COLORS.accent;

    ctx.textAlign =
      "center";

    ctx.fillText(
      category,
      80 + pillWidth / 2,
      163
    );

    /*
     * TITLE
     */

    ctx.textAlign =
      "left";

    ctx.fillStyle =
      COLORS.white;

    ctx.font =
      titleFont;

    let titleY =
      titleStartY;

    for (
      const titleLine of
      titleLines
    ) {
      ctx.fillText(
        titleLine,
        80,
        titleY
      );

      titleY += 64;
    }

    /*
     * AUTHOR
     */

    ctx.fillStyle =
      COLORS.muted;

    ctx.font =
      "italic 27px system-ui, -apple-system, sans-serif";

    ctx.fillText(
      `By ${data.author}`,
      80,
      authorY
    );

    /*
     * BODY PANEL
     */

    ctx.fillStyle =
      COLORS.secondary;

    ctx.beginPath();

    ctx.roundRect(
      80,
      boxTop,
      1280,
      boxBottom -
        boxTop,
      28
    );

    ctx.fill();

    ctx.strokeStyle =
      "rgba(245,158,11,0.12)";

    ctx.lineWidth = 2;

    ctx.stroke();

    /*
     * BODY
     */

    const page =
      pages[pageIndex];

    let y =
      textStartY;

    for (const line of page) {
      if (
        line.type === "quote"
      ) {
        if (
          line.firstQuoteLine
        ) {
          ctx.fillStyle =
            COLORS.accent;

          ctx.fillRect(
            120,
            y - 38,
            5,
            54
          );
        }

        ctx.fillStyle =
          COLORS.text;

        drawRuns(
          ctx,
          line.runs,
          textLeft + 22,
          y
        );
      } else {
        ctx.fillStyle =
          COLORS.text;

        drawRuns(
          ctx,
          line.runs,
          textLeft,
          y
        );
      }

      y += lineHeight;

      if (
        line.lastBlockLine
      ) {
        y += 24;
      }
    }

    /*
     * FOOTER
     */

    ctx.fillStyle =
      COLORS.muted;

    ctx.textAlign =
      "left";

    ctx.font =
      "600 22px system-ui, -apple-system, sans-serif";

    ctx.fillText(
      "The Witness Path",
      80,
      1735
    );

    /*
     * PAGE NUMBER
     */

    if (pages.length > 1) {
      ctx.textAlign =
        "right";

      ctx.fillStyle =
        COLORS.accent;

      ctx.font =
        "700 22px system-ui, -apple-system, sans-serif";

      const pageNumber =
        `${pageIndex + 1}/${pages.length}`;

      const label =
        pageIndex <
        pages.length - 1
          ? `SWIPE →  ${pageNumber}`
          : pageNumber;

      ctx.fillText(
        label,
        1360,
        1735
      );
    }

    /*
     * EXPORT
     */

    const idPart =
      id
        ? `_${id}`
        : "";

    downloadCanvas(
      canvas,
      `${filePrefix}${idPart}_Page_${pageIndex + 1}.png`
    );

    if (
      pageIndex <
      pages.length - 1
    ) {
      await new Promise<void>(
        (resolve) => {
          window.setTimeout(
            resolve,
            450
          );
        }
      );
    }
  }

  void approximateLines;
}