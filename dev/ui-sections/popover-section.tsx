import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function PopoverSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Popover</h2>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm text-muted-foreground">
            Popover content goes here.
          </p>
        </PopoverContent>
      </Popover>
    </section>
  );
}
