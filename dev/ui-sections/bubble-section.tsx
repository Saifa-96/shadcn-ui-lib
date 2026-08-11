import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";

export function BubbleSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Bubble</h2>
      <div className="space-y-4">
        <BubbleGroup className="max-w-[350px]">
          <Bubble>
            <BubbleContent>Default bubble</BubbleContent>
          </Bubble>
          <Bubble variant="secondary">
            <BubbleContent>Secondary bubble</BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>Muted bubble</BubbleContent>
          </Bubble>
          <Bubble variant="tinted">
            <BubbleContent>Tinted bubble</BubbleContent>
          </Bubble>
          <Bubble variant="outline">
            <BubbleContent>Outline bubble</BubbleContent>
          </Bubble>
          <Bubble variant="ghost">
            <BubbleContent>Ghost bubble</BubbleContent>
          </Bubble>
          <Bubble variant="destructive">
            <BubbleContent>Destructive bubble</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </div>
    </section>
  );
}
