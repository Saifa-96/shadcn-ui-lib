# ws-ui

Internal UI component library built on [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) + Tailwind CSS v4.

## How it works

- Components live in `src/` as plain React + Tailwind source (Base UI as headless primitive layer).
- No CSS is bundled — consuming projects use Tailwind to scan this package and generate only the utility classes they use.
- Theme variables and base styles are exported via `src/styles/globals.css`.

## Usage in your project

### 1. Install

```bash
pnpm add @ws/ui
```

Peer dependencies (install if not already present):

```bash
pnpm add react react-dom lucide-react
```

### 2. Import global styles

In your app's entry CSS file, import the global styles (CSS variables + Tailwind base reset):

```css
@import "@ws/ui/styles/globals.css";
```

### 3. Add Tailwind source scanning

In the same CSS file, tell Tailwind to scan this package's components so utility classes are generated on demand:

```css
@source "../../node_modules/@ws/ui/src/**/*.{ts,tsx}";
```

> Adjust the relative path based on where your CSS entry file lives relative to `node_modules`.

### 4. Use components

```tsx
import { Button } from "@ws/ui";
import { Dialog, DialogContent, DialogTrigger } from "@ws/ui";
```

## Dev

```bash
pnpm install
pnpm dev    # starts vite dev server with component showcase
```

## Adding components

Use the shadcn CLI with Base UI style:

```bash
pnpm dlx shadcn@latest add <component>
```

Or manually copy component source into `src/components/ui/` and re-export from `src/index.ts`.
