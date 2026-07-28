import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function InputSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Input & Textarea</h2>
      <div className="flex flex-col gap-3 max-w-xs">
        <Input placeholder="Default input" />
        <Input placeholder="Disabled" disabled />
        <Textarea placeholder="Textarea..." />
      </div>
    </section>
  );
}
