import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DirectionProvider } from "@/components/ui/direction";

export function DirectionSection() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Direction</h2>
      <DirectionProvider dir={dir}>
        <div className="flex w-[350px] flex-col gap-3">
          <div dir={dir} className="rounded-lg border border-border p-4 text-sm">
            <p className="font-medium text-foreground">Direction: {dir}</p>
            <p className="mt-1 text-muted-foreground">
              This text flows according to the {dir} direction.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setDir(dir === "ltr" ? "rtl" : "ltr")}>
            Toggle to {dir === "ltr" ? "RTL" : "LTR"}
          </Button>
        </div>
      </DirectionProvider>
    </section>
  );
}
