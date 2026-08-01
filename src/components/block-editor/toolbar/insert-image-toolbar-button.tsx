"use client";

import * as React from "react";
import { ImageIcon } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef } from "platejs/react";

import { ImageUrlDialog } from "./image-url-dialog";
import { ToolbarButton } from "./toolbar";

/**
 * Toolbar button that inserts an image block from a URL.
 */
export function InsertImageToolbarButton() {
  const editor = useEditorRef();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <ToolbarButton tooltip="Insert Image" onClick={() => setDialogOpen(true)}>
        <ImageIcon />
      </ToolbarButton>

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
