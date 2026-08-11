import { InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptySection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Empty</h2>
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>When you receive messages, they will show up here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">New message</Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
