import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function HoverCardSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Hover Card</h2>
      <HoverCard>
        <HoverCardTrigger render={<Button variant="link" />}>@ws-ui</HoverCardTrigger>
        <HoverCardContent>
          <p className="text-sm">Internal UI component library for the workspace.</p>
        </HoverCardContent>
      </HoverCard>
    </section>
  );
}
