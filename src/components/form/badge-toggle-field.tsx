"use client";

import { useStore } from "@tanstack/react-form";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useFieldContext } from "./widgets/context";
import { firstFieldError } from "./widgets/error-utils";
import { type FieldCommonProps, FieldShell } from "./widgets/field-shell";

export interface BadgeToggleOption {
  value: string;
  label: string;
}

interface BadgeToggleFieldProps extends FieldCommonProps {
  options: BadgeToggleOption[];
  /**
   * Shown in place of the badges when there are no options to toggle.
   */
  emptyText?: string;
}

/**
 * Multi-select field rendered as a row of toggleable badges. Backs a
 * `string[]` value; clicking a badge adds or removes its value.
 */
export function BadgeToggleField({
  label,
  required,
  description,
  className,
  options,
  emptyText = "No options available.",
}: BadgeToggleFieldProps) {
  const field = useFieldContext<string[]>();
  const issues = useStore(field.store, (state) => state.meta.errors);
  const isValidating = useStore(field.store, (state) => state.meta.isValidating);
  const error = firstFieldError(issues);

  const toggle = (value: string) => {
    const current = field.state.value;
    field.handleChange(
      current.includes(value) ? current.filter((x) => x !== value) : [...current, value],
    );
  };

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
      <fieldset aria-labelledby={`${field.name}-label`} className="flex flex-wrap gap-2">
        {options.length === 0 ? (
          <span className="text-xs text-muted-foreground">{emptyText}</span>
        ) : (
          options.map((option) => {
            const isOn = field.state.value.includes(option.value);
            return (
              <button key={option.value} type="button" onClick={() => toggle(option.value)}>
                <Badge
                  variant={isOn ? "default" : "outline"}
                  className={cn("cursor-pointer", !isOn && "opacity-70")}
                >
                  {option.label}
                </Badge>
              </button>
            );
          })
        )}
      </fieldset>
    </FieldShell>
  );
}
