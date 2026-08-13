"use client";

import { useEffect, useState } from "react";

import { SandboxEmptyView } from "./sandbox-empty-view";
import type { SandboxViolation } from "./sandbox-error";
import { SandboxedFrame, type SandboxRenderState } from "./sandboxed-frame";

const DEFAULT_TIMEOUT_MS = 4000;
const DEFAULT_DEBOUNCE_MS = 300;

export interface SandboxedRenderProps {
  /** Untrusted agent HTML (including inline scripts), injected verbatim into the srcdoc. */
  html: string;
  /**
   * Watchdog timeout in milliseconds; reset on any ready/heartbeat/error message.
   * Tuning only — it does not open any capability.
   */
  timeoutMs?: number;
  /**
   * Quiet period before an `html` change is applied; rapid updates collapse into
   * a single render of the final value.
   */
  debounceMs?: number;
  /** Called on every state transition. */
  onStateChange?: (state: SandboxRenderState) => void;
  /** Called when a blocked action is reported; the preview stays rendered. */
  onViolation?: (violation: SandboxViolation) => void;
}

/**
 * Render untrusted agent HTML inside a locked-down sandboxed iframe.
 *
 * Incoming `html` is debounced, and each applied change fully resets the frame
 * (new nonce, watchdog, and heartbeat), so the caller never has to manage a key.
 */
export function SandboxedRender({
  html,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  onStateChange,
  onViolation,
}: SandboxedRenderProps) {
  const [effectiveHtml, setEffectiveHtml] = useState(html);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setEffectiveHtml(html), debounceMs);
    return () => window.clearTimeout(timer);
  }, [html, debounceMs]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Client-only: keep the server and first client render identical so the
    // random nonce never reaches SSR output and hydration has nothing to fix.
    return <div className="h-full w-full" />;
  }

  if (!effectiveHtml.trim()) {
    return <SandboxEmptyView />;
  }

  return (
    <SandboxedFrame
      key={effectiveHtml}
      html={effectiveHtml}
      timeoutMs={timeoutMs}
      onStateChange={onStateChange}
      onViolation={onViolation}
    />
  );
}
