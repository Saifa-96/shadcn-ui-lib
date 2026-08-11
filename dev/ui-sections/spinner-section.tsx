import { Spinner } from "@/components/ui/spinner";

export function SpinnerSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Spinner</h2>
      <div className="flex items-center gap-4">
        <Spinner />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </div>
    </section>
  );
}
