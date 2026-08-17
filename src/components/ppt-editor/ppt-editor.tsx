"use client";

import { useEffect, useState } from "react";

import { BENTO_HTML } from "./bento-html";
import type { PptEditorInstance } from "./use-ppt-editor";

export interface PptEditorProps {
  /** Editor instance from {@link usePptEditor}. */
  editor: PptEditorInstance;
  className?: string;
  /** Accessible title for the iframe. */
  title?: string;
}

/**
 * Render the bento slides editor iframe for a {@link usePptEditor} instance.
 *
 * The hook and this component are used together: the hook owns the instance
 * (state + runtime), this component mounts its iframe. The editor shell is
 * bundled and mounted via `srcdoc` (which inherits the parent origin), so
 * nothing is hosted.
 */
export function PptEditor({ editor, className, title = "Presentation editor" }: PptEditorProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Client-only: keeps the ~590KB shell out of SSR output.
    return <div className={className} />;
  }

  return (
    <iframe
      ref={editor.ref}
      srcDoc={BENTO_HTML}
      title={title}
      className={className}
      allowFullScreen
    />
  );
}
