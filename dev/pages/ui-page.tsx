import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AccordionSection,
  AlertDialogSection,
  AlertSection,
  AttachmentSection,
  AvatarSection,
  BadgeSection,
  BreadcrumbSection,
  ButtonSection,
  CardSection,
  CheckboxSection,
  CollapsibleSection,
  DatePickerSection,
  DialogSection,
  DropdownMenuSection,
  EmptySection,
  HoverCardSection,
  InputSection,
  ItemSection,
  MarkerSection,
  PopoverSection,
  ProgressSection,
  QuestionnaireSection,
  RadioGroupSection,
  SelectSection,
  SeparatorSection,
  SkeletonSection,
  SliderSection,
  SpinnerSection,
  SwitchSection,
  TabsSection,
  ToggleSection,
  TooltipSection,
} from "../ui-sections";

const SECTIONS = [
  { id: "accordion", label: "Accordion", Component: AccordionSection },
  { id: "alert", label: "Alert", Component: AlertSection },
  { id: "alert-dialog", label: "Alert Dialog", Component: AlertDialogSection },
  { id: "attachment", label: "Attachment", Component: AttachmentSection },
  { id: "avatar", label: "Avatar", Component: AvatarSection },
  { id: "badge", label: "Badge", Component: BadgeSection },
  { id: "breadcrumb", label: "Breadcrumb", Component: BreadcrumbSection },
  { id: "button", label: "Button", Component: ButtonSection },
  { id: "card", label: "Card", Component: CardSection },
  { id: "checkbox", label: "Checkbox", Component: CheckboxSection },
  { id: "collapsible", label: "Collapsible", Component: CollapsibleSection },
  { id: "date-picker", label: "Date Picker", Component: DatePickerSection },
  { id: "dialog", label: "Dialog", Component: DialogSection },
  { id: "dropdown-menu", label: "Dropdown Menu", Component: DropdownMenuSection },
  { id: "empty", label: "Empty", Component: EmptySection },
  { id: "hover-card", label: "Hover Card", Component: HoverCardSection },
  { id: "input", label: "Input", Component: InputSection },
  { id: "item", label: "Item", Component: ItemSection },
  { id: "marker", label: "Marker", Component: MarkerSection },
  { id: "popover", label: "Popover", Component: PopoverSection },
  { id: "progress", label: "Progress", Component: ProgressSection },
  { id: "questionnaire", label: "Questionnaire", Component: QuestionnaireSection },
  { id: "radio-group", label: "Radio Group", Component: RadioGroupSection },
  { id: "select", label: "Select", Component: SelectSection },
  { id: "separator", label: "Separator", Component: SeparatorSection },
  { id: "skeleton", label: "Skeleton", Component: SkeletonSection },
  { id: "slider", label: "Slider", Component: SliderSection },
  { id: "spinner", label: "Spinner", Component: SpinnerSection },
  { id: "switch", label: "Switch", Component: SwitchSection },
  { id: "tabs", label: "Tabs", Component: TabsSection },
  { id: "toggle", label: "Toggle", Component: ToggleSection },
  { id: "tooltip", label: "Tooltip", Component: TooltipSection },
];

export function UiPage() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <nav className="absolute top-0 -left-60 hidden h-full w-48 xl:block">
        <Card className="sticky top-8 gap-0 py-3">
          <CardHeader className="px-3">
            <CardTitle className="text-sm">Components</CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <ul className="space-y-0.5">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </nav>

      <div className="space-y-8">
        {SECTIONS.map((section, index) => (
          <React.Fragment key={section.id}>
            <section id={section.id} className="scroll-mt-8">
              <section.Component />
            </section>
            {index < SECTIONS.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
