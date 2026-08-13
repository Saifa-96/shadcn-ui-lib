import { TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { SandboxError } from "./sandbox-error";
import { formatSandboxError, sandboxErrorTitle } from "./sandbox-error";

interface SandboxErrorViewProps {
  reason: SandboxError;
}

/**
 * Shown when the sandbox fails terminally; surfaces the reason an agent can act on.
 */
export function SandboxErrorView({ reason }: SandboxErrorViewProps) {
  return (
    <div className="h-full w-full overflow-auto p-3">
      <Alert variant="destructive">
        <TriangleAlertIcon className="size-4" />
        <AlertTitle>{sandboxErrorTitle(reason)}</AlertTitle>
        <AlertDescription>
          <pre className="whitespace-pre-wrap break-all font-mono text-xs">
            {formatSandboxError(reason)}
          </pre>
        </AlertDescription>
      </Alert>
    </div>
  );
}
