/**
 * Markdown helpers for the block editor: convert between the editor value
 * ({@link BlockEditorValue}) and markdown strings, via the mdast AST
 * (remark + remark-gfm for tables / task lists).
 *
 * The mapping is bounded by what GFM can express — these value features are
 * lossy in markdown and documented per-direction:
 *
 * value → markdown: `underline` marks (GFM has none), img `width`/`align`,
 * list marker variants beyond bullet/decimal (circle, square, alpha, roman),
 * `th` cells (GFM tables carry no header distinction), suggestion/comment
 * marks (editing-layer data, not content).
 *
 * markdown → value: links, strikethrough and inline code unwrap to plain
 * text (the value schema has no inline elements for them), thematic breaks
 * and raw HTML blocks are dropped, table column alignment is dropped.
 *
 * `img.alt` maps to the img block's `caption` (one string, both roles).
 */

import type {
  BlockContent,
  List,
  ListItem,
  PhrasingContent,
  Root,
  RootContent,
  Table,
} from "mdast";
import { remark } from "remark";
import remarkGfm from "remark-gfm";

import type { BlockEditorValue, InlineText } from "./schema";

/** Text leaf of the editor value — schema's own {@link InlineText}. */

/** Any block of the editor value (discriminated on `type`). */
type ValueBlock = BlockEditorValue[number];

/** List-carrier blocks: paragraphs and headings share the inline + list shape. */
type InlineBlock = Exclude<ValueBlock, { type: "table" | "img" | "blockquote" }>;

/** Blocks that can appear inside a table cell or blockquote (schema). */
type ContainerBlock = Exclude<ValueBlock, { type: "table" | "img" }>;

type HeadingType = Extract<InlineBlock["type"], `h${number}`>;

const HEADING_DEPTH: Record<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", 1 | 2 | 3 | 4 | 5 | 6> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

const HEADING_TYPE: Record<1 | 2 | 3 | 4 | 5 | 6, HeadingType> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const ORDERED_STYLES = ["decimal", "lower-alpha", "upper-alpha", "lower-roman", "upper-roman"];

const READER = remark().use(remarkGfm);
const WRITER = remark().use(remarkGfm);

/**
 * Serialize an editor value to a markdown string.
 */
export function toMarkdown(value: BlockEditorValue): string {
  const root: Root = { type: "root", children: blocksToMdast(value) };
  return WRITER.stringify(root).trimEnd();
}

/**
 * Parse a markdown string into an editor value. Unknown constructs unwrap
 * or drop as documented on this module.
 */
export function fromMarkdown(markdown: string): BlockEditorValue {
  const root = READER.parse(markdown);
  return mdastToBlocks(root.children);
}

// ─── value → mdast ───────────────────────────────────────────────────────────

function blocksToMdast(blocks: BlockEditorValue): BlockContent[] {
  const out: BlockContent[] = [];
  // Open list at each indent level: level i nests inside the last item of
  // level i-1 (Plate's flat indent model → nested mdast lists). Any
  // non-list block flushes the stack.
  let lists: List[] = [];

  for (const block of blocks) {
    if (block.type === "table" || block.type === "img" || block.type === "blockquote") {
      lists = [];
      if (block.type === "table") out.push(tableToMdast(block));
      else if (block.type === "img") out.push(imgToMdast(block));
      else out.push(blockquoteToMdast(block));
      continue;
    }
    // paragraphs and headings carry the list fields
    if (!block.listStyleType) {
      lists = [];
      out.push(inlineBlockToMdast(block));
      continue;
    }
    // list item: close levels deeper than this indent, clamping indents
    // that jump past a missing parent level
    const level = Math.min(block.indent ?? 0, lists.length);
    lists.length = Math.min(lists.length, level + 1);
    // a marker-kind change (ordered vs unordered) must start a new list —
    // GFM cannot mix both in one list
    const ordered = ORDERED_STYLES.includes(block.listStyleType);
    if (lists[level] && lists[level].ordered !== ordered) {
      lists.length = level;
    }
    let list = lists[level];
    if (!list) {
      list = newList(block);
      if (level === 0) {
        out.push(list);
      } else {
        const parentItems = lists[level - 1]?.children ?? [];
        const last = parentItems[parentItems.length - 1];
        if (last) last.children.push(list);
        else parentItems.push({ type: "listItem", children: [list] });
      }
      lists.push(list);
    }
    const content = inlineBlockToMdast(block);
    const item: ListItem = { type: "listItem", children: [content] };
    if (block.listStyleType === "todo") {
      // GFM task lists: an unbracketed item still serializes as [ ]
      item.checked = block.checked ?? false;
    }
    list.children.push(item);
  }
  return out;
}

