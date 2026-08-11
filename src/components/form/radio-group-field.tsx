"use client";

import { useSelector } from "@tanstack/react-form";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

export interface RadioGroupOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps extends FieldCommonProps {
  options: RadioGroupOption[];
}

export function RadioGroupField({
  label,
  required,
  description,
  className,
  options,
}: RadioGroupFieldProps) {
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
      associateLabel={false}
    >
      <RadioGroup
        aria-labelledby={`${field.name}-label`}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        className="flex flex-col gap-2"
      >
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={`${field.name}-${option.value}`}
            className="flex w-fit cursor-pointer items-center gap-2 text-sm font-normal"
          >
            <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
            {option.label}
          </Label>
        ))}
      </RadioGroup>
    </FieldShell>
  );
}
