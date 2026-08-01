import { Loader2 } from "lucide-react";
import type * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Common props shared by every field component built on top of FieldShell.
 * `label` is required because every form field should have a visible label
 * unless there is a strong reason otherwise (use ARIA labels in that case).
 */
export interface FieldCommonProps {
  label: React.ReactNode;
  required?: boolean;
  description?: string;
  error?: string;
  isValidating?: boolean;
  className?: string;
}

export interface FieldShellProps extends FieldCommonProps {
  id: string;
  children: React.ReactNode;
  /**
   * Whether the label binds to a single control via `htmlFor`. Set false for
   * composite fields that have no single form control to bind to, such as a
   * button group.
   */
  associateLabel?: boolean;
}

export function FieldShell({
  id,
  label,
  required,
  description,
  error,
  isValidating,
  className,
  children,
  associateLabel = true,
}: FieldShellProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-1.5">
        <Label id={`${id}-label`} htmlFor={associateLabel ? id : undefined}>
          {label}
        </Label>
        {required && (
          <>
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-destructive" />
            <span className="sr-only">(required)</span>
          </>
        )}
        {isValidating && (
          <Loader2 className="size-3 animate-spin text-muted-foreground" aria-label="Validating" />
        )}
      </div>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
