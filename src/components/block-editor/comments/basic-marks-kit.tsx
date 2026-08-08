import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from "@platejs/basic-nodes/react";

/**
 * Marks used by the comment reply editor (the comment plugin renders its own
 * sub-editor for composing replies).
 */
export const BasicMarksKit = [BoldPlugin, ItalicPlugin, UnderlinePlugin];
