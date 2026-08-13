import { useState } from "react";
import type { SandboxRenderState, SandboxViolation } from "@/components/sandboxed-render";
import { SandboxedRender } from "@/components/sandboxed-render";

const DEFAULT_HTML = [
  "<h1>Hello from the sandbox</h1>",
  "<p>Inline scripts run, but external links and network requests are blocked.</p>",
  "<button onclick=\"var n=(Number(this.dataset.n)||0)+1;this.dataset.n=n;this.textContent='Clicked '+n+' times'\">Click me</button>",
  "<script>document.body.style.fontFamily='sans-serif';</script>",
].join("\n");

export function SandboxedRenderPage() {
  const [input, setInput] = useState(DEFAULT_HTML);
  const [runHtml, setRunHtml] = useState(DEFAULT_HTML);
  const [runKey, setRunKey] = useState(0);
  const [state, setState] = useState<SandboxRenderState | null>(null);
  const [violations, setViolations] = useState<SandboxViolation[]>([]);

  const run = () => {
    setRunHtml(input);
    setRunKey((key) => key + 1);
    setState(null);
    setViolations([]);
  };

  const clear = () => {
    setInput("");
    setRunHtml("");
    setRunKey((key) => key + 1);
    setState(null);
    setViolations([]);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">SandboxedRender</h1>
        <p className="text-sm text-muted-foreground">
          Renders untrusted agent HTML in a locked-down sandbox. Edit the HTML on the left, press
          Run, and inspect the live state and violations below.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            className="h-64 w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={run}
              className="rounded-md border border-primary bg-primary px-4 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Run
            </button>
            <button
              type="button"
              onClick={clear}
              className="rounded-md border border-border bg-background px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="h-64 overflow-hidden rounded-md border border-border">
          <SandboxedRender
            key={runKey}
            html={runHtml}
            onStateChange={setState}
            onViolation={(violation) => setViolations((previous) => [...previous, violation])}
          />
        </div>
      </div>
      <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-foreground">
        {JSON.stringify({ state, violations }, null, 2)}
      </pre>
    </div>
  );
}
