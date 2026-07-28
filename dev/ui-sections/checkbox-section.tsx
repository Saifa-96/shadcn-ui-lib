import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Checkbox</h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox />
          Accept terms
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox defaultChecked />
          Already checked
        </label>
      </div>
    </section>
  );
}
