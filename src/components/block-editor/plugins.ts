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
import { H1Element, H2Element, H3Element } from "./blocks/headers";
import { BlockquoteElement } from "./blocks/block-quote";
import { FloatingToolbarPlugin } from "./toolbar/floating-toolbar-plugin";
import { FixedToolbarPlugin } from "./toolbar/fixed-toolbar-plugin";
import { DndPlugins } from "./dnd";

export const plugins: PluginConfig[] = [
  // text
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,

  // header
  H1Plugin.withComponent(H1Element),
  H2Plugin.withComponent(H2Element),
  H3Plugin.withComponent(H3Element),

  // quote
  BlockquotePlugin.withComponent(BlockquoteElement),

  // block interaction
  ...DndPlugins,

  // toolbar
  FixedToolbarPlugin,
  FloatingToolbarPlugin,
];
