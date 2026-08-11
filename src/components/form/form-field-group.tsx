import type * as React from "react";

import { FieldGroup } from "@/components/ui/field";

type FormFieldGroupProps = React.ComponentProps<typeof FieldGroup>;

/**
 * Layout container that stacks `Field` components and provides the
 * container-query context (`@container/field-group`) so fields with
 * `orientation="responsive"` switch layouts at container breakpoints.
 */
export function FormFieldGroup(props: FormFieldGroupProps) {
  return <FieldGroup {...props} />;
}
