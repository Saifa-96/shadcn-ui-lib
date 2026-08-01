# Agent Coding Defaults

These rules are mandatory whenever writing code in this repository.

## What this project is

A shadcn-based React component library. It re-exports shadcn/ui components plus our own higher-level components (e.g. `block-editor`) as a publishable package. `dev/` is a Vite showcase app for local development, not part of the published library.

## The golden rule: two kinds of components

### `src/components/ui/` — shadcn-managed, DO NOT EDIT

Everything under `src/components/ui/` is vendored shadcn/ui code, together with its supporting files:

- `src/hooks/` (e.g. `use-mobile.ts`)
- `src/lib/utils.ts` (`cn`)

**Never edit these files directly.** Any change — adding, updating, or restyling a shadcn component — must go through the shadcn CLI, which overwrites them:

```bash
npx shadcn@latest add <component>
```

If a shadcn component doesn't do what you need, don't patch it — wrap it in your own component under a new folder in `src/components/` and compose from there.

### After installing a component via shadcn CLI

Adding the file is only step one. Every new shadcn component must also be exported and showcased:

1. **Export** — add `export * from "./components/ui/<name>";` to `src/ui.ts` (keep alphabetical order). Build entries are auto-globbed from `src/components/ui/*.tsx`, so no build config change is needed.
2. **Showcase** — create `dev/ui-sections/<name>-section.tsx` with the component's key variants and states, re-export it from `dev/ui-sections/index.ts`, and register it in the `SECTIONS` list in `dev/pages/ui-page.tsx`.
3. **Verify** — run `pnpm typecheck`, `pnpm lint`, and `pnpm build` before committing.

### Other folders in `src/components/` — ours, editable

Folders like `src/components/block-editor/` are our own components built on top of `components/ui`. These may be modified freely.

- One folder = one component. Keep a component's blocks, plugins, toolbars, and helpers inside its own folder.
- New self-contained components get their own folder under `src/components/`, not new files in `components/ui/`.

## Commands

```bash
pnpm dev        # showcase app (start it yourself; agents must not start long-running servers)
pnpm typecheck  # tsc --noEmit — run after every change
pnpm build      # library build — run before considering a change done
```

## Git

- Never commit unless the user explicitly asks.
- Never push or run remote-impacting git commands without explicit confirmation.
