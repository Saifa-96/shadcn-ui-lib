"use client";

import { PlaceholderPlugin } from "@platejs/media/react";
import { ImageIcon, LinkIcon } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef } from "platejs/react";
import * as React from "react";
import { useFilePicker } from "use-file-picker";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUploadConfig } from "../upload/upload-config";
import { ImageUrlDialog } from "./image-url-dialog";
import {
  ToolbarSplitButton,
  ToolbarSplitButtonPrimary,
  ToolbarSplitButtonSecondary,
} from "./toolbar";

/**
 * Toolbar button that inserts an image block. Click uploads from the
 * computer; the dropdown also offers inserting via URL.
 */
export function InsertImageToolbarButton() {
  const editor = useEditorRef();
  const { accept } = useUploadConfig();
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { openFilePicker } = useFilePicker({
    accept,
    multiple: true,
    onFilesSelected: ({ plainFiles: updatedFiles }) => {
      editor.getTransforms(PlaceholderPlugin).insert.media(updatedFiles);
    },
  });

  return (
    <>
      <ToolbarSplitButton
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        pressed={open}
      >
        <ToolbarSplitButtonPrimary onClick={() => openFilePicker()}>
          <ImageIcon className="size-4" />
        </ToolbarSplitButtonPrimary>

        <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
          <DropdownMenuTrigger nativeButton={false} render={<ToolbarSplitButtonSecondary />} />

          <DropdownMenuContent
            className="w-auto!"
            onClick={(e) => e.stopPropagation()}
            align="start"
            alignOffset={-32}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openFilePicker()}>
                <ImageIcon className="size-4" />
                Upload from computer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                <LinkIcon />
                Insert via URL
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolbarSplitButton>

      <ImageUrlDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(url) =>
          editor.tf.insertNodes({
            children: [{ text: "" }],
            type: KEYS.img,
            url,
          })
        }
      />
    </>
  );
}
