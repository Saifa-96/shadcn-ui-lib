"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

import type { BentoDoc, Comment } from "./bento/bento";

const DEFAULT_POLL_INTERVAL_MS = 100;
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * The `window.bento` editor runtime, exposed as-is.
 *
 * Every returned object (`doc`, `comments()`) is a live reference inside the
 * iframe realm: reading properties, `JSON.stringify`, `structuredClone`, and
 * `postMessage` all work, but `instanceof` does not. `structuredClone` a value
 * when you need a detached, parent-realm snapshot.
 */
export interface BentoRuntime {
  doc: BentoDoc;
  /** Takes a JSON string, not an object — call `loadDoc(JSON.stringify(doc))`. */
  loadDoc(json: string): boolean;
  serialize(): string;
  undo(): void;
  redo(): void;
  comments(): Comment[];
}

export interface UsePptEditorOptions {
  /**
   * Document to load once the runtime mounts (uncontrolled — injected a single
   * time; later changes to this value are ignored). Omit to start from the
   * bundled shell's own document.
   */
  initialDoc?: BentoDoc;
  onReady?: (runtime: BentoRuntime) => void;
  onError?: (error: Error) => void;
  /** Interval between `window.bento` mount checks while the editor boots. */
  pollIntervalMs?: number;
  /** Give up waiting for the runtime after this long. */
  timeoutMs?: number;
}

export interface PptEditorInstance {
  /** Iframe ref — wired by `<PptEditor>`; you never set this yourself. */
  ref: RefObject<HTMLIFrameElement | null>;
  /** True once the bento runtime has mounted in the frame. */
  ready: boolean;
  /** Set when the runtime fails to mount within the timeout. */
  error: Error | null;
  /** The `window.bento` runtime, or null until ready. */
  runtime: BentoRuntime | null;
}

/**
 * Create a bento slides editor instance to hand to {@link PptEditor}.
 *
 * The editor mounts `window.bento` only after its boot splash (~1.25s) and
 * exposes no ready event, so polling the frame's contentWindow is the only way
 * to observe readiness — hence the effect. The frame may mount after this hook
 * (the component gates it behind an SSR check), so the poll reads the ref on
 * every tick.
 */
export function usePptEditor(options: UsePptEditorOptions = {}): PptEditorInstance {
  const {
    initialDoc,
    onReady,
    onError,
    pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const ref = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [runtime, setRuntime] = useState<BentoRuntime | null>(null);

  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Mirror initialDoc during render so the one-shot injection reads the latest
  // value without re-running the poll effect when it changes.
  const initialDocRef = useRef(initialDoc);
  initialDocRef.current = initialDoc;
  // Guards the injection so it fires at most once, independent of runtime
  // identity (StrictMode replays, a re-mounted frame).
  const injectedRef = useRef(false);

  useEffect(() => {
    setReady(false);
    setError(null);
    setRuntime(null);

    let cancelled = false;
    let timer: number | undefined;
    const deadline = Date.now() + timeoutMs;

    const poll = () => {
      if (cancelled) return;
      const frame = ref.current;
      const found = frame ? readRuntime(frame) : null;
      if (found) {
        // Inject the initial doc once, before surfacing readiness, so onReady
        // and consumers observe the already-loaded document.
        const pendingDoc = initialDocRef.current;
        if (pendingDoc && !injectedRef.current) {
          injectedRef.current = true;
          found.loadDoc(JSON.stringify(pendingDoc));
        }
        setReady(true);
        setRuntime(found);
        onReadyRef.current?.(found);
        return;
      }
      if (Date.now() >= deadline) {
        const failure = new Error(`Bento runtime did not mount within ${timeoutMs}ms`);
        setError(failure);
        onErrorRef.current?.(failure);
        return;
      }
      timer = window.setTimeout(poll, pollIntervalMs);
    };

    timer = window.setTimeout(poll, pollIntervalMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pollIntervalMs, timeoutMs]);

  return { ref, ready, error, runtime };
}

/**
 * Read the mounted bento runtime from a frame, or null while it is still booting.
 */
function readRuntime(frame: HTMLIFrameElement): BentoRuntime | null {
  const win = frame.contentWindow;
  if (!win || !("bento" in win)) return null;
  return isBentoRuntime(win.bento) ? win.bento : null;
}

/**
 * Narrow an unknown value to the bento editor runtime shape.
 */
function isBentoRuntime(value: unknown): value is BentoRuntime {
  if (typeof value !== "object" || value === null) return false;
  if (!("doc" in value)) return false;
  if (!("loadDoc" in value) || typeof value.loadDoc !== "function") return false;
  if (!("serialize" in value) || typeof value.serialize !== "function") return false;
  return true;
}
