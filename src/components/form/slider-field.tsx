"use client";

import { useSelector } from "@tanstack/react-form";
import type * as React from "react";

import { Slider } from "@/components/ui/slider";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

type SliderFieldProps = Omit<
  React.ComponentProps<typeof Slider>,
  "value" | "onValueChange" | "className"
> &
  FieldCommonProps;

export function SliderField({
  label,
  required,
  description,
  className,
  ...sliderProps
}: SliderFieldProps) {
  const field = useFieldContext<number>();
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
      associateLabel={false}
    >
      <Slider
        aria-labelledby={`${field.name}-label`}
        value={[field.state.value ?? 0]}
        onValueChange={([value]) => field.handleChange(value ?? 0)}
        {...sliderProps}
      />
    </FieldShell>
  );
}
