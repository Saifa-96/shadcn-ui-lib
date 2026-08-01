import type { SlateEditor, Value } from "platejs";
import { useRef } from "react";
import { BlockEditor } from "@/components/block-editor/editor";
import { withAgentEdit } from "@/components/block-editor/with-agent-edit";

export function BlockEditorPage() {
  const editorRef = useRef<SlateEditor | null>(null);

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        onClick={() => {
          const editor = editorRef.current;
          if (!editor) return;
          const result = withAgentEdit(editor, () => {
            editor.tf.insertNodes(
              {
                type: "p",
                children: [{ text: "🤖 This paragraph was inserted by withAgentEdit!" }],
              },
              { at: [editor.children.length] },
            );
          });
          console.log("withAgentEdit result:", result);
        }}
      >
        Agent Edit: Insert Paragraph
      </button>
      <BlockEditor
        initialValue={initialValue}
        onEditorReady={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
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
      {
        text: ". All teams should align sprint goals with these milestones. Priority is determined by customer impact and technical dependencies — if something blocks another team, it ships first.",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "We are targeting three major workstreams this quarter: infrastructure hardening, user-facing redesign, and API scalability. Each workstream has a dedicated owner responsible for weekly status updates and cross-team coordination.",
      },
    ],
  },
  {
    type: "p",
    children: [
      { text: "Key principles for this cycle: " },
      { text: "ship incrementally", italic: true },
      {
        text: ", gather feedback early, and avoid large-batch releases. Feature flags should gate all user-visible changes so we can decouple deploy from release.",
      },
    ],
  },
  {
    type: "img",
    children: [{ text: "" }],
    url: "https://github.com/shadcn.png",
    caption: [{ text: "An image block with a caption" }],
  },
  {
    type: "h2",
    children: [{ text: "Lists" }],
  },
  {
    type: "p",
    children: [{ text: "Frontend tasks" }],
    listStyleType: "disc",
    indent: 1,
  },
  {
    type: "p",
    children: [{ text: "Dashboard redesign" }],
    listStyleType: "disc",
    indent: 2,
  },
  {
    type: "p",
    children: [{ text: "Auth v2 UI" }],
    listStyleType: "circle",
    indent: 3,
  },
  {
    type: "p",
    children: [{ text: "Backend tasks" }],
    listStyleType: "disc",
    indent: 1,
  },
  {
    type: "p",
    children: [{ text: "Rate limiting" }],
    listStyleType: "disc",
    indent: 2,
  },
  {
    type: "h2",
    children: [{ text: "Release Steps" }],
  },
  {
    type: "p",
    children: [{ text: "Merge feature branch" }],
    listStyleType: "decimal",
    indent: 1,
    listStart: 1,
  },
  {
    type: "p",
    children: [{ text: "Run integration tests" }],
    listStyleType: "decimal",
    indent: 1,
    listStart: 2,
  },
  {
    type: "p",
    children: [{ text: "Deploy to staging" }],
    listStyleType: "decimal",
    indent: 1,
    listStart: 3,
  },
  {
    type: "p",
    children: [{ text: "Get sign-off from QA" }],
    listStyleType: "decimal",
    indent: 1,
    listStart: 4,
  },
  {
    type: "h2",
    children: [{ text: "Pre-launch Checklist" }],
  },
  {
    type: "p",
    children: [{ text: "Write release notes" }],
    listStyleType: "todo",
    indent: 1,
    checked: true,
  },
  {
    type: "p",
    children: [{ text: "Update API docs" }],
    listStyleType: "todo",
    indent: 1,
    checked: true,
  },
  {
    type: "p",
    children: [{ text: "Notify stakeholders" }],
    listStyleType: "todo",
    indent: 1,
    checked: false,
  },
  {
    type: "p",
    children: [{ text: "Monitor error rates post-deploy" }],
    listStyleType: "todo",
    indent: 1,
    checked: false,
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
