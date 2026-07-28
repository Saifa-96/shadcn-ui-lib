import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  ButtonSection,
  InputSection,
  CheckboxSection,
  SelectSection,
  DialogSection,
  AlertDialogSection,
  DropdownMenuSection,
  PopoverSection,
  TooltipSection,
  HoverCardSection,
  AvatarSection,
  SeparatorSection,
} from "./ui-sections";

export function App() {
  return (
    <TooltipProvider>
      <div className="mx-auto max-w-3xl space-y-8 p-8">
        <h1 className="text-2xl font-bold text-foreground">ws-ui component preview</h1>

        <ButtonSection />
        <Separator />
        <InputSection />
        <Separator />
        <CheckboxSection />
        <Separator />
        <SelectSection />
        <Separator />
        <DialogSection />
        <Separator />
        <AlertDialogSection />
        <Separator />
        <DropdownMenuSection />
        <Separator />
        <PopoverSection />
        <Separator />
        <TooltipSection />
        <Separator />
        <HoverCardSection />
        <Separator />
        <AvatarSection />
        <Separator />
        <SeparatorSection />
      </div>
    </TooltipProvider>
  );
}
