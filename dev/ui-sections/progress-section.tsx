import { Progress } from "@/components/ui/progress";

export function ProgressSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Progress</h2>
      <div className="space-y-4">
        <Progress value={25} className="w-[60%]" />
        <Progress value={50} className="w-[60%]" />
        <Progress value={75} className="w-[60%]" />
      </div>
    </section>
  );
}
