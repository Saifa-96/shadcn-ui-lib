import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function ItemSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Item</h2>
      <ItemGroup className="w-[350px]">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <FileIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>README.md</ItemTitle>
            <ItemDescription>Updated 2 hours ago</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Item>
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <FolderIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>src/components</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
    </section>
  );
}
