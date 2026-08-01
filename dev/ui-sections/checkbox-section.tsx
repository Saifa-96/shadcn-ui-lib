import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Checkbox</h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id="checkbox-terms" />
          <label htmlFor="checkbox-terms" className="text-sm text-foreground">
            Accept terms
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="checkbox-checked" defaultChecked />
          <label htmlFor="checkbox-checked" className="text-sm text-foreground">
            Already checked
          </label>
        </div>
      </div>
    </section>
  );
}
