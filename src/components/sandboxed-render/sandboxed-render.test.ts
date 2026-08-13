import { describe, expect, it } from "vitest";

import { buildDocument } from "./build-document";
import { isSandboxFrameMessage } from "./protocol";

describe("isSandboxFrameMessage", () => {
  it("accepts well-formed messages of every type", () => {
    expect(isSandboxFrameMessage({ type: "ready", nonce: "abc" })).toBe(true);
    expect(isSandboxFrameMessage({ type: "heartbeat", nonce: "abc" })).toBe(true);
    expect(isSandboxFrameMessage({ type: "error", nonce: "abc", message: "boom" })).toBe(true);
    expect(
      isSandboxFrameMessage({ type: "link-blocked", nonce: "abc", href: "https://x.dev" }),
    ).toBe(true);
    expect(
      isSandboxFrameMessage({ type: "request-blocked", nonce: "abc", url: "https://x.dev" }),
    ).toBe(true);
  });

  it("rejects non-objects and payloads missing type or nonce", () => {
    expect(isSandboxFrameMessage(null)).toBe(false);
    expect(isSandboxFrameMessage("ready")).toBe(false);
    expect(isSandboxFrameMessage({ type: "ready" })).toBe(false);
    expect(isSandboxFrameMessage({ nonce: "abc" })).toBe(false);
  });

  it("rejects unknown types and payload fields of the wrong type", () => {
    expect(isSandboxFrameMessage({ type: "unknown", nonce: "abc" })).toBe(false);
    expect(isSandboxFrameMessage({ type: "error", nonce: "abc" })).toBe(false);
    expect(isSandboxFrameMessage({ type: "error", nonce: "abc", message: 42 })).toBe(false);
    expect(isSandboxFrameMessage({ type: "link-blocked", nonce: "abc", href: 1 })).toBe(false);
  });
});

describe("buildDocument", () => {
  it("orders the CSP meta before the harness, which precedes the agent HTML", () => {
    const doc = buildDocument({ html: "<p>hi</p>", nonce: "n0nce" });
    const cspIndex = doc.indexOf("Content-Security-Policy");
    const nonceIndex = doc.indexOf("const NONCE");
    const htmlIndex = doc.indexOf("<p>hi</p>");
    expect(cspIndex).toBeGreaterThan(-1);
    expect(nonceIndex).toBeGreaterThan(cspIndex);
    expect(htmlIndex).toBeGreaterThan(nonceIndex);
  });

  it("embeds the nonce and keeps the harness inside its own script tag", () => {
    const doc = buildDocument({ html: "<p>hi</p>", nonce: "n0nce" });
    expect(doc).toContain('const NONCE = "n0nce"');
    const harness = doc.split("<script>")[1]?.split("</script>")[0] ?? "";
    expect(harness).not.toContain("</script>");
  });

  it("patches every network channel the CSP cannot fully cover", () => {
    const doc = buildDocument({ html: "", nonce: "n0nce" });
    const patchedApis = [
      "fetch",
      "XMLHttpRequest",
      "WebSocket",
      "EventSource",
      "RTCPeerConnection",
      "sendBeacon",
    ];
    for (const api of patchedApis) {
      expect(doc).toContain(api);
    }
  });
});
