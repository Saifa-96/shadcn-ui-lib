import type { PluginConfig } from "platejs";
import {
    BlockquotePlugin,
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import {
  TablePlugin,
  TableRowPlugin,
  TableCellPlugin,
  TableCellHeaderPlugin,
} from "@platejs/table/react";
import { ParagraphPlugin } from "platejs/react";
import { ParagraphElement } from "./blocks/paragraph";
import { H1Element, H2Element, H3Element } from "./blocks/headers";
import { BlockquoteElement } from "./blocks/block-quote";
import {
  TableElement,
  TableRowElement,
  TableCellElement,
  TableCellHeaderElement,
} from "./blocks/table-node";
import { FloatingToolbarPlugin } from "./toolbar/floating-toolbar-plugin";
import { FixedToolbarPlugin } from "./toolbar/fixed-toolbar-plugin";
import { DndPlugins } from "./dnd";

export const plugins: PluginConfig[] = [
  // text
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,

  // paragraph
  ParagraphPlugin.withComponent(ParagraphElement),

  // header
  H1Plugin.withComponent(H1Element),
  H2Plugin.withComponent(H2Element),
  H3Plugin.withComponent(H3Element),

  // quote
  BlockquotePlugin.withComponent(BlockquoteElement),

  // table
  TablePlugin.configure({
    node: { component: TableElement },
    options: {
      initialTableWidth: 600,
      minColumnWidth: 48,
    },
  }),
  TableRowPlugin.withComponent(TableRowElement),
  TableCellPlugin.withComponent(TableCellElement),
  TableCellHeaderPlugin.withComponent(TableCellHeaderElement),

  // block interaction
  ...DndPlugins,

  // toolbar
  FixedToolbarPlugin,
  FloatingToolbarPlugin,
];
