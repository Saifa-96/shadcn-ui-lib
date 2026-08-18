import { useState } from "react";

import { PptEditor, usePptEditor } from "@/components/ppt-editor";
import { SAMPLE_DOC } from "./ppt-editor-sample-doc";

const BUTTON_PRIMARY =
  "rounded-md border border-primary bg-primary px-4 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";
const BUTTON_SECONDARY =
  "rounded-md border border-border bg-background px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50";

export function PptEditorPage() {
  const editor = usePptEditor({ initialDoc: SAMPLE_DOC });
  const { ready, error, runtime } = editor;
  const [status, setStatus] = useState("waiting for editor…");

  const inspectDoc = () => {
    if (!runtime) return;
    const doc = runtime.doc;
    setStatus(
      JSON.stringify(
        { title: doc.title, slides: doc.slides.length, modified: doc.modified },
        null,
        2,
      ),
    );
  };

  const serialize = () => {
    if (!runtime) return;
    setStatus(`serialized ${runtime.serialize().length} chars`);
  };

  const exportDeck = async () => {
    if (!runtime?.exportPptx) return;
    const blob = await runtime.exportPptx();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${runtime.doc.title || "presentation"}.pptx`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(`exported "${anchor.download}" (${Math.round(blob.size / 1024)} KB)`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">PptEditor</h1>
        <p className="text-sm text-muted-foreground">
          Pair the <code>usePptEditor</code> hook with the <code>PptEditor</code> component: the
          hook owns the instance (state + runtime), the component mounts its iframe via srcdoc.
        </p>
      </div>

      <div className="h-[70vh] overflow-hidden rounded-md border border-border">
        {error ? (
          <div className="p-3 text-sm text-destructive" role="alert">
            {error.message}
          </div>
        ) : (
          <PptEditor editor={editor} className="h-full w-full border-0" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {ready ? "runtime ready" : "booting…"}
        </span>
        <button type="button" onClick={inspectDoc} disabled={!ready} className={BUTTON_PRIMARY}>
          Inspect doc
        </button>
        <button type="button" onClick={serialize} disabled={!ready} className={BUTTON_PRIMARY}>
          Serialize
        </button>
        <button type="button" onClick={exportDeck} disabled={!ready} className={BUTTON_PRIMARY}>
          Export PPTX
        </button>
        <button
          type="button"
          onClick={() => runtime?.undo()}
          disabled={!ready}
          className={BUTTON_SECONDARY}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => runtime?.redo()}
          disabled={!ready}
          className={BUTTON_SECONDARY}
        >
          Redo
        </button>
      </div>

      <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-foreground">
        {status}
      </pre>
    </div>
  );
}
