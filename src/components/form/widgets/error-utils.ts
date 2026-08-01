/**
 * meta.errors entries can come from multiple validators:
 * - schema validators (zod via standard schema) → issue objects with a `message`
 * - async validators returning a string or `{ fields: { x: 'msg' } }` → plain string
 *
 * Pick the first error and normalize to a string for display.
 */
export function firstFieldError(issues: readonly unknown[]): string | undefined {
  for (const entry of issues) {
    if (!entry) continue;
    if (typeof entry === "string") return entry;
    if (typeof entry === "object" && "message" in entry && typeof entry.message === "string") {
      return entry.message;
    }
  }
  return undefined;
}
