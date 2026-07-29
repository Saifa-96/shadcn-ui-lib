import { Slider } from "@/components/ui/slider";

export function SliderSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Slider</h2>
      <div className="space-y-4">
        <Slider defaultValue={[50]} max={100} step={1} className="w-[60%]" />
        <Slider defaultValue={[25, 75]} max={100} step={1} className="w-[60%]" />
      </div>
    </section>
  );
}
