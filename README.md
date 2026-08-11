# shadcn-ui-lib

Internal UI component library built on [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) + Tailwind CSS v4.

## How it works

- Components are pre-built as ESM with full type declarations.
- All dependencies (Radix UI, platejs, etc.) are bundled — consumers only need to install peer dependencies.
- Multi-entry build with `sideEffects: false` enables tree-shaking: only imported components end up in your bundle.
- Theme variables and base styles are exported via `src/styles/globals.css` — Tailwind utility classes are generated on demand by the consuming project.

## Usage in your project

### 1. Install

```bash
pnpm add shadcn-ui-lib
```

Peer dependencies (install if not already present; `react`/`react-dom` are assumed since this is a React library):

```bash
pnpm add lucide-react zod @tanstack/react-form
```

### 2. Setup Tailwind

Install Tailwind CSS v4 in your project, then in your app's entry CSS file:

```css
@import "shadcn-ui-lib/styles/globals.css";
@import "shadcn-ui-lib/styles/scrollbar.css";
@source "../node_modules/shadcn-ui-lib/src";
```

> Adjust the `@source` path based on where your CSS entry file lives relative to `node_modules`.

### 3. Use components

```tsx
import { Button, Dialog, DialogContent, DialogTrigger } from "shadcn-ui-lib";
import { BlockEditor } from "shadcn-ui-lib/block-editor";
import { useAppForm } from "shadcn-ui-lib/form";
```

## Dev

```bash
pnpm install
pnpm dev        # starts vite dev server with component showcase
pnpm build      # builds ESM output to dist/
pnpm typecheck  # runs tsc --noEmit
```

## Adding components

Use the shadcn CLI with Radix UI style (configured in `components.json`):

```bash
pnpm dlx shadcn@latest add <component>
```

Then follow the export + showcase steps in `AGENTS.md`.
