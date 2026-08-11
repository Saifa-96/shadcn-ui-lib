import { createFormHook } from "@tanstack/react-form";

import { BadgeToggleField } from "./badge-toggle-field";
import { CheckboxField } from "./checkbox-field";
import { DateField } from "./date-field";
import { FormFieldGroup } from "./form-field-group";
import { FormFieldSeparator } from "./form-field-separator";
import { FormFieldSet } from "./form-field-set";
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
    DateField,
  },
  formComponents: {
    SubmitButton,
    ResetButton,
    FieldSet: FormFieldSet,
    FieldGroup: FormFieldGroup,
    FieldSeparator: FormFieldSeparator,
  },
  fieldContext,
  formContext,
});

export type { BadgeToggleOption } from "./badge-toggle-field";
export { BadgeToggleField } from "./badge-toggle-field";
export { CheckboxField } from "./checkbox-field";
export { DateField } from "./date-field";
export { FormFieldGroup } from "./form-field-group";
export { FormFieldSeparator } from "./form-field-separator";
export { FormFieldSet } from "./form-field-set";
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
