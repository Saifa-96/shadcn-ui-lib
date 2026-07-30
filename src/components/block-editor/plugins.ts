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
import { IndentPlugin } from "@platejs/indent/react";
import {
  BulletedListRules,
  isOrderedList,
  OrderedListRules,
  TaskListRules,
} from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";
import {
  TablePlugin,
  TableRowPlugin,
  TableCellPlugin,
  TableCellHeaderPlugin,
} from "@platejs/table/react";
import { KEYS } from "platejs";
import { ParagraphPlugin } from "platejs/react";
import { BlockList } from "./blocks/list-node";
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

  // block interaction
  ...DndPlugins,

  // toolbar
  FixedToolbarPlugin,
  FloatingToolbarPlugin,
];
