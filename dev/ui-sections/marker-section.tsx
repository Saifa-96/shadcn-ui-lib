import { CheckIcon } from "lucide-react";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";

export function MarkerSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Marker</h2>
      <div className="w-[350px] space-y-4">
        <Marker>
          <MarkerIcon>
            <CheckIcon />
          </MarkerIcon>
          <MarkerContent>Explored 4 files</MarkerContent>
        </Marker>
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent>Compacting conversation</MarkerContent>
        </Marker>
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent>Running tests</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>Separator</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>A border marker for row boundaries</MarkerContent>
        </Marker>
      </div>
    </section>
  );
}
