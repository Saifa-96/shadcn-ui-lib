// biome-ignore-all lint: vendored plate-ui code, kept verbatim
"use client";

import { MessageSquareTextIcon } from "lucide-react";
import { useEditorRef } from "platejs/react";
import * as React from "react";
import { ToolbarButton } from "../toolbar/toolbar";
import { commentPlugin } from "./comment-kit";

export function CommentToolbarButton() {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      onClick={() => {
        editor.getTransforms(commentPlugin).comment.setDraft();
      }}
      data-plate-prevent-overlay
      tooltip="Comment"
    >
      <MessageSquareTextIcon />
    </ToolbarButton>
  );
}
