import { createFormHook } from "@tanstack/react-form";

import { BadgeToggleField } from "./badge-toggle-field";
import { CheckboxField } from "./checkbox-field";
import { RadioGroupField } from "./radio-group-field";
import { ResetButton } from "./reset-button";
import { SelectField } from "./select-field";
import { SliderField } from "./slider-field";
import { SubmitButton } from "./submit-button";
import { SwitchField } from "./switch-field";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { fieldContext, formContext } from "./widgets/context";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    BadgeToggleField,
    CheckboxField,
    SwitchField,
    RadioGroupField,
    SliderField,
  },
  formComponents: {
    SubmitButton,
    ResetButton,
  },
  fieldContext,
  formContext,
});

export type { BadgeToggleOption } from "./badge-toggle-field";
export { BadgeToggleField } from "./badge-toggle-field";
export { CheckboxField } from "./checkbox-field";
export type { RadioGroupOption } from "./radio-group-field";
export { RadioGroupField } from "./radio-group-field";
export { ResetButton } from "./reset-button";
export type { SelectFieldGroup, SelectFieldOption } from "./select-field";
export { SelectField } from "./select-field";
export { SliderField } from "./slider-field";
export { SubmitButton } from "./submit-button";
export { SwitchField } from "./switch-field";
export { TextField } from "./text-field";
export { TextareaField } from "./textarea-field";
export { FieldShell } from "./widgets/field-shell";
