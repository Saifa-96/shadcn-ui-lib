import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";

export function ToggleSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Toggle</h2>
      <div className="flex items-center gap-2">
        <Toggle aria-label="Toggle bold">
          <Bold className="size-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <Italic className="size-4" />
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <Underline className="size-4" />
        </Toggle>
        <Toggle disabled aria-label="Disabled">
          <Bold className="size-4" />
        </Toggle>
      </div>
    </section>
  );
}
