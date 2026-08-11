"use client";

import { useSelector } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import type { FieldCommonProps } from "./widgets/field-shell";

type CheckboxFieldProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange" | "id"
> &
  FieldCommonProps;

export function CheckboxField({
  label,
  required,
  description,
  className,
  ...checkboxProps
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const issues = useSelector(field.store, (state) => state.meta.errors);
  const isValidating = useSelector(field.store, (state) => state.meta.isValidating);
  const error = firstFieldError(issues);

  return (
    <Field orientation="horizontal" className={cn("gap-2", className)}>
      <Checkbox
        id={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        {...checkboxProps}
      />
      <FieldContent>
        <FieldLabel htmlFor={field.name} className="items-center gap-1.5">
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-destructive" />
              <span className="sr-only">(required)</span>
            </>
          )}
          {isValidating && (
            <Loader2
              className="size-3 animate-spin text-muted-foreground"
              aria-label="Validating"
            />
          )}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
}
