import { parseContent, type TextRun } from "./format";

const WIDTH = 1080;
const HEIGHT = 1350;
const LEFT = 90;
const RIGHT = 990;
const BOTTOM = 1190;

function setFont(
  ctx: CanvasRenderingContext2D,
  style: TextRun["style"],
  size = 35,
  quote = false
) {
  ctx.font = `${
    style === "bold" ? "bold " : ""
  }${
    style === "italic" || quote ? "italic " : ""
  }${size}px Georgia, serif`;
}

function wrap(
  ctx: CanvasRenderingContext2D,
  runs: TextRun[],
  width: number,
  quote: boolean
): TextRun[][] {
  const lines: TextRun[][] = [[]];
  let used = 0;

  for (const run of runs) {
    const words =
      run.text.match(/\S+\s*|\s+/g) || [];

    for (const word of words) {
      setFont(
        ctx,
        run.style,
        35,
        quote
      );

      const clean =
        used === 0
          ? word.trimStart()
          : word;

      let measured =
        ctx.measureText(clean).width;

      if (
        used &&
        used + measured > width
      ) {
        lines.push([]);
        used = 0;
      }

      const chunk =
        used === 0
          ? word.trimStart()
          : word;

      measured =
        ctx.measureText(chunk).width;

      if (measured > width) {
        for (const character of chunk) {
          const size =
            ctx.measureText(
              character
            ).width;

          if (
            used &&
            used + size > width
          ) {
            lines.push([]);
            used = 0;
          }

          lines[
            lines.length - 1
          ].push({
            style: run.style,
            text: character,
          });

          used += size;
        }
      } else if (chunk) {
        lines[
          lines.length - 1
        ].push({
          style: run.style,
          text: chunk,
        });

        used += measured;
      }
    }
  }

  return lines;
}

type SnapshotOptions = {
  title: string;
  author: string;
  category: string;
  content: string;
};

export function renderSnapshotPages({
  title,
  author,
  category,
  content,
}: SnapshotOptions): HTMLCanvasElement[] {
  if (
    typeof document === "undefined"
  ) {
    throw new Error(
      "Snapshot export runs in the browser."
    );
  }

  const pages: HTMLCanvasElement[] =
    [];

  let canvas!: HTMLCanvasElement;

  let ctx!: CanvasRenderingContext2D;

  let y = 0;

  function newPage() {
    canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const nextContext =
      canvas.getContext("2d");

    if (!nextContext) {
      throw new Error(
        "Canvas is unavailable in this browser."
      );
    }

    // Safe after the null check
    ctx = nextContext;

    ctx.fillStyle = "#fffdfa";

    ctx.fillRect(
      0,
      0,
      WIDTH,
      HEIGHT
    );

    ctx.fillStyle = "#0b1329";

    ctx.font =
      "bold 25px Arial, sans-serif";

    ctx.fillText(
      "THE WITNESS PATH",
      LEFT,
      94
    );

    ctx.fillStyle = "#9a651a";

    ctx.font =
      "bold 21px Arial, sans-serif";

    ctx.fillText(
      category.toUpperCase(),
      LEFT,
      146
    );

    y = 210;

    pages.push(canvas);
  }

  function nextIfNeeded(
    height: number
  ) {
    if (
      y + height >
      BOTTOM
    ) {
      newPage();
    }
  }

  newPage();

  // -------------------------
  // TITLE
  // -------------------------

  ctx.fillStyle = "#0b1329";

  ctx.font =
    "bold 58px Georgia, serif";

  const titleWords =
    title
      .trim()
      .split(/\s+/);

  let titleLine = "";

  for (const word of titleWords) {
    const proposed =
      titleLine
        ? `${titleLine} ${word}`
        : word;

    if (
      titleLine &&
      ctx.measureText(
        proposed
      ).width >
        RIGHT - LEFT
    ) {
      ctx.fillText(
        titleLine,
        LEFT,
        y
      );

      y += 68;

      titleLine = word;
    } else {
      titleLine = proposed;
    }
  }

  if (titleLine) {
    ctx.fillText(
      titleLine,
      LEFT,
      y
    );

    y += 70;
  }

  // -------------------------
  // AUTHOR
  // -------------------------

  ctx.fillStyle = "#6b7786";

  ctx.font =
    "26px Arial, sans-serif";

  ctx.fillText(
    `By ${author}`,
    LEFT,
    y
  );

  y += 68;

  // -------------------------
  // DIVIDER
  // -------------------------

  ctx.strokeStyle = "#d9dde1";

  ctx.beginPath();

  ctx.moveTo(
    LEFT,
    y
  );

  ctx.lineTo(
    RIGHT,
    y
  );

  ctx.stroke();

  y += 55;

  // -------------------------
  // CONTENT
  // -------------------------

  for (
    const block of parseContent(
      content
    )
  ) {
    const quoted =
      block.kind === "quote";

    const x =
      quoted
        ? LEFT + 28
        : LEFT;

    const width =
      RIGHT - x;

    const lines = wrap(
      ctx,
      block.runs,
      width,
      quoted
    );

    for (const line of lines) {
      nextIfNeeded(58);

      if (quoted) {
        ctx.fillStyle =
          "#e5f1f5";

        ctx.fillRect(
          LEFT,
          y - 38,
          RIGHT - LEFT,
          55
        );

        ctx.fillStyle =
          "#2488a8";

        ctx.fillRect(
          LEFT,
          y - 38,
          5,
          55
        );
      }

      let at = x;

      for (const run of line) {
        setFont(
          ctx,
          run.style,
          35,
          quoted
        );

        ctx.fillStyle =
          "#17243b";

        ctx.fillText(
          run.text,
          at,
          y
        );

        at +=
          ctx.measureText(
            run.text
          ).width;
      }

      y += 58;
    }

    y +=
      block.runs.length
        ? 18
        : 28;
  }

  // -------------------------
  // FOOTER
  // -------------------------

  pages.forEach(
    (page, index) => {
      const context =
        page.getContext(
          "2d"
        );

      if (!context) {
        return;
      }

      context.fillStyle =
        "#c6b07e";

      context.fillRect(
        LEFT,
        1251,
        RIGHT - LEFT,
        2
      );

      context.fillStyle =
        "#5d6977";

      context.font =
        "19px Arial, sans-serif";

      context.fillText(
        "Witness His grace, strengthen your faith.",
        LEFT,
        1290
      );

      context.textAlign =
        "right";

      context.fillText(
        `${index + 1} / ${
          pages.length
        }`,
        RIGHT,
        1290
      );

      context.textAlign =
        "left";
    }
  );

  return pages;
}