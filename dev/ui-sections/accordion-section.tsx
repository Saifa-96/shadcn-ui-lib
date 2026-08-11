import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Accordion</h2>
      <Accordion type="single" collapsible className="w-[350px]">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is this library?</AccordionTrigger>
          <AccordionContent>A shadcn-based React component library.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes, built on top of Radix UI primitives.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I style it?</AccordionTrigger>
          <AccordionContent>Yes, every part accepts a className.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
