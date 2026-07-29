import * as React from "react";
import { Plus } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef, useElement } from "platejs/react";
import { insertTable } from "@platejs/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INSERT_ITEMS = [
  { type: KEYS.p, label: "Paragraph" },
  { type: KEYS.h1, label: "Heading 1" },
  { type: KEYS.h2, label: "Heading 2" },
  { type: KEYS.h3, label: "Heading 3" },
  { type: KEYS.blockquote, label: "Blockquote" },
  { type: KEYS.table, label: "Table" },
];

interface InsertBlockButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function InsertBlockButton({ className, style }: InsertBlockButtonProps) {
  const editor = useEditorRef();
  const element = useElement();

  const handleInsert = (type: string) => {
    const path = editor.api.findPath(element);
    if (!path) return;

    if (type === KEYS.table) {
      const nextPath = [path[0]! + 1];
      editor.tf.select({ path: nextPath, offset: 0 });
      insertTable(editor, {});
      return;
    }

    const nextPath = [path[0]! + 1];
    editor.tf.insertNodes(
      { type, children: [{ text: "" }] },
      { at: nextPath, select: true }
    );
    editor.tf.focus();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className={className}
            style={style}
            data-plate-prevent-deselect
          />
        }
      >
        <Plus className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuGroup>
          {INSERT_ITEMS.map((item) => (
            <DropdownMenuItem
              key={item.type}
              onClick={() => handleInsert(item.type)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
