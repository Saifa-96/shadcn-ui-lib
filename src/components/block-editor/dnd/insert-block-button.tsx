import { ListStyleType } from "@platejs/list";
import { PlaceholderPlugin } from "@platejs/media/react";
import { insertTable } from "@platejs/table";
import { Plus } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef, useElement } from "platejs/react";
import * as React from "react";
import { useFilePicker } from "use-file-picker";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ImageUrlDialog } from "../toolbar/image-url-dialog";
import { useUploadConfig } from "../upload/upload-config";

const BLOCK_ITEMS = [
  { type: KEYS.p, label: "Paragraph" },
  { type: KEYS.blockquote, label: "Blockquote" },
];

const HEADING_ITEMS = [
  { type: KEYS.h1, label: "Heading 1" },
  { type: KEYS.h2, label: "Heading 2" },
  { type: KEYS.h3, label: "Heading 3" },
  { type: KEYS.h4, label: "Heading 4" },
  { type: KEYS.h5, label: "Heading 5" },
  { type: KEYS.h6, label: "Heading 6" },
];

const LIST_ITEMS = [
  { label: "Bulleted List", listStyleType: ListStyleType.Disc },
  { label: "Numbered List", listStyleType: ListStyleType.Decimal },
  { label: "Todo List", listStyleType: "todo", checked: false },
];

interface InsertBlockButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function InsertBlockButton({ className, style }: InsertBlockButtonProps) {
  const editor = useEditorRef();
  const element = useElement();
  const { accept } = useUploadConfig();

  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);

  const findNextPath = () => {
    const path = editor.api.findPath(element);
    const index = path?.[0];
    if (index === undefined) return;
    return [index + 1];
  };

  const handleInsertBlock = (type: string) => {
    const nextPath = findNextPath();
    if (!nextPath) return;

    if (type === KEYS.table) {
      editor.tf.select({ path: nextPath, offset: 0 });
      insertTable(editor, {});
      return;
    }

    editor.tf.insertNodes({ type, children: [{ text: "" }] }, { at: nextPath, select: true });
    editor.tf.focus();
  };

  const handleInsertList = (item: (typeof LIST_ITEMS)[number]) => {
    const nextPath = findNextPath();
    if (!nextPath) return;

    editor.tf.insertNodes(
      {
        type: KEYS.p,
        children: [{ text: "" }],
        listStyleType: item.listStyleType,
        indent: 1,
        ...("checked" in item && { checked: item.checked }),
      },
      { at: nextPath, select: true },
    );
    editor.tf.focus();
  };

  const { openFilePicker } = useFilePicker({
    accept,
    multiple: true,
    onFilesSelected: ({ plainFiles }) => {
      const nextPath = findNextPath();
      if (!nextPath) return;

      editor.getTransforms(PlaceholderPlugin).insert.media(plainFiles, { at: nextPath });
    },
  });

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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={className} style={style} data-plate-prevent-deselect>
          <Plus className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuGroup>
          {BLOCK_ITEMS.map((item) => (
            <DropdownMenuItem key={item.label} onClick={() => handleInsertBlock(item.type)}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Heading</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {HEADING_ITEMS.map((item) => (
              <DropdownMenuItem key={item.label} onClick={() => handleInsertBlock(item.type)}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>List</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {LIST_ITEMS.map((item) => (
              <DropdownMenuItem key={item.label} onClick={() => handleInsertList(item)}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleInsertBlock(KEYS.table)}>Table</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Image</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => openFilePicker()}>
              Upload from computer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
              Insert via URL
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>

      <ImageUrlDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onSubmit={handleImageSubmit}
      />
    </DropdownMenu>
  );
}
