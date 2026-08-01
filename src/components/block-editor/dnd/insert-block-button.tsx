import { ListStyleType } from "@platejs/list";
import { insertTable } from "@platejs/table";
import { Plus } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef, useElement } from "platejs/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ImageUrlDialog } from "../toolbar/image-url-dialog";

const INSERT_ITEMS = [
  { type: KEYS.p, label: "Paragraph" },
  { type: KEYS.h1, label: "Heading 1" },
  { type: KEYS.h2, label: "Heading 2" },
  { type: KEYS.h3, label: "Heading 3" },
  { type: KEYS.blockquote, label: "Blockquote" },
  { type: KEYS.p, label: "Bulleted List", listStyleType: ListStyleType.Disc },
  { type: KEYS.p, label: "Numbered List", listStyleType: ListStyleType.Decimal },
  { type: KEYS.p, label: "Todo List", listStyleType: "todo", checked: false },
  { type: KEYS.table, label: "Table" },
  { type: KEYS.img, label: "Image" },
];

interface InsertBlockButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function InsertBlockButton({ className, style }: InsertBlockButtonProps) {
  const editor = useEditorRef();
  const element = useElement();

  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);

  const findNextPath = () => {
    const path = editor.api.findPath(element);
    const index = path?.[0];
    if (index === undefined) return;
    return [index + 1];
  };

  const handleInsert = (item: (typeof INSERT_ITEMS)[number]) => {
    if (item.type === KEYS.img) {
      setImageDialogOpen(true);
      return;
    }

    const nextPath = findNextPath();
    if (!nextPath) return;

    if (item.type === KEYS.table) {
      editor.tf.select({ path: nextPath, offset: 0 });
      insertTable(editor, {});
      return;
    }

    editor.tf.insertNodes(
      {
        type: item.type,
        children: [{ text: "" }],
        ...("listStyleType" in item && { listStyleType: item.listStyleType, indent: 1 }),
        ...("checked" in item && { checked: item.checked }),
      },
      { at: nextPath, select: true },
    );
    editor.tf.focus();
  };

  const handleImageSubmit = (url: string) => {
    const nextPath = findNextPath();
    if (!nextPath) return;

    editor.tf.insertNodes(
      { type: KEYS.img, url, children: [{ text: "" }] },
      { at: nextPath, select: true },
    );
    editor.tf.focus();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className={className} style={style} data-plate-prevent-deselect />
        }
      >
        <Plus className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuGroup>
          {INSERT_ITEMS.map((item) => (
            <DropdownMenuItem key={item.label} onClick={() => handleInsert(item)}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <ImageUrlDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onSubmit={handleImageSubmit}
      />
    </DropdownMenu>
  );
}
