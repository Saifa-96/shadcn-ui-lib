import { toast } from "sonner";
import { z } from "zod";

import { useAppForm } from "@/components/form";
import { Toaster } from "@/components/ui/sonner";

const ROLE_GROUPS = [
  {
    label: "Engineering",
    options: [
      { value: "frontend", label: "Frontend" },
      { value: "backend", label: "Backend" },
    ],
  },
  {
    label: "Design",
    options: [{ value: "product-design", label: "Product Design" }],
  },
];

const SKILL_OPTIONS = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "css", label: "CSS" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  bio: z.string().max(200, "Keep it under 200 characters"),
  role: z.string().min(1, "Pick a role"),
  skills: z.array(z.string()).min(1, "Pick at least one skill"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = { name: "", bio: "", role: "", skills: [] };

export function FormPage() {
  const form = useAppForm({
    defaultValues,
    validators: { onChange: formSchema },
    onSubmit: ({ value }) => {
      toast.success("Submitted", { description: JSON.stringify(value) });
    },
  });

  return (
    <div className="mx-auto max-w-md">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" required placeholder="Ada Lovelace" />}
        </form.AppField>

        <form.AppField name="bio">
          {(field) => (
            <field.TextareaField label="Bio" description="Optional. 200 characters max." />
          )}
        </form.AppField>

        <form.AppField name="role">
          {(field) => (
            <field.SelectField
              label="Role"
              required
              placeholder="Pick a role"
              groups={ROLE_GROUPS}
            />
          )}
        </form.AppField>

        <form.AppField name="skills">
          {(field) => <field.BadgeToggleField label="Skills" options={SKILL_OPTIONS} />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton pendingLabel="Submitting…">Submit</form.SubmitButton>
        </form.AppForm>
      </form>

      <Toaster />
    </div>
  );
}