function newList(block: InlineBlock): List {
  const ordered = ORDERED_STYLES.includes(block.listStyleType ?? "");
  return {
    type: "list",
    ordered,
    children: [],
    ...(ordered && block.listStart && block.listStart > 1 ? { start: block.listStart } : {}),
  };
}

function inlineBlockToMdast(block: InlineBlock): BlockContent {
  const children = inlineToMdast(block.children);
  if (block.type === "p") {
    return { type: "paragraph", children };
  }
  return { type: "heading", depth: HEADING_DEPTH[block.type], children };
}

function blockquoteToMdast(block: Extract<ValueBlock, { type: "blockquote" }>): BlockContent {
  return { type: "blockquote", children: blocksToMdast(block.children) };
}

function imgToMdast(block: Extract<ValueBlock, { type: "img" }>): BlockContent {
  return {
    type: "paragraph",
    children: [
      { type: "image", url: block.url, alt: inlineText(block.caption ?? []), title: null },
    ],
  };
}

function tableToMdast(block: Extract<ValueBlock, { type: "table" }>): Table {
  return {
    type: "table",
    align: null,
    children: block.children.map((row) => ({
      type: "tableRow",
      children: row.children.map((cell) => ({
        type: "tableCell",
        children: inlineToMdast(cell.children.flatMap(blockInline)),
      })),
    })),
  };
}

/** Inline nodes of a cell/quote child, unwrapping nested blockquotes. */
function blockInline(block: ContainerBlock): InlineText[] {
  if (block.type === "blockquote")
    return block.children.filter(isContainerBlock).flatMap(blockInline);
  return block.children;
}

/** Table/img blocks cannot nest in blockquotes or cells (schema). */
function isContainerBlock(block: ValueBlock): block is ContainerBlock {
  return block.type !== "table" && block.type !== "img";
}

function inlineToMdast(nodes: InlineText[]): PhrasingContent[] {
  const out: PhrasingContent[] = [];
  for (const node of nodes) {
    if (node.text.includes("\n")) {
      const parts = node.text.split("\n");
      parts.forEach((part, i) => {
        if (part) pushStyled(out, node, part);
        if (i < parts.length - 1) out.push({ type: "break" });
      });
      continue;
    }
    if (node.text) pushStyled(out, node, node.text);
  }
  return out;
}

function pushStyled(out: PhrasingContent[], node: InlineText, text: string): void {
  let leaf: PhrasingContent = { type: "text", value: text };
  // underline has no GFM representation — dropped (module docs)
  if (node.italic) leaf = { type: "emphasis", children: [leaf] };
  if (node.bold) leaf = { type: "strong", children: [leaf] };
  out.push(leaf);
}

function inlineText(nodes: InlineText[]): string {
  return nodes.map((n) => n.text).join("");
}

// ─── mdast → value ───────────────────────────────────────────────────────────

function mdastToBlocks(nodes: readonly RootContent[]): BlockEditorValue {
  const out: ValueBlock[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case "heading":
        out.push({
          type: HEADING_TYPE[node.depth],
          children: mdastToInline(node.children),
        });
        break;
      case "paragraph": {
        const image = standaloneImage(node);
        if (image) {
          out.push(image);
          break;
        }
        out.push({ type: "p", children: mdastToInline(node.children) });
        break;
      }
      case "blockquote":
        out.push({
          type: "blockquote",
          children: mdastToBlocks(node.children).filter(isContainerBlock),
        });
        break;
      case "list":
        mdastListToBlocks(node, 0, out);
        break;
      case "table":
        out.push(tableToValue(node));
        break;
      default:
        // code, thematicBreak, html: dropped (module docs)
        break;
    }
  }
  const emptyChildren: InlineText[] = [{ text: "" }];
  return out.length > 0 ? out : [{ type: "p", children: emptyChildren }];
}

