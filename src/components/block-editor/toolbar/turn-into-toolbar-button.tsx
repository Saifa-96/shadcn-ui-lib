"use client";

import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
  QuoteIcon,
  SquareIcon,
} from "lucide-react";

import type { NodeEntry, TElement } from "platejs";
import { KEYS } from "platejs";
import { useEditorRef, useSelectionFragmentProp } from "platejs/react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ToolbarButton, ToolbarMenuGroup } from "./toolbar";

interface TurnIntoItem {
  icon: React.ReactNode;
  keywords: string[];
  label: string;
  value: string;
}

const turnIntoItems: [TurnIntoItem, ...TurnIntoItem[]] = [
  { icon: <PilcrowIcon />, keywords: ["paragraph"], label: "Text", value: KEYS.p },
  { icon: <Heading1Icon />, keywords: ["title", "h1"], label: "Heading 1", value: "h1" },
  { icon: <Heading2Icon />, keywords: ["subtitle", "h2"], label: "Heading 2", value: "h2" },
  { icon: <Heading3Icon />, keywords: ["subtitle", "h3"], label: "Heading 3", value: "h3" },
  { icon: <Heading4Icon />, keywords: ["subtitle", "h4"], label: "Heading 4", value: "h4" },
  { icon: <Heading5Icon />, keywords: ["subtitle", "h5"], label: "Heading 5", value: "h5" },
  { icon: <Heading6Icon />, keywords: ["subtitle", "h6"], label: "Heading 6", value: "h6" },
  {
    icon: <ListIcon />,
    keywords: ["unordered", "ul", "-"],
    label: "Bulleted list",
    value: KEYS.ul,
  },
  {
    icon: <ListOrderedIcon />,
    keywords: ["ordered", "ol", "1"],
    label: "Numbered list",
    value: KEYS.ol,
  },
  {
    icon: <SquareIcon />,
    keywords: ["checklist", "task", "checkbox", "[]"],
    label: "To-do list",
    value: KEYS.listTodo,
  },
  {
    icon: <QuoteIcon />,
    keywords: ["citation", "blockquote", ">"],
    label: "Quote",
    value: KEYS.blockquote,
  },
];

export function TurnIntoToolbarButton(props: React.ComponentProps<typeof DropdownMenu>) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const value = useSelectionFragmentProp({
    defaultValue: KEYS.p,
    getProp: (node) => getBlockType(node as TElement),
  });
  const selectedItem =
    turnIntoItems.find((item) => item.value === (value ?? KEYS.p)) ?? turnIntoItems[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger
        render={
          <ToolbarButton className="min-w-[125px]" pressed={open} tooltip="Turn into" isDropdown>
            {selectedItem.label}
          </ToolbarButton>
        }
      />

      <DropdownMenuContent className="ignore-click-outside/toolbar min-w-0" align="start">
        <ToolbarMenuGroup
          label="Turn into"
          onValueChange={(type) => {
            setBlockType(editor, type);
            editor.tf.focus();
          }}
          value={value}
        >
          {turnIntoItems.map(({ icon, label, value: itemValue }) => (
            <DropdownMenuRadioItem className="min-w-[180px]" key={itemValue} value={itemValue}>
              {icon}
              {label}
            </DropdownMenuRadioItem>
          ))}
        </ToolbarMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getBlockType(block: TElement): string {
  if (block[KEYS.listType]) {
    if (block[KEYS.listType] === KEYS.ol) return KEYS.ol;
    if (block[KEYS.listType] === KEYS.listTodo) return KEYS.listTodo;
    return KEYS.ul;
  }

  return block.type as string;
}

function setBlockType(editor: ReturnType<typeof useEditorRef>, type: string) {
  editor.tf.withoutNormalizing(() => {
    if (type === KEYS.blockquote) {
      const target = editor.selection;

      if (!target || editor.api.some({ at: target, match: { type } })) return;

      editor.tf.toggleBlock(type, { wrap: true });
      return;
    }

    const setEntry = (entry: NodeEntry<TElement>) => {
      const [node, path] = entry;

      if (node[KEYS.listType]) {
        editor.tf.unsetNodes([KEYS.listType, "indent"], { at: path });
      }
      if (type === KEYS.ul || type === KEYS.ol || type === KEYS.listTodo) {
        editor.tf.setNodes(editor.api.create.block({ indent: 1, listStyleType: type }), {
          at: path,
        });
        return;
      }
      if (node.type !== type) {
        editor.tf.setNodes({ type }, { at: path });
      }
    };

    const entries = editor.api.blocks({ mode: "lowest" });
    for (const entry of entries) {
      setEntry(entry);
    }
  });
}
