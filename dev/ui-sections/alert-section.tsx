import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

export function AlertSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Alert</h2>
      <div className="space-y-3">
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>This is a default alert message.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