function mdastListToBlocks(list: List, indent: number, out: ValueBlock[]): void {
  const style: ListStyle = list.ordered ? "decimal" : "disc";
  list.children.forEach((item, itemIndex) => {
    for (const child of item.children) {
      if (child.type === "list") {
        mdastListToBlocks(child, indent + 1, out);
        continue;
      }
      if (child.type === "paragraph" || child.type === "heading") {
        const children = mdastToInline(child.children);
        if (child.type === "paragraph") {
          out.push(listedBlock({ type: "p", children }, list, item, style, indent, itemIndex));
        } else {
          out.push(
            listedBlock(
              { type: HEADING_TYPE[child.depth], children },
              list,
              item,
              style,
              indent,
              itemIndex,
            ),
          );
        }
      }
    }
  });
}

/** List marker styles accepted by the value schema. */
type ListStyle = NonNullable<InlineBlock["listStyleType"]>;

function listedBlock(
  base: { type: InlineBlock["type"]; children: InlineText[] },
  list: List,
  item: ListItem,
  style: ListStyle,
  indent: number,
  itemIndex: number,
): ValueBlock {
  // mdast listItem.checked is tri-state: true/false inside task lists,
  // null when the list has no task items at all
  const checked = item.checked ?? undefined;
  const isTask = checked !== undefined;
  const listStyleType: ListStyle = isTask ? "todo" : style;
  const listStart =
    list.ordered && list.start && list.start > 1 && itemIndex === 0 ? list.start : undefined;
  if (base.type === "p") {
    return { type: "p", children: base.children, listStyleType, indent, checked, listStart };
  }
  return { type: base.type, children: base.children, listStyleType, indent, checked, listStart };
}

function tableToValue(node: Table): ValueBlock {
  return {
    type: "table",
    children: node.children.map((row) => ({
      type: "tr",
      children: row.children.map((cell) => ({
        // GFM cells carry no th/td distinction — always td (module docs)
        type: "td",
        children: [{ type: "p", children: mdastToInline(cell.children) }],
      })),
    })),
  };
}

function standaloneImage(node: Extract<BlockContent, { type: "paragraph" }>): ValueBlock | null {
  const only = node.children.length === 1 ? node.children[0] : undefined;
  if (only?.type !== "image") return null;
  const image = only;
  const children: InlineText[] = [{ text: "" }];
  const caption: InlineText[] | undefined = image.alt ? [{ text: image.alt }] : undefined;
  return {
    type: "img",
    url: image.url,
    children,
    caption,
  };
}

function mdastToInline(nodes: readonly PhrasingContent[]): InlineText[] {
  const out: InlineText[] = [];
  type Marks = { bold?: boolean; italic?: boolean; underline?: boolean };
  const walk = (children: readonly PhrasingContent[], marks: Marks): void => {
    for (const node of children) {
      switch (node.type) {
        case "text":
          pushInline(out, { ...marks, text: node.value });
          break;
        case "strong":
          walk(node.children, { ...marks, bold: true });
          break;
        case "emphasis":
          walk(node.children, { ...marks, italic: true });
          break;
        case "inlineCode":
          pushInline(out, { ...marks, text: node.value });
          break;
        case "break":
          pushInline(out, { ...marks, text: "\n" });
          break;
        case "delete":
        case "link":
        case "linkReference":
          walk(node.children, marks); // unwrapped (module docs)
          break;
        case "image":
        case "imageReference":
          if (node.alt) pushInline(out, { ...marks, text: node.alt });
          break;
        default:
          break; // inline html etc. — dropped
      }
    }
  };
  walk(nodes, {});
  return mergeInline(out);
}

function pushInline(out: InlineText[], node: InlineText): void {
  if (node.text) out.push(node);
}

function mergeInline(nodes: InlineText[]): InlineText[] {
  const out: InlineText[] = [];
  for (const node of nodes) {
    const last = out[out.length - 1];
    if (
      last &&
      last.bold === node.bold &&
      last.italic === node.italic &&
      last.underline === node.underline
    ) {
      last.text += node.text;
    } else {
      out.push({ ...node });
    }
  }
  return out;
}
