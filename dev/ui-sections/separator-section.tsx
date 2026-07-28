import { Separator } from "@/components/ui/separator";

export function SeparatorSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Separator</h2>
      <div className="space-y-2">
        <p className="text-sm text-foreground">Content above</p>
        <Separator />
        <p className="text-sm text-foreground">Content below</p>
      </div>
      <div className="flex h-6 items-center gap-3">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </section>
  );
}
