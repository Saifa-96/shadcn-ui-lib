/**
 * Frame-to-parent message protocol for the sandboxed render boundary.
 * Every message carries a per-mount nonce; the parent validates both the
 * message source and the nonce before acting on it.
 */

export const SANDBOX_MESSAGE_TYPES = [
  "ready",
  "heartbeat",
  "error",
  "link-blocked",
  "request-blocked",
] as const;

export type SandboxMessageType = (typeof SANDBOX_MESSAGE_TYPES)[number];

export interface SandboxReadyMessage {
  type: "ready";
  nonce: string;
}

export interface SandboxHeartbeatMessage {
  type: "heartbeat";
  nonce: string;
}

export interface SandboxErrorMessage {
  type: "error";
  nonce: string;
  message: string;
  lineno?: number;
  colno?: number;
  stack?: string;
}

export interface SandboxLinkBlockedMessage {
  type: "link-blocked";
  nonce: string;
  href: string;
}

export interface SandboxRequestBlockedMessage {
  type: "request-blocked";
  nonce: string;
  url: string;
}

export type SandboxFrameMessage =
  | SandboxReadyMessage
  | SandboxHeartbeatMessage
  | SandboxErrorMessage
  | SandboxLinkBlockedMessage
  | SandboxRequestBlockedMessage;

/**
 * Narrow an unknown postMessage payload to a sandbox frame message.
 */
export function isSandboxFrameMessage(value: unknown): value is SandboxFrameMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("type" in value) || !("nonce" in value)) {
    return false;
  }
  const type = value.type;
  const nonce = value.nonce;
  if (typeof type !== "string" || typeof nonce !== "string") {
    return false;
  }
  switch (type) {
    case "ready":
    case "heartbeat":
      return true;
    case "error":
      return "message" in value && typeof value.message === "string";
    case "link-blocked":
      return "href" in value && typeof value.href === "string";
    case "request-blocked":
      return "url" in value && typeof value.url === "string";
    default:
      return false;
  }
}
