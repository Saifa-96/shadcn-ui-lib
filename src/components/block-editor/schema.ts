import { z } from "zod";

// ─── Text (leaf) ─────────────────────────────────────────────────────────────

const textNodeSchema = z.object({
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
});

// ─── Inline children (text only, no inline elements yet) ─────────────────────

const inlineChildrenSchema = z.array(textNodeSchema).min(1);

// ─── Block elements ──────────────────────────────────────────────────────────

const listFieldsSchema = z.object({
  listStyleType: z
    .enum([
      // unordered
      "disc",
      "circle",
      "square",
      // ordered
      "decimal",
      "lower-alpha",
      "upper-alpha",
      "lower-roman",
      "upper-roman",
      // todo
      "todo",
    ])
    .optional(),
  indent: z.number().int().min(0).optional(),
  listStart: z.number().int().min(1).optional(),
  checked: z.boolean().optional(),
});

const paragraphSchema = z
  .object({
    type: z.literal("p"),
    children: inlineChildrenSchema,
  })
  .merge(listFieldsSchema);

const headingSchema = z
  .object({
    type: z.enum(["h1", "h2", "h3"]),
    children: inlineChildrenSchema,
  })
  .merge(listFieldsSchema);

const blockquoteSchema = z.object({
  type: z.literal("blockquote"),
  children: z.array(paragraphSchema).min(1),
});

// ─── Image ───────────────────────────────────────────────────────────────────

const imageSchema = z.object({
  type: z.literal("img"),
  children: inlineChildrenSchema,
  url: z.string(),
  width: z.number().optional(),
  align: z.enum(["center", "left", "right"]).optional(),
  caption: inlineChildrenSchema.optional(),
  // fields carried by nodes produced from an upload placeholder
  initialWidth: z.number().optional(),
  initialHeight: z.number().optional(),
  isUpload: z.boolean().optional(),
  name: z.string().optional(),
  placeholderId: z.string().optional(),
});

// ─── Table ───────────────────────────────────────────────────────────────────

const tableCellBorderSchema = z.object({
  size: z.number().optional(),
  color: z.string().optional(),
  style: z.string().optional(),
});

const tableCellSchema = z.object({
  type: z.enum(["td", "th"]),
  children: z.array(paragraphSchema).min(1),
  colSpan: z.number().int().min(1).optional(),
  rowSpan: z.number().int().min(1).optional(),
  background: z.string().optional(),
  borders: z
    .object({
      top: tableCellBorderSchema.optional(),
      bottom: tableCellBorderSchema.optional(),
      left: tableCellBorderSchema.optional(),
      right: tableCellBorderSchema.optional(),
    })
    .optional(),
});

const tableRowSchema = z.object({
  type: z.literal("tr"),
  children: z.array(tableCellSchema).min(1),
  size: z.number().optional(),
});

const tableSchema = z.object({
  type: z.literal("table"),
  children: z.array(tableRowSchema).min(1),
  colSizes: z.array(z.number()).optional(),
  marginLeft: z.number().optional(),
});

// ─── Top-level block union ───────────────────────────────────────────────────

const blockSchema = z.discriminatedUnion("type", [
  paragraphSchema,
  headingSchema,
  blockquoteSchema,
  tableSchema,
  imageSchema,
]);

// ─── Editor value (root) ─────────────────────────────────────────────────────

export const blockEditorValueSchema = z.array(blockSchema).min(1);

export type BlockEditorValue = z.infer<typeof blockEditorValueSchema>;
