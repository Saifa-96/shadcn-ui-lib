"use client";

import { useEffect } from "react";
import type { Value } from "platejs";
import type { PlateEditor } from "platejs/react";

import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { plugins } from "./plugins";

export type { PlateEditor };

export interface BlockEditorProps {
  initialValue?: Value;
  onValueChange?: (v: Value) => void;
  onEditorReady?: (editor: PlateEditor) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = (props) => {
  const { initialValue, onValueChange, onEditorReady } = props;
  const editor = usePlateEditor({ plugins, value: initialValue });

  useEffect(() => {
    if (!editor) return;

    onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  return (
    <div className="relative isolate">
      <Plate editor={editor} onChange={({ value }) => onValueChange?.(value)}>
        <PlateContent
          style={{ padding: "16px 64px", minHeight: "100px" }}
          placeholder="Type your amazing content here..."
        />
      </Plate>
    </div>
  );
};
