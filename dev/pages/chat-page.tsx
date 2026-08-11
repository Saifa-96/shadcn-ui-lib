import { Fragment } from "react";

import { Separator } from "@/components/ui/separator";
import {
  BubbleSection,
  DirectionSection,
  MessageScrollerSection,
  MessageSection,
  QuestionnaireSection,
} from "../ui-sections";

const SECTIONS = [
  { id: "message", label: "Message", Component: MessageSection },
  { id: "bubble", label: "Bubble", Component: BubbleSection },
  { id: "message-scroller", label: "Message Scroller", Component: MessageScrollerSection },
  { id: "questionnaire", label: "Questionnaire", Component: QuestionnaireSection },
  { id: "direction", label: "Direction", Component: DirectionSection },
];

export function ChatPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {SECTIONS.map((section, index) => (
        <Fragment key={section.id}>
          <section id={section.id} className="scroll-mt-20">
            <section.Component />
          </section>
          {index < SECTIONS.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
}
