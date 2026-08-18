import type { Value } from "platejs";
import { useState } from "react";
import type { TDiscussion } from "@/components/block-editor/comments/discussion-kit";
import { BlockEditor, type UploadConfig } from "@/components/block-editor/editor";
import { fromMarkdown, toMarkdown } from "@/components/block-editor/markdown";
import { blockEditorValueSchema } from "@/components/block-editor/schema";
import { type DiscussionData, useBlockEditor } from "@/components/block-editor/use-block-editor";
import { withAgentEdit } from "@/components/block-editor/with-agent-edit";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function BlockEditorPage() {
  const [readOnly, setReadOnly] = useState(false);
  const { editor, setDiscussionData } = useBlockEditor({
    initialValue,
    discussionData,
    onDiscussionChange: (data) => {
      console.log("persist discussions:", data.discussions);
      setPersistedDiscussionCount(data.discussions.length);
    },
  });
  const [blockCount, setBlockCount] = useState(() => initialValue.length);
  const [persistedDiscussionCount, setPersistedDiscussionCount] = useState(0);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          onClick={() => {
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
        <div className="flex items-center space-x-2">
          <Switch id="read-only" checked={readOnly} onCheckedChange={setReadOnly} />
          <Label htmlFor="read-only">Read Only</Label>
        </div>
      </div>
      <button
        type="button"
        className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        onClick={() => setDiscussionData({ ...discussionData, currentUserId: "bob" })}
      >
        Switch current user to Bob
      </button>
      <div className="h-[600px]">
        <BlockEditor
          editor={editor}
          uploadConfig={uploadConfig}
          readOnly={readOnly}
          onValueChange={(value) => setBlockCount(value.length)}
        />
      </div>
      <p className="text-sm text-muted-foreground">Blocks: {blockCount}</p>
      <p className="text-sm text-muted-foreground">
        Discussions (persisted via onDiscussionChange): {persistedDiscussionCount}
      </p>

      <MarkdownPanel editor={editor} />
    </div>
  );
}

// ─── Markdown conversion panel ───────────────────────────────────────────────

function MarkdownPanel({ editor }: { editor: ReturnType<typeof useBlockEditor>["editor"] }) {
  const [md, setMd] = useState(
    "# Heading\n\nHello **world** and *italics*\n\n- [x] done task\n- [ ] open task\n  - nested bullet\n\n1. first\n2. second\n\n> a quote\n\n![image alt](https://picsum.photos/seed/md/320/180)\n\n| K | V |\n| - | - |\n| a | 1 |\n",
  );
  const [status, setStatus] = useState("");

  const exportMd = () => {
    try {
      const value = blockEditorValueSchema.parse(editor.children);
      setMd(toMarkdown(value));
      setStatus("editor → markdown ✓ (schema validated)");
    } catch (error) {
      setStatus(`export failed: ${String(error).slice(0, 200)}`);
    }
  };

  const importMd = () => {
    const value = fromMarkdown(md);
    editor.tf.setValue(value);
    setStatus("markdown → editor ✓");
  };

  const roundtrip = () => {
    const stable = toMarkdown(fromMarkdown(md)) === md.replace(/\s+$/, "");
    setStatus(
      stable
        ? "fromMarkdown(md) is a fixpoint of toMarkdown ✓"
        : "not stable — compare textarea & editor",
    );
    if (!stable) setMd(toMarkdown(fromMarkdown(md)));
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Markdown helpers</h2>
        <button
          type="button"
          className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
          onClick={exportMd}
        >
          Editor → Markdown
        </button>
        <button
          type="button"
          className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
          onClick={importMd}
        >
          Markdown → Editor
        </button>
        <button
          type="button"
          className="rounded border border-border px-3 py-1 text-sm text-foreground"
          onClick={roundtrip}
        >
          Normalize
        </button>
        {status && <span className="text-xs text-muted-foreground">{status}</span>}
      </div>
      <textarea
        className="h-64 w-full rounded-md border border-border bg-background p-3 font-mono text-xs"
        value={md}
        onChange={(e) => setMd(e.target.value)}
        spellCheck={false}
      />
    </section>
  );
}

// ─── Discussion mock data (injected via setDiscussionData) ─────────────────────

const avatarUrl = (seed: string) => `https://api.dicebear.com/9.x/glass/svg?seed=${seed}`;

const users = {
  alice: { id: "alice", avatarUrl: avatarUrl("alice6"), name: "Alice" },
  bob: { id: "bob", avatarUrl: avatarUrl("bob4"), name: "Bob" },
  charlie: { id: "charlie", avatarUrl: avatarUrl("charlie2"), name: "Charlie" },
};

const discussions: TDiscussion[] = [
  {
    id: "discussion1",
    comments: [
      {
        id: "comment1",
        contentRich: [
          {
            children: [
              {
                text: "Comments are a great way to provide feedback and discuss changes.",
              },
            ],
            type: "p",
          },
        ],
        createdAt: new Date(Date.now() - 600_000),
        discussionId: "discussion1",
        isEdited: false,
        userId: "charlie",
      },
      {
        id: "comment2",
        contentRich: [
          {
            children: [{ text: "Agreed! The link to the docs makes it easy to learn more." }],
            type: "p",
          },
        ],
        createdAt: new Date(Date.now() - 500_000),
        discussionId: "discussion1",
        isEdited: false,
        userId: "bob",
      },
    ],
    createdAt: new Date(),
    documentContent: "comments",
    isResolved: false,
    userId: "charlie",
  },
  {
    id: "discussion2",
    comments: [
      {
        id: "comment1",
        contentRich: [
          {
            children: [
              {
                text: "Nice demonstration of overlapping annotations with both comments and suggestions!",
              },
            ],
            type: "p",
          },
        ],
        createdAt: new Date(Date.now() - 300_000),
        discussionId: "discussion2",
        isEdited: false,
        userId: "bob",
      },
      {
        id: "comment2",
        contentRich: [
          {
            children: [{ text: "This helps users understand how powerful the editor can be." }],
            type: "p",
          },
        ],
        createdAt: new Date(Date.now() - 200_000),
        discussionId: "discussion2",
        isEdited: false,
        userId: "charlie",
      },
    ],
    createdAt: new Date(),
    documentContent: "overlapping",
    isResolved: false,
    userId: "bob",
  },
];

const discussionData: DiscussionData = {
  currentUserId: "alice",
  discussions,
  users,
};

// Simulated upload for the showcase: fake progress, resolves to a local object URL.
const uploadConfig: UploadConfig = {
  accept: ["image/*"],
  maxSize: 5 * 1024 * 1024,
  uploadFile: async (file, onProgress) => {
    for (let progress = 0; progress < 100; progress += 2) {
      await new Promise((resolve) => setTimeout(resolve, 25));
      onProgress?.(progress);
    }
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    };
  },
};

