"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Skeleton } from "../ui/skeleton";
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
 *
 * While the runtime boots (~1.5s) a skeleton mimicking the editor layout
 * (toolbar, slide rail, canvas) covers the frame; bento's own boot splash is
 * disabled via debrand.css so the skeleton is the only loading state.
 */
export function PptEditor({ editor, className, title = "Presentation editor" }: PptEditorProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Client-only: keeps the ~590KB shell out of SSR output. The same
    // skeleton shows pre-mount, so first paint already has a shape.
    return <PptEditorSkeleton className={className} />;
  }

  return (
    <div className={cn("relative", className)}>
      <iframe
        ref={editor.ref}
        srcDoc={BENTO_HTML}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
      />
      {!editor.ready && !editor.error && <PptEditorSkeleton className="absolute inset-0" />}
    </div>
  );
}

/**
 * Loading placeholder shaped like the editor: top toolbar, left slide rail,
 * big canvas.
 */
function PptEditorSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 bg-background p-3", className)} aria-hidden>
      <Skeleton className="h-10 w-full shrink-0" />
      <div className="flex min-h-0 flex-1 gap-3">
        <Skeleton className="w-36 shrink-0" />
        <Skeleton className="min-w-0 flex-1" />
      </div>
    </div>
  );
}
