"use client";

import * as React from "react";
import { toast } from "sonner";

import { type UploadedFile, useUploadConfig } from "./upload-config";

/**
 * Replacement for plate-ui's uploadthing-based useUploadFile. Keeps the same
 * return shape, but delegates the HTTP exchange to the injected
 * `UploadConfig.uploadFile` and validates accept/maxSize before calling it.
 */
export function useUploadFile() {
  const config = useUploadConfig();
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFile(file: File): Promise<UploadedFile | undefined> {
    if (!matchesAccept(file, config.accept)) {
      toast.error(`The type of file ${file.name} is not allowed`);
      return undefined;
    }
    if (file.size > config.maxSize) {
      toast.error(`The size of file ${file.name} exceeds ${formatBytes(config.maxSize)}`);
      return undefined;
    }

    setIsUploading(true);
    setUploadingFile(file);

    try {
      const uploaded = await config.uploadFile(file, (value) => {
        setProgress(Math.min(value, 100));
      });

      setUploadedFile(uploaded);

      return uploaded;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(message.length > 0 ? message : "Something went wrong, please try again later.");
      return undefined;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
  };
}

function matchesAccept(file: File, accept: string[]): boolean {
  if (accept.length === 0 || accept.includes("*")) return true;

  return accept.some((rule) => {
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule.toLowerCase());
    return file.type === rule;
  });
}

function formatBytes(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 Byte";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / 1024 ** i).toFixed(0)} ${sizes[i] ?? "Bytes"}`;
}
