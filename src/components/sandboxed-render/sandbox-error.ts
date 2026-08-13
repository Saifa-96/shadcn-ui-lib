import type { SandboxErrorMessage } from "./protocol";

export type SandboxErrorCode = "timeout" | "runtime-error";

export type SandboxError =
  | { code: "timeout"; message: string }
  | {
      code: "runtime-error";
      message: string;
      lineno?: number;
      colno?: number;
      stack?: string;
    };

export type SandboxViolation =
  | { code: "link-blocked"; href: string }
  | { code: "request-blocked"; url: string };

/**
 * Build the terminal error reported when no liveness signal arrives in time.
 */
export function timeoutError(): SandboxError {
  return {
    code: "timeout",
    message: "Execution timed out — possible infinite loop or hang. Reduce synchronous work.",
  };
}

/**
 * Convert a forwarded frame error into the component's terminal error shape.
 */
export function runtimeErrorFromMessage(message: SandboxErrorMessage): SandboxError {
  return {
    code: "runtime-error",
    message: message.message,
    lineno: message.lineno,
    colno: message.colno,
    stack: message.stack,
  };
}

/**
 * Short headline for an error, suitable for an alert title.
 */
export function sandboxErrorTitle(reason: SandboxError): string {
  switch (reason.code) {
    case "timeout":
      return "Render timed out";
    case "runtime-error":
      return "Script error";
  }
}

/**
 * Full error detail, including the source position when the frame reported one.
 */
export function formatSandboxError(reason: SandboxError): string {
  switch (reason.code) {
    case "timeout":
      return reason.message;
    case "runtime-error": {
      const location =
        reason.lineno !== undefined
          ? `\n  at line ${reason.lineno}, column ${reason.colno ?? "?"}`
          : "";
      return `${reason.message}${location}`;
    }
  }
}
