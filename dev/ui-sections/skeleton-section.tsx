import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Skeleton</h2>
      <div className="flex items-center space-x-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </section>
  );
}
