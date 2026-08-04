import {
  BlockquoteRules,
  BoldRules,
  HeadingRules,
  ItalicRules,
  MarkComboRules,
  UnderlineRules,
} from "@platejs/basic-nodes";
import {
  BlockquotePlugin,
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  H5Plugin,
  H6Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { CaptionPlugin } from "@platejs/caption/react";
import { IndentPlugin } from "@platejs/indent/react";
import { BulletedListRules, isOrderedList, OrderedListRules, TaskListRules } from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";
import { ImagePlugin, PlaceholderPlugin } from "@platejs/media/react";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@platejs/table/react";
import type { PluginConfig } from "platejs";
import { ExitBreakPlugin, KEYS } from "platejs";
import { ParagraphPlugin } from "platejs/react";
import { BlockquoteElement } from "./blocks/block-quote";
import { H1Element, H2Element, H3Element, H4Element, H5Element, H6Element } from "./blocks/headers";
import { ImageElement } from "./blocks/image-node";
import { BlockList } from "./blocks/list-node";
import { PlaceholderElement } from "./blocks/media-placeholder-node";
import { ParagraphElement } from "./blocks/paragraph";
import {
  TableCellElement,
  TableCellHeaderElement,
  TableElement,
  TableRowElement,
} from "./blocks/table-node";
import { DndPlugins } from "./dnd";
import { FixedToolbarPlugin } from "./toolbar/fixed-toolbar-plugin";
import { FloatingToolbarPlugin } from "./toolbar/floating-toolbar-plugin";
import { MediaUploadToast } from "./upload/media-upload-toast";

export const plugins: PluginConfig[] = [
  // text
  BoldPlugin.configure({
    inputRules: [
      BoldRules.markdown({ variant: "*" }),
      BoldRules.markdown({ variant: "_" }),
      MarkComboRules.markdown({ variant: "boldItalic" }),
      MarkComboRules.markdown({ variant: "boldUnderline" }),
      MarkComboRules.markdown({ variant: "boldItalicUnderline" }),
      MarkComboRules.markdown({ variant: "italicUnderline" }),
    ],
  }),
  ItalicPlugin.configure({
    inputRules: [ItalicRules.markdown({ variant: "*" }), ItalicRules.markdown({ variant: "_" })],
  }),
  UnderlinePlugin.configure({
    inputRules: [UnderlineRules.markdown()],
  }),

  // paragraph
  ParagraphPlugin.withComponent(ParagraphElement),

  // header
  H1Plugin.configure({
    inputRules: [HeadingRules.markdown()],
    node: { component: H1Element },
    rules: { break: { empty: "reset" } },
    shortcuts: { toggle: { keys: "mod+alt+1" } },
  }),
  H2Plugin.configure({
    inputRules: [HeadingRules.markdown()],
    node: { component: H2Element },
    rules: { break: { empty: "reset" } },
    shortcuts: { toggle: { keys: "mod+alt+2" } },
  }),
  H3Plugin.configure({
    inputRules: [HeadingRules.markdown()],
    node: { component: H3Element },
    rules: { break: { empty: "reset" } },
    shortcuts: { toggle: { keys: "mod+alt+3" } },
  }),
  H4Plugin.configure({
    inputRules: [HeadingRules.markdown()],
    node: { component: H4Element },
    rules: { break: { empty: "reset" } },
    shortcuts: { toggle: { keys: "mod+alt+4" } },
  }),
  H5Plugin.configure({
    inputRules: [HeadingRules.markdown()],
    node: { component: H5Element },
    rules: { break: { empty: "reset" } },
    shortcuts: { toggle: { keys: "mod+alt+5" } },
  }),
  H6Plugin.configure({
    inputRules: [HeadingRules.markdown()],
    node: { component: H6Element },
    rules: { break: { empty: "reset" } },
    shortcuts: { toggle: { keys: "mod+alt+6" } },
  }),

  // quote
  BlockquotePlugin.configure({
    inputRules: [BlockquoteRules.markdown()],
    node: { component: BlockquoteElement },
    shortcuts: { toggle: { keys: "mod+shift+period" } },
  }),

  // indent
  IndentPlugin.configure({
    inject: {
      targetPlugins: [...KEYS.heading, KEYS.p, KEYS.blockquote],
    },
    options: {
      offset: 24,
    },
  }),

  // list
  ListPlugin.configure({
    inputRules: [
      BulletedListRules.markdown({ variant: "-" }),
      BulletedListRules.markdown({ variant: "*" }),
      OrderedListRules.markdown({ variant: "." }),
      OrderedListRules.markdown({ variant: ")" }),
      TaskListRules.markdown({ checked: false }),
      TaskListRules.markdown({ checked: true }),
    ],
    inject: {
      nodeProps: {
        nodeKey: KEYS.listType,
        query: ({ nodeProps }) => {
          const element = nodeProps.element;
          return !!element?.listStyleType && !isOrderedList(element);
        },
        transformProps: ({ props }) => ({
          ...props,
          role: "listitem",
          style: {
            ...props.style,
            display: "list-item",
          },
        }),
      },
      targetPlugins: [...KEYS.heading, KEYS.p, KEYS.blockquote],
    },
    render: {
      belowNodes: BlockList,
    },
  }),

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

  // image
  ImagePlugin.configure({
    options: { disableUploadInsert: true },
    render: { node: ImageElement },
  }),
  CaptionPlugin.configure({
    options: {
      query: {
        allow: [KEYS.img],
      },
    },
  }),

  // upload placeholder
  PlaceholderPlugin.configure({
    options: { disableEmptyPlaceholder: true },
    render: { afterEditable: MediaUploadToast, node: PlaceholderElement },
  }),

  // block interaction
  ...DndPlugins,

  // editing
  ExitBreakPlugin.configure({
    shortcuts: {
      insert: { keys: "mod+enter" },
      insertBefore: { keys: "mod+shift+enter" },
    },
  }),

  // toolbar
  FixedToolbarPlugin,
  FloatingToolbarPlugin,
];
