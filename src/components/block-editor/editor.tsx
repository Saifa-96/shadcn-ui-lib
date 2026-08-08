"use client";

import { bytesToFileSize, type FileSize, PlaceholderPlugin } from "@platejs/media/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { Value } from "platejs";
import { KEYS } from "platejs";
import type { PlateContentProps, PlateEditor, PlateViewProps } from "platejs/react";
import { Plate, PlateContainer, PlateContent, PlateView } from "platejs/react";
import type * as React from "react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { type UploadConfig, UploadConfigProvider } from "./upload/upload-config";

export type { UploadConfig, UploadedFile, UploadFileFn } from "./upload/upload-config";
export type { PlateEditor };

export interface BlockEditorProps {
  /** Editor instance from {@link useBlockEditor}. */
  editor: PlateEditor;
  onValueChange?: (v: Value) => void;
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

export const BlockEditor: React.FC<BlockEditorProps> = ({ editor, onValueChange, readOnly, uploadConfig }) => {
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
          onChange={({ value }) => onValueChange?.(value)}
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

const editorContainerVariants = cva(
  "relative w-full cursor-text select-text overflow-y-auto caret-primary selection:bg-brand/25 focus-visible:outline-none [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        comment: cn(
          "flex flex-wrap justify-between gap-1 px-1 py-0.5 text-sm",
          "rounded-md border-[1.5px] border-transparent bg-transparent",
          "has-[[data-slate-editor]:focus]:border-brand/50 has-[[data-slate-editor]:focus]:ring-2 has-[[data-slate-editor]:focus]:ring-brand/30",
          "has-aria-disabled:border-input has-aria-disabled:bg-muted",
        ),
        default: "h-full",
        demo: "h-[650px]",
        select: cn(
          "group rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "has-data-readonly:w-fit has-data-readonly:cursor-default has-data-readonly:border-transparent has-data-readonly:focus-within:[box-shadow:none]",
        ),
      },
    },
  },
);

/**
 * Wrapper around PlateContainer with editor variants (used by the comment
 * sub-editors). Copied from plate-ui's official editor component.
 */
export function EditorContainer({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof editorContainerVariants>) {
  return (
    <PlateContainer
      className={cn(
        "ignore-click-outside/toolbar",
        editorContainerVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}

const editorVariants = cva(
  cn(
    "group/editor",
    "relative w-full cursor-text select-text overflow-x-hidden whitespace-break-spaces break-words",
    "rounded-md ring-offset-background focus-visible:outline-none",
    "**:data-slate-placeholder:!top-1/2 **:data-slate-placeholder:-translate-y-1/2 placeholder:text-muted-foreground/80 **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!",
    "[&_strong]:font-bold",
  ),
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      disabled: {
        true: "cursor-not-allowed opacity-50",
      },
      focused: {
        true: "ring-2 ring-ring ring-offset-2",
      },
      variant: {
        ai: "w-full px-0 text-base md:text-sm",
        aiChat: "max-h-[min(70vh,320px)] w-full overflow-y-auto px-3 py-2 text-base md:text-sm",
        comment: cn("rounded-none border-none bg-transparent text-sm"),
        default: "size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]",
        demo: "size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]",
        fullWidth: "size-full px-16 pt-4 pb-72 text-base sm:px-24",
        none: "",
        select: "px-3 py-2 text-base data-readonly:w-fit",
      },
    },
  },
);

export type EditorProps = PlateContentProps & VariantProps<typeof editorVariants>;

/**
 * Editable content area with editor variants (used by the comment sub-editors).
 * Copied from plate-ui's official editor component.
 */
export const Editor = ({
  className,
  disabled,
  focused,
  variant,
  ref,
  ...props
}: EditorProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <PlateContent
    ref={ref}
    className={cn(
      editorVariants({
        disabled,
        focused,
        variant,
      }),
      className,
    )}
    disabled={disabled}
    disableDefaultStyles
    {...props}
  />
);

Editor.displayName = "Editor";

/**
 * Read-only view of the editor content with the same variants.
 * Copied from plate-ui's official editor component.
 */
export function EditorView({
  className,
  variant,
  ...props
}: PlateViewProps & VariantProps<typeof editorVariants>) {
  return <PlateView {...props} className={cn(editorVariants({ variant }), className)} />;
}

EditorView.displayName = "EditorView";
