"use client";

import * as React from "react";

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
  key?: string;
}

export type UploadFileFn = (
  file: File,
  onProgress?: (progress: number) => void,
) => Promise<UploadedFile>;

/**
 * Upload configuration injected by the consumer. `uploadFile` owns the whole
 * HTTP exchange (endpoint, auth, response shape); the library only calls it.
 */
export interface UploadConfig {
  uploadFile: UploadFileFn;
  accept: string[];
  maxSize: number;
}

const UploadConfigContext = React.createContext<UploadConfig | null>(null);

interface UploadConfigProviderProps {
  config: UploadConfig;
  children: React.ReactNode;
}

export function UploadConfigProvider({ config, children }: UploadConfigProviderProps) {
  return <UploadConfigContext.Provider value={config}>{children}</UploadConfigContext.Provider>;
}

export function useUploadConfig(): UploadConfig {
  const config = React.useContext(UploadConfigContext);
  if (!config) throw new Error("UploadConfigProvider is missing");
  return config;
}
