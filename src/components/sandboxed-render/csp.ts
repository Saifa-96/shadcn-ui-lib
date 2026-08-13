/**
 * Locked-down CSP and sandbox policy for the untrusted render boundary.
 * Capabilities are denied by default; there is no configuration surface.
 */

export const DEFAULT_CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  "img-src data: blob:",
  "media-src data: blob:",
  "font-src data: blob:",
  "connect-src 'none'",
  "form-action 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
].join("; ");

export const SANDBOX_TOKEN_WHITELIST = "allow-scripts";
// Never extend this string with allow-same-origin, allow-top-navigation,
// allow-top-navigation-by-user-activation, allow-popups, allow-popups-to-escape-sandbox,
// allow-forms, or allow-downloads — each one reopens an escape or privilege path.
