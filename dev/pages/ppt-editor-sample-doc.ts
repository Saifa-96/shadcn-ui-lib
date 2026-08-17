import type { BentoDoc } from "@/components/ppt-editor";

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const INK = "#f8fafc";
const MUTED = "#94a3b8";
const ACCENT = "#818cf8";
const SLIDE_BG = "#0f172a";

/**
 * A small, styled two-slide deck used to seed the showcase editor via
 * `initialDoc`, so the demo opens on real content instead of a blank shell.
 */
export const SAMPLE_DOC: BentoDoc = {
  format: "bento/slides",
  version: 1,
  docId: "00000000-0000-4000-8000-000000000001",
  title: "PptEditor demo",
  size: { width: 1280, height: 720 },
  theme: {
    background: SLIDE_BG,
    color: INK,
    accent: "#6366f1",
    fontFamily: FONT_STACK,
  },
  slides: [
    {
      id: "slide-title",
      background: SLIDE_BG,
      transition: "fade",
      notes: "",
      elements: [
        {
          id: "title-accent-bar",
          type: "shape",
          shape: "rect",
          x: 120,
          y: 224,
          w: 64,
          h: 8,
          rotation: 0,
          opacity: 1,
          fill: "#6366f1",
          stroke: "transparent",
          strokeWidth: 0,
          radius: 4,
        },
        {
          id: "title-kicker",
          type: "text",
          x: 120,
          y: 248,
          w: 700,
          h: 36,
          rotation: 0,
          opacity: 1,
          html: "PPT EDITOR",
          fontSize: 18,
          fontFamily: FONT_STACK,
          fontWeight: 600,
          color: ACCENT,
          align: "left",
          valign: "top",
          lineHeight: 1.2,
          letterSpacing: 3,
          role: "kicker",
        },
        {
          id: "title-heading",
          type: "text",
          x: 120,
          y: 292,
          w: 1040,
          h: 220,
          rotation: 0,
          opacity: 1,
          html: "Presentations,<br>built in <b>code</b>",
          fontSize: 88,
          fontFamily: FONT_STACK,
          fontWeight: 800,
          color: INK,
          align: "left",
          valign: "top",
          lineHeight: 1.05,
          role: "title",
        },
        {
          id: "title-subtitle",
          type: "text",
          x: 120,
          y: 524,
          w: 940,
          h: 80,
          rotation: 0,
          opacity: 1,
          html: "A React component that embeds the bento slides editor, same-origin.",
          fontSize: 26,
          fontFamily: FONT_STACK,
          fontWeight: 400,
          color: MUTED,
          align: "left",
          valign: "top",
          lineHeight: 1.4,
          role: "subtitle",
        },
      ],
    },
    {
      id: "slide-highlights",
      background: SLIDE_BG,
      transition: "fade",
      notes: "",
      elements: [
        {
          id: "highlights-heading",
          type: "text",
          x: 120,
          y: 120,
          w: 1040,
          h: 90,
          rotation: 0,
          opacity: 1,
          html: "Highlights",
          fontSize: 56,
          fontFamily: FONT_STACK,
          fontWeight: 800,
          color: INK,
          align: "left",
          valign: "top",
          lineHeight: 1.1,
          role: "title",
        },
        ...highlightRow("row-1", 264, "Same-origin iframe", "direct access to the bento runtime"),
        ...highlightRow("row-2", 380, "Typed controller", "loadDoc, serialize, undo, redo"),
        ...highlightRow("row-3", 496, "Bundled shell", "nothing to host — mounted via srcdoc"),
      ],
    },
  ],
  modified: "2024-01-01T00:00:00.000Z",
};

/**
 * A bullet row: an accent dot plus a lead-in phrase and supporting copy.
 */
function highlightRow(
  prefix: string,
  y: number,
  lead: string,
  rest: string,
): BentoDoc["slides"][number]["elements"] {
  return [
    {
      id: `${prefix}-dot`,
      type: "shape",
      shape: "ellipse",
      x: 120,
      y: y + 12,
      w: 16,
      h: 16,
      rotation: 0,
      opacity: 1,
      fill: "#6366f1",
      stroke: "transparent",
      strokeWidth: 0,
      radius: 0,
    },
    {
      id: `${prefix}-text`,
      type: "text",
      x: 164,
      y,
      w: 960,
      h: 64,
      rotation: 0,
      opacity: 1,
      html: `<b>${lead}</b> — ${rest}`,
      fontSize: 30,
      fontFamily: FONT_STACK,
      fontWeight: 400,
      color: INK,
      align: "left",
      valign: "top",
      lineHeight: 1.3,
      role: "body",
    },
  ];
}
