// biome-ignore-all lint: vendored plate-ui code, kept verbatim
"use client";

import { SuggestionPlugin } from "@platejs/suggestion/react";
import { PencilLineIcon } from "lucide-react";
import { useEditorPlugin, usePluginOption } from "platejs/react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { ToolbarButton } from "../toolbar/toolbar";

export function SuggestionToolbarButton() {
  const { setOption } = useEditorPlugin(SuggestionPlugin);
  const isSuggesting = usePluginOption(SuggestionPlugin, "isSuggesting");

  return (
    <ToolbarButton
      className={cn(isSuggesting && "text-brand/80 hover:text-brand/80")}
      onClick={() => setOption("isSuggesting", !isSuggesting)}
      onMouseDown={(e) => e.preventDefault()}
      tooltip={isSuggesting ? "Turn off suggesting" : "Suggestion edits"}
    >
      <PencilLineIcon />
    </ToolbarButton>
  );
}