const initialValue: Value = [
  {
    type: "h1",
    children: [{ text: "Q3 Product Roadmap" }],
  },
  {
    type: "h2",
    children: [{ text: "Collaborative Editing" }],
  },
  {
    type: "p",
    children: [
      { text: "Review and refine content seamlessly. Use " },
      {
        suggestion: true,
        suggestion_playground1: {
          id: "playground1",
          createdAt: Date.now(),
          type: "insert",
          userId: "alice",
        },
        text: "suggestions",
      },
      {
        suggestion: true,
        suggestion_playground1: {
          id: "playground1",
          createdAt: Date.now(),
          type: "insert",
          userId: "alice",
        },
        text: " ",
      },
      {
        suggestion: true,
        suggestion_playground1: {
          id: "playground1",
          createdAt: Date.now(),
          type: "insert",
          userId: "alice",
        },
        text: "like this added text",
      },
      { text: " or to " },
      {
        suggestion: true,
        suggestion_playground2: {
          id: "playground2",
          createdAt: Date.now(),
          type: "remove",
          userId: "bob",
        },
        text: "mark text for removal",
      },
      { text: ". Discuss changes using " },
      { comment: true, comment_discussion1: true, text: "comments" },
      {
        comment: true,
        comment_discussion1: true,
        text: " on many text segments",
      },
      { text: ". You can even have " },
      {
        comment: true,
        comment_discussion2: true,
        suggestion: true,
        suggestion_playground3: {
          id: "playground3",
          createdAt: Date.now(),
          type: "insert",
          userId: "charlie",
        },
        text: "overlapping",
      },
      { text: " annotations!" },
    ],
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
