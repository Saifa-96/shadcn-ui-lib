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

const paragraphSchema = z.object({
  type: z.literal("p"),
  children: inlineChildrenSchema,
});

const headingSchema = z.object({
  type: z.enum(["h1", "h2", "h3"]),
  children: inlineChildrenSchema,
});

const blockquoteSchema = z.object({
  type: z.literal("blockquote"),
  children: z.array(paragraphSchema).min(1),
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
]);

// ─── Editor value (root) ─────────────────────────────────────────────────────

export const blockEditorValueSchema = z.array(blockSchema).min(1);

export type BlockEditorValue = z.infer<typeof blockEditorValueSchema>;
