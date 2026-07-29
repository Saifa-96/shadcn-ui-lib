"use client";

import { useState } from "react";
import type { Value } from "platejs";

import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { Skeleton } from "@/components/ui/skeleton";
import { plugins } from "./plugins";

export interface BlockEditorProps {
  initialValue?: Value;
  onValueChange?: (v: Value) => void;
  onEditorReady?: (editor: ReturnType<typeof usePlateEditor>) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = (props) => {
  const { initialValue, onValueChange, onEditorReady } = props;
  const [ready, setReady] = useState(false);

  const editor = usePlateEditor({
    plugins,
    value: initialValue,
    onReady: ({ editor }) => {
      setReady(true);
      onEditorReady?.(editor);
    },
  });

  if (!ready) {
    return (
      <div className="space-y-3" style={{ padding: "16px 64px" }}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <Plate editor={editor} onChange={({ value }) => onValueChange?.(value)}>
      <PlateContent
        style={{ padding: "16px 64px", minHeight: "100px" }}
        placeholder="Type your amazing content here..."
      />
    </Plate>
  );
};
