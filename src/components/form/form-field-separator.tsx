import type * as React from "react";

import { FieldSeparator } from "@/components/ui/field";

type FormFieldSeparatorProps = React.ComponentProps<typeof FieldSeparator>;

/**
 * Visual divider between sections inside a `FormFieldGroup`. Accepts
 * optional inline content (e.g. "Or continue with").
 */
export function FormFieldSeparator(props: FormFieldSeparatorProps) {
  return <FieldSeparator {...props} />;
}
