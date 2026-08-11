"use client";

import { useSelector } from "@tanstack/react-form";
import type * as React from "react";

import { Input } from "@/components/ui/input";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

type TextFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "value" | "onChange" | "onBlur" | "className"
> &
  FieldCommonProps;

export function TextField({
  label,
  required,
  description,
  className,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string>();
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
      <Input
        id={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        autoComplete="off"
        {...inputProps}
      />
    </FieldShell>
  );
}
