import { Badge } from "@/components/ui/badge";

export function BadgeSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Badge</h2>
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    </section>
  );
}
