"use client";

import { bytesToFileSize, type FileSize, PlaceholderPlugin } from "@platejs/media/react";
import type { Value } from "platejs";
import { KEYS } from "platejs";
import type { PlateEditor } from "platejs/react";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { useEffect } from "react";

import { plugins } from "./plugins";
import { type UploadConfig, UploadConfigProvider } from "./upload/upload-config";

export type { UploadConfig, UploadedFile, UploadFileFn } from "./upload/upload-config";
export type { PlateEditor };

export interface BlockEditorProps {
  initialValue?: Value;
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
  const editor = usePlateEditor({ plugins, value: initialValue });

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
        <Plate editor={editor} onChange={({ value }) => onValueChange?.(value)} readOnly={readOnly}>
          <PlateContent
            className="size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]"
            placeholder="Type your amazing content here..."
          />
        </Plate>
      </UploadConfigProvider>
    </div>
  );
};
