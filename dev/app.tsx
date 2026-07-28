import { useState } from "react";
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
import { BlockEditor } from "@/components/block-editor/editor";
import { Value } from "platejs";

type Tab = "ui" | "block-editor";

export function App() {
  const [tab, setTab] = useState<Tab>("ui");

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-foreground">ws-ui dev</h1>

        <nav className="mt-4 flex gap-1 border-b border-border">
          <TabButton active={tab === "ui"} onClick={() => setTab("ui")}>
            UI Components
          </TabButton>
          <TabButton active={tab === "block-editor"} onClick={() => setTab("block-editor")}>
            Block Editor
          </TabButton>
        </nav>

        <div className="mt-8">
          {tab === "ui" && <UiTab />}
          {tab === "block-editor" && <BlockEditor initialValue={initialValue} />}
        </div>
      </div>
    </TooltipProvider>
  );
}

const initialValue: Value = [
  {
    children: [{ text: "Title" }],
    type: "h3",
  },
  {
    children: [
      {
        children: [{ text: "This is a quote." }],
        type: "p",
      },
    ],
    type: "blockquote",
  },
  {
    children: [
      { text: "With some " },
      { bold: true, text: "bold" },
      { text: " text for emphasis!" },
    ],
    type: "p",
  },
];


interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-b-2 border-primary text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function UiTab() {
  return (
    <div className="space-y-8">
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
  );
}
