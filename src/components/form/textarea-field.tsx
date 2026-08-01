"use client";

import { useStore } from "@tanstack/react-form";
import type * as React from "react";

import { Textarea } from "@/components/ui/textarea";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

type TextareaFieldProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "id" | "value" | "onChange" | "onBlur" | "className"
> &
  FieldCommonProps;

export function TextareaField({
  label,
  required,
  description,
  className,
  ...textareaProps
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const issues = useStore(field.store, (state) => state.meta.errors);
  const isValidating = useStore(field.store, (state) => state.meta.isValidating);
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
      <Textarea
        id={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...textareaProps}
      />
    </FieldShell>
  );
}
