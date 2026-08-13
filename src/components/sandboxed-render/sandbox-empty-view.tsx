import { FileCodeIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface SandboxEmptyViewProps {
  title?: string;
  description?: string;
}

/**
 * Shown when there is no HTML to render yet.
 */
export function SandboxEmptyView({
  title = "Nothing to preview",
  description = "Provide HTML to render it inside the sandbox.",
}: SandboxEmptyViewProps) {
  return (
    <Empty className="h-full w-full border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileCodeIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
