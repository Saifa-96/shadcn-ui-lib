"use client";

import { useSelector } from "@tanstack/react-form";
import type * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

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
    <FieldShell
      id={field.name}
      label={label}
      required={required}
      description={description}
      error={error}
      isValidating={isValidating}
      className={className}
    >
      <Checkbox
        id={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        {...checkboxProps}
      />
    </FieldShell>
  );
}
