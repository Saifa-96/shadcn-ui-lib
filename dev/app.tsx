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
    type: "h1",
    children: [{ text: "Q3 Product Roadmap" }],
  },
  {
    type: "p",
    children: [
      { text: "This document outlines the key deliverables for " },
      { text: "Q3 2025", bold: true },
      { text: ". All teams should align sprint goals with these milestones. Priority is determined by customer impact and technical dependencies — if something blocks another team, it ships first." },
    ],
  },
  {
    type: "p",
    children: [
      { text: "We are targeting three major workstreams this quarter: infrastructure hardening, user-facing redesign, and API scalability. Each workstream has a dedicated owner responsible for weekly status updates and cross-team coordination." },
    ],
  },
  {
    type: "p",
    children: [
      { text: "Key principles for this cycle: " },
      { text: "ship incrementally", italic: true },
      { text: ", gather feedback early, and avoid large-batch releases. Feature flags should gate all user-visible changes so we can decouple deploy from release." },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Milestone Overview" }],
  },
  {
    type: "table",
    children: [
      {
        type: "tr",
        children: [
          { type: "th", children: [{ type: "p", children: [{ text: "Milestone" }] }] },
          { type: "th", children: [{ type: "p", children: [{ text: "Owner" }] }] },
          { type: "th", children: [{ type: "p", children: [{ text: "ETA" }] }] },
          { type: "th", children: [{ type: "p", children: [{ text: "Status" }] }] },
        ],
      },
      {
        type: "tr",
        children: [
          { type: "td", children: [{ type: "p", children: [{ text: "Auth v2 migration" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Platform team" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Jul 15" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "In progress" }] }] },
        ],
      },
      {
        type: "tr",
        children: [
          { type: "td", children: [{ type: "p", children: [{ text: "Dashboard redesign" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Design + Frontend" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Aug 01" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Planning" }] }] },
        ],
      },
      {
        type: "tr",
        children: [
          { type: "td", children: [{ type: "p", children: [{ text: "API rate limiting" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Backend team" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Aug 20" }] }] },
          { type: "td", children: [{ type: "p", children: [{ text: "Not started" }] }] },
        ],
      },
    ],
  },
  {
    type: "h3",
    children: [{ text: "Notes" }],
  },
  {
    type: "blockquote",
    children: [
      {
        type: "p",
        children: [
          { text: "Auth v2 is a hard dependency for the dashboard redesign. Do " },
          { text: "not", italic: true },
          { text: " start frontend work until the migration reaches staging." },
        ],
      },
    ],
  },
  {
    type: "p",
    children: [
      { text: "Reach out to " },
      { text: "@platform-leads", underline: true },
      { text: " for blockers or scope changes." },
    ],
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
