"use client";

import { bytesToFileSize, type FileSize, PlaceholderPlugin } from "@platejs/media/react";
import type { Value } from "platejs";
import { KEYS } from "platejs";
import type { PlateEditor } from "platejs/react";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { useEffect, useRef } from "react";

import { plugins } from "./plugins";
import { type UploadConfig, UploadConfigProvider } from "./upload/upload-config";

export type { UploadConfig, UploadedFile, UploadFileFn } from "./upload/upload-config";
export type { PlateEditor };

export interface BlockEditorProps {
  initialValue?: Value;
  /**
   * Called with the document value on content changes (selection-only moves
   * do not fire it), and only after initialization completes: plate's init
   * pipeline (e.g. node id minting) mutates the document before the editor
   * is ready, and those init-time changes are never emitted.
   */
  onValueChange?: (v: Value) => void;
  onEditorReady?: (editor: PlateEditor) => void;
  /**
   * Whether the editor is read-only. When true, content is not editable and
   * all interactive controls (toolbars, drag handles, table controls) hide.
   */
  readOnly?: boolean;
  /**
   * Upload configuration. Required: image uploads (picker, paste, drop) are
   * always enabled. Pass a stable reference (module const or memoized) to
   * avoid re-syncing plugin options on every render.
   */
  uploadConfig: UploadConfig;
}

export const BlockEditor: React.FC<BlockEditorProps> = (props) => {
  const { initialValue, onValueChange, onEditorReady, readOnly, uploadConfig } = props;
  const initReadyRef = useRef(false);
  const editor = usePlateEditor({
    plugins,
    value: initialValue,
    onReady: () => {
      // gate opens only after plate's init pipeline (value load + id minting)
      initReadyRef.current = true;
    },
  });

  useEffect(() => {
    if (!editor) return;

    onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    editor.setOption(PlaceholderPlugin, "uploadConfig", {
      image: {
        // plate's FileSize type only admits power-of-two literals, but the
        // runtime parser accepts any integer — bytesToFileSize output is safe.
        maxFileSize: bytesToFileSize(uploadConfig.maxSize) as FileSize,
        mediaType: KEYS.img,
      },
    });
  }, [editor, uploadConfig]);

  return (
    <div className="relative isolate">
      <UploadConfigProvider config={uploadConfig}>
        <Plate
          editor={editor}
          onValueChange={({ value }) => {
            if (!initReadyRef.current) return;
            onValueChange?.(value);
          }}
          readOnly={readOnly}
        >
          <PlateContent
            className="size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]"
            placeholder="Type your amazing content here..."
          />
        </Plate>
      </UploadConfigProvider>
    </div>
  );
};
