"use client";

import { useStore } from "@tanstack/react-form";
import type * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

export interface SelectFieldOption {
  value: string;
  label: string;
  /**
   * Overrides the default label rendering for both the dropdown item and
   * the selected value shown in the trigger. Use for richer rows like a
   * status badge.
   */
  render?: React.ReactNode;
}

/**
 * Options are always grouped; every group carries a label rendered as a
 * non-selectable heading above its items.
 */
export interface SelectFieldGroup {
  label: string;
  options: SelectFieldOption[];
}

interface SelectFieldProps extends FieldCommonProps {
  groups: SelectFieldGroup[];
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({
  label,
  required,
  description,
  className,
  groups,
  placeholder,
  disabled,
}: SelectFieldProps) {
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
      <Select
        value={field.state.value ?? ""}
        onValueChange={(value) => field.handleChange(value ?? "")}
        disabled={disabled}
      >
        <SelectTrigger id={field.name} onBlur={field.handleBlur} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.render ?? option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}
