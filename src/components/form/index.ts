import { createFormHook } from "@tanstack/react-form";

import { BadgeToggleField } from "./badge-toggle-field";
import { SelectField } from "./select-field";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { fieldContext, formContext } from "./widgets/context";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    BadgeToggleField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

export type { BadgeToggleOption } from "./badge-toggle-field";
export { BadgeToggleField } from "./badge-toggle-field";
export type { SelectFieldGroup, SelectFieldOption } from "./select-field";
export { SelectField } from "./select-field";
export { SubmitButton } from "./submit-button";
export { TextField } from "./text-field";
export { TextareaField } from "./textarea-field";
export { FieldShell } from "./widgets/field-shell";
