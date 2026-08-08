import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function CollapsibleSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Collapsible</h2>
      <Collapsible open={open} onOpenChange={setOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">3 items</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="size-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm">Item 1</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 text-sm">Item 2</div>
          <div className="rounded-md border px-4 py-2 text-sm">Item 3</div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
