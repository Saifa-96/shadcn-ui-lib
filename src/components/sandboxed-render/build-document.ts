import { DEFAULT_CSP } from "./csp";

interface BuildDocumentOptions {
  html: string;
  nonce: string;
}

/**
 * Assemble the locked-down srcdoc document: CSP meta, referrer meta, and the
 * interception harness, all prepended before the untrusted agent HTML.
 */
export function buildDocument({ html, nonce }: BuildDocumentOptions): string {
  return [
    "<!DOCTYPE html>",
    `<meta http-equiv="Content-Security-Policy" content="${escapeHtmlAttribute(DEFAULT_CSP)}">`,
    '<meta name="referrer" content="no-referrer">',
    `<script>${buildHarnessScript(nonce)}</script>`,
    html,
  ].join("\n");
}

function buildHarnessScript(nonce: string): string {
  return `(() => {
  const NONCE = ${JSON.stringify(nonce)};
  const HOST = parent;
  const send = HOST.postMessage.bind(HOST);
  const report = (type, payload) => send(Object.assign({ type, nonce: NONCE }, payload), "*");
  const isSelfContainedUrl = (url) => {
    const scheme = String(url).toLowerCase();
    return scheme.startsWith("data:") || scheme.startsWith("blob:");
  };
  const BLOCKED_PREFIX = "Sandbox: network request blocked";

  const notifyError = (message, extra) => {
    if (String(message).startsWith(BLOCKED_PREFIX)) return;
    report("error", Object.assign({ message }, extra));
  };
  window.addEventListener("error", (event) => {
    notifyError(String(event.message || (event.error && event.error.message) || "Unknown error"), {
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error && event.error.stack ? String(event.error.stack) : undefined,
    });
  }, true);
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    if (message.startsWith(BLOCKED_PREFIX)) return;
    notifyError(message, {
      stack: reason instanceof Error ? String(reason.stack || "") : undefined,
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const anchor = target && typeof target.closest === "function" ? target.closest("a[href]") : null;
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    if (href.startsWith("#")) return;
    event.preventDefault();
    report("link-blocked", { href });
  }, true);

  const blockRequest = (url) => {
    report("request-blocked", { url });
    throw new Error(BLOCKED_PREFIX + ": " + url);
  };

  const fetchRef = window.fetch;
  if (typeof fetchRef === "function") {
    window.fetch = function (input, init) {
      let url = "";
      if (typeof input === "string") {
        url = input;
      } else if (input && typeof input.url === "string") {
        url = input.url;
      }
      if (!isSelfContainedUrl(url)) {
        report("request-blocked", { url });
        return Promise.reject(new Error(BLOCKED_PREFIX + ": " + url));
      }
      return fetchRef.call(this, input, init);
    };
  }

  const openRef = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (!isSelfContainedUrl(String(url))) blockRequest(String(url));
    return openRef.apply(this, arguments);
  };

  if (typeof window.WebSocket === "function") {
    const WebSocketRef = window.WebSocket;
    window.WebSocket = function (url, protocols) {
      if (!isSelfContainedUrl(String(url))) blockRequest(String(url));
      return protocols === undefined ? new WebSocketRef(url) : new WebSocketRef(url, protocols);
    };
    window.WebSocket.prototype = WebSocketRef.prototype;
  }

  if (typeof window.EventSource === "function") {
    const EventSourceRef = window.EventSource;
    window.EventSource = function (url, options) {
      if (!isSelfContainedUrl(String(url))) blockRequest(String(url));
      return options === undefined ? new EventSourceRef(url) : new EventSourceRef(url, options);
    };
    window.EventSource.prototype = EventSourceRef.prototype;
  }

  if (typeof window.RTCPeerConnection === "function") {
    // connect-src does not govern WebRTC; block it explicitly so the sandbox
    // cannot open a data channel outside the CSP allowlist.
    window.RTCPeerConnection = function () {
      blockRequest("webrtc");
    };
  }

  const sendBeaconRef = navigator.sendBeacon;
  if (typeof sendBeaconRef === "function") {
    navigator.sendBeacon = function (url, data) {
      if (!isSelfContainedUrl(String(url))) {
        report("request-blocked", { url: String(url) });
        return false;
      }
      return sendBeaconRef.call(this, url, data);
    };
  }

  report("ready", {});
  window.setInterval(() => report("heartbeat", {}), 1000);
})();`;
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
