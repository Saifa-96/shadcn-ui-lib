import type * as React from "react";

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";

interface FormFieldSetProps {
  /**
   * Rendered as the fieldset legend (the section title).
   */
  legend?: React.ReactNode;
  /**
   * Rendered right below the legend as the section description.
   */
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Semantic section wrapper for a group of form fields. Renders a
 * `fieldset` with an optional legend and description; pair it with
 * `FormFieldGroup` to stack the fields inside.
 */
export function FormFieldSet({ legend, description, className, children }: FormFieldSetProps) {
  return (
    <FieldSet className={className}>
      {legend && <FieldLegend>{legend}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      {children}
    </FieldSet>
  );
}
