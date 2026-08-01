"use client";

import { PlaceholderPlugin, PlaceholderProvider, updateUploadHistory } from "@platejs/media/react";
import { ImageIcon, Loader2Icon } from "lucide-react";
import type { TPlaceholderElement } from "platejs";
import { KEYS } from "platejs";
import type { PlateElementProps } from "platejs/react";
import { PlateElement, useEditorPlugin, withHOC } from "platejs/react";
import * as React from "react";
import { useFilePicker } from "use-file-picker";

import { cn } from "@/lib/utils";

import { useUploadConfig } from "../upload/upload-config";
import { useUploadFile } from "../upload/use-upload-file";

export const PlaceholderElement = withHOC(
  PlaceholderProvider,
  function PlaceholderElement(props: PlateElementProps<TPlaceholderElement>) {
    const { editor, element } = props;

    const { api } = useEditorPlugin(PlaceholderPlugin);
    const { accept } = useUploadConfig();

    const { isUploading, progress, uploadedFile, uploadFile, uploadingFile } = useUploadFile();

    const loading = isUploading && uploadingFile;

    const isImage = element.mediaType === KEYS.img;

    const imageRef = React.useRef<HTMLImageElement>(null);

    const { openFilePicker } = useFilePicker({
      accept,
      multiple: true,
      onFilesSelected: ({ plainFiles: updatedFiles }) => {
        const firstFile = updatedFiles[0];
        const restFiles = updatedFiles.slice(1);

        if (firstFile) replaceCurrentPlaceholder(firstFile);

        if (restFiles.length > 0) {
          editor.getTransforms(PlaceholderPlugin).insert.media(restFiles);
        }
      },
    });

    const replaceCurrentPlaceholder = React.useCallback(
      (file: File) => {
        void uploadFile(file).then((uploaded) => {
          if (uploaded) return;

          // Upload failed or file rejected: drop the placeholder instead of
          // leaving it stuck in the document.
          api.placeholder.removeUploadingFile(element.id as string);
          const path = editor.api.findPath(element);
          if (!path) return;
          editor.tf.withoutSaving(() => {
            editor.tf.removeNodes({ at: path });
          });
        });
        api.placeholder.addUploadingFile(element.id as string, file);
      },
      [api.placeholder, editor, element, uploadFile],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: mirrors official plate-ui effect semantics
    React.useEffect(() => {
      if (!uploadedFile) return;

      const path = editor.api.findPath(element);

      // placeholder was deleted while the upload was in flight
      if (!path) {
        api.placeholder.removeUploadingFile(element.id as string);
        return;
      }

      editor.tf.withoutSaving(() => {
        editor.tf.removeNodes({ at: path });

        const node = {
          children: [{ text: "" }],
          initialHeight: imageRef.current?.height,
          initialWidth: imageRef.current?.width,
          isUpload: true,
          name: "",
          placeholderId: element.id as string,
          type: element.mediaType,
          url: uploadedFile.url,
        };

        editor.tf.insertNodes(node, { at: path });

        updateUploadHistory(editor, node);
      });

      api.placeholder.removeUploadingFile(element.id as string);
    }, [uploadedFile, element.id]);

    // React dev mode will call React.useEffect twice
    const isReplaced = React.useRef(false);

    // Paste and drop
    // biome-ignore lint/correctness/useExhaustiveDependencies: mirrors official plate-ui effect semantics
    React.useEffect(() => {
      if (isReplaced.current) return;

      isReplaced.current = true;
      const currentFiles = api.placeholder.getUploadingFile(element.id as string);

      if (!currentFiles) return;

      replaceCurrentPlaceholder(currentFiles);
    }, [isReplaced]);

    return (
      <PlateElement className="my-1" {...props}>
        {!loading && (
          <div
            className={cn(
              "flex cursor-pointer items-center rounded-sm bg-muted p-3 pr-9 select-none hover:bg-primary/10",
            )}
            onClick={() => openFilePicker()}
            contentEditable={false}
          >
            <div className="relative mr-3 flex text-muted-foreground/80 [&_svg]:size-6">
              <ImageIcon />
            </div>
            <div className="text-sm whitespace-nowrap text-muted-foreground">
              <div>Add an image</div>
            </div>
          </div>
        )}

        {isImage && loading && (
          <ImageProgress file={uploadingFile} imageRef={imageRef} progress={progress} />
        )}

        {props.children}
      </PlateElement>
    );
  },
);

interface ImageProgressProps {
  file: File;
  className?: string;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  progress?: number;
}

export function ImageProgress({ className, file, imageRef, progress = 0 }: ImageProgressProps) {
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) {
    return null;
  }

  return (
    <div className={cn("relative", className)} contentEditable={false}>
      <img
        ref={imageRef}
        className="h-auto w-full rounded-sm object-cover"
        alt={file.name}
        src={objectUrl}
      />
      {progress < 100 && (
        <div className="absolute right-1 bottom-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5">
          <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />
          <span className="text-xs font-medium text-white">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
