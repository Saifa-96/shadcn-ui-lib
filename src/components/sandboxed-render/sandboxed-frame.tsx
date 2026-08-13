"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildDocument } from "./build-document";
import { SANDBOX_TOKEN_WHITELIST } from "./csp";
import { isSandboxFrameMessage } from "./protocol";
import type { SandboxError, SandboxViolation } from "./sandbox-error";
import { runtimeErrorFromMessage, timeoutError } from "./sandbox-error";
import { SandboxErrorView } from "./sandbox-error-view";

const NONCE_ALPHABET = "0123456789abcdef";

export type SandboxRenderState =
  | { status: "loading" }
  | { status: "rendered" }
  | { status: "error"; reason: SandboxError };

interface SandboxedFrameProps {
  html: string;
  timeoutMs: number;
  onStateChange?: (state: SandboxRenderState) => void;
  onViolation?: (violation: SandboxViolation) => void;
}

/**
 * One render lifecycle for a single HTML document: builds the sandboxed srcdoc,
 * watches the frame's liveness, and reports a terminal error when it stops.
 */
export function SandboxedFrame({
  html,
  timeoutMs,
  onStateChange,
  onViolation,
}: SandboxedFrameProps) {
  const [state, setState] = useState<SandboxRenderState>({ status: "loading" });
  const [nonce] = useState(createNonce);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;
  const onViolationRef = useRef(onViolation);
  onViolationRef.current = onViolation;

  const doc = useMemo(() => buildDocument({ html, nonce }), [html, nonce]);

  const commit = useCallback((next: SandboxRenderState) => {
    setState(next);
    onStateChangeRef.current?.(next);
  }, []);

  useEffect(() => {
    commit({ status: "loading" });

    let watchdogTimer: number | undefined;
    let settled = false;
    let rendered = false;

    const armWatchdog = () => {
      window.clearTimeout(watchdogTimer);
      watchdogTimer = window.setTimeout(() => {
        settled = true;
        commit({ status: "error", reason: timeoutError() });
      }, timeoutMs);
    };

    const settle = (next: SandboxRenderState) => {
      settled = true;
      window.clearTimeout(watchdogTimer);
      commit(next);
    };

    // Any liveness signal proves the frame rendered; `ready` is only the fastest one.
    const markRendered = () => {
      if (rendered) {
        return;
      }
      rendered = true;
      commit({ status: "rendered" });
    };

    const handleMessage = (event: MessageEvent) => {
      if (settled) {
        return;
      }
      const frameWindow = iframeRef.current?.contentWindow;
      if (!frameWindow || event.source !== frameWindow) {
        return;
      }
      const message = event.data;
      if (!isSandboxFrameMessage(message)) {
        return;
      }
      if (message.nonce !== nonce) {
        // A stale frame (html changed) or an out-of-band message — never a component failure.
        console.warn("SandboxedRender: dropped message with mismatched nonce:", message.type);
        return;
      }
      switch (message.type) {
        case "ready":
          armWatchdog();
          markRendered();
          break;
        case "heartbeat":
          armWatchdog();
          markRendered();
          break;
        case "error":
          settle({ status: "error", reason: runtimeErrorFromMessage(message) });
          break;
        case "link-blocked":
          armWatchdog();
          onViolationRef.current?.({ code: "link-blocked", href: message.href });
          break;
        case "request-blocked":
          armWatchdog();
          onViolationRef.current?.({ code: "request-blocked", url: message.url });
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    armWatchdog();

    return () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(watchdogTimer);
    };
  }, [nonce, timeoutMs, commit]);

  if (state.status === "error") {
    return <SandboxErrorView reason={state.reason} />;
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={doc}
      sandbox={SANDBOX_TOKEN_WHITELIST}
      referrerPolicy="no-referrer"
      title="Untrusted preview"
      className="h-full w-full border-0"
    />
  );
}

function createNonce(): string {
  let nonce = "";
  for (let i = 0; i < 16; i += 1) {
    const index = Math.floor(Math.random() * NONCE_ALPHABET.length);
    nonce += NONCE_ALPHABET[index] ?? "0";
  }
  return nonce;
}
