import { useState } from "react";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";

const items = [
  {
    name: "direction",
    required: true,
    prompt: "What should we prototype next?",
    description: "Choose a direction for the next iteration.",
    choices: [
      {
        value: "delegation",
        label: "Delegation",
        description: "Show how work moves to a specialist.",
      },
      {
        value: "questions",
        label: "Question prompts",
        description: "Show choices while the interface waits.",
      },
      { value: "both", label: "Both together" },
    ],
  },
  {
    name: "detail",
    required: false,
    prompt: "How much detail should it include?",
    description: "Skip this if you are not sure yet.",
    choices: [
      { value: "focused", label: "Focused", description: "Just the happy path." },
      { value: "complete", label: "Complete flow", description: "Cover edge cases too." },
    ],
  },
] as const;

export function QuestionnaireSection() {
  const [result, setResult] = useState("");

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Questionnaire</h2>
      <Questionnaire
        className="max-w-lg"
        items={items}
        shortcuts="letters"
        onSubmit={(answers) => setResult(JSON.stringify(answers))}
      >
        <QuestionnaireProgress />
        {items.map((question) => (
          <QuestionnaireItem key={question.name} name={question.name} required={question.required}>
            <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
            <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
            <QuestionnaireChoices>
              {question.choices.map((choice) => (
                <QuestionnaireChoice key={choice.value} value={choice.value}>
                  {choice.label}
                  {"description" in choice && (
                    <QuestionnaireChoiceDescription>
                      {choice.description}
                    </QuestionnaireChoiceDescription>
                  )}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
      {result && <p className="text-sm text-muted-foreground">Submitted: {result}</p>}
    </section>
  );
}
