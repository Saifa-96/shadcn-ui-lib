import { describe, expect, it } from "vitest";
import { fromMarkdown, toMarkdown } from "./markdown";
import type { BlockEditorValue } from "./schema";

const DOC: BlockEditorValue = [
  { type: "h1", children: [{ text: "Title", bold: true }] },
  {
    type: "p",
    children: [
      { text: "plain " },
      { text: "bold", bold: true },
      { text: " and " },
      { text: "italic", italic: true },
    ],
  },
  { type: "p", children: [{ text: "line one\nline two" }] },
  { type: "p", children: [{ text: "first" }], listStyleType: "todo", checked: true, indent: 0 },
  { type: "p", children: [{ text: "second" }], listStyleType: "todo", checked: false, indent: 0 },
  { type: "p", children: [{ text: "nested" }], listStyleType: "disc", indent: 1 },
  { type: "p", children: [{ text: "third" }], listStyleType: "todo", checked: false, indent: 0 },
  { type: "p", children: [{ text: "intro" }], listStyleType: "decimal", indent: 0, listStart: 3 },
  { type: "blockquote", children: [{ type: "p", children: [{ text: "quoted" }] }] },
  {
    type: "img",
    url: "https://example.com/a.png",
    children: [{ text: "" }],
    caption: [{ text: "a chart" }],
  },
  {
    type: "table",
    children: [
      {
        type: "tr",
        children: [
          { type: "th", children: [{ type: "p", children: [{ text: "K" }] }] },
          { type: "th", children: [{ type: "p", children: [{ text: "V" }] }] },
        ],
      },
      {
        type: "tr",
        children: [
          { type: "td", children: [{ type: "p", children: [{ text: "a" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "1", bold: true }] }] },
        ],
      },
    ],
  },
];

describe("block-editor markdown helpers", () => {
  it("round-trips a representative document through markdown", () => {
    const md = toMarkdown(DOC);
    const back = fromMarkdown(md);

    expect(back).toEqual(
      DOC.map((block) =>
        block.type === "table"
          ? {
              ...block,
              children: block.children.map((row) => ({
                ...row,
                children: row.children.map((cell) => ({ ...cell, type: "td" })),
              })),
            }
          : block,
      ),
    );
  });

  it("parses headings, task lists, ordered starts, quotes, images, tables", () => {
    const value = fromMarkdown(
      [
        "## Head",
        "",
        "- [x] done",
        "  - deep",
        "- [ ] open",
        "",
        "3. third",
        "4. fourth",
        "",
        "> quoted",
        "",
        "![alt text](https://example.com/a.png)",
        "",
        "| A | B |",
        "| - | - |",
        "| a | b |",
      ].join("\n"),
    );

    expect(value[0]).toEqual({ type: "h2", children: [{ text: "Head" }] });
    expect(value[1]).toEqual({
      type: "p",
      children: [{ text: "done" }],
      listStyleType: "todo",
      checked: true,
      indent: 0,
    });
    expect(value[2]).toEqual({
      type: "p",
      children: [{ text: "deep" }],
      listStyleType: "disc",
      indent: 1,
    });
    expect(value[4]).toEqual({
      type: "p",
      children: [{ text: "third" }],
      listStyleType: "decimal",
      indent: 0,
      listStart: 3,
    });
    expect(value[6]).toEqual({
      type: "blockquote",
      children: [{ type: "p", children: [{ text: "quoted" }] }],
    });
    expect(value[7]).toEqual({
      type: "img",
      url: "https://example.com/a.png",
      children: [{ text: "" }],
      caption: [{ text: "alt text" }],
    });
    expect(value[8]?.type).toBe("table");
  });

  it("unwraps links/strikethrough/inline code to plain text", () => {
    const value = fromMarkdown("a [link](https://x.dev) and ~~gone~~ and `code`");
    expect(value).toEqual([{ type: "p", children: [{ text: "a link and gone and code" }] }]);
  });

  it("normalizes an empty document to one empty paragraph", () => {
    expect(fromMarkdown("")).toEqual([{ type: "p", children: [{ text: "" }] }]);
  });
});
