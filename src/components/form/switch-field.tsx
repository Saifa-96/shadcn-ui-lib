"use client";

import { useSelector } from "@tanstack/react-form";
import type * as React from "react";

import { Switch } from "@/components/ui/switch";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

type SwitchFieldProps = Omit<
  React.ComponentProps<typeof Switch>,
  "checked" | "onCheckedChange" | "id"
> &
  FieldCommonProps;

export function SwitchField({
  label,
  required,
  description,
  className,
  ...switchProps
}: SwitchFieldProps) {
  const field = useFieldContext<boolean>();
  const issues = useSelector(field.store, (state) => state.meta.errors);
  const isValidating = useSelector(field.store, (state) => state.meta.isValidating);
  const error = firstFieldError(issues);

  return (
    <FieldShell
      id={field.name}
      label={label}
      required={required}
      description={description}
      error={error}
      isValidating={isValidating}
      className={className}
    >
      <Switch
        id={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(checked)}
        {...switchProps}
      />
    </FieldShell>
  );
}
