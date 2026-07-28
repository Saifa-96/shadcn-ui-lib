# ws-ui

Internal UI component library based on shadcn/ui patterns.

## How it works

- Components live in `src/` as plain React + Tailwind source.
- No CSS is bundled — consuming projects use Tailwind to scan this package and generate only the classes they use.
- Theme variables and base styles are in `src/styles/globals.css`.

## Consumer setup

```ts
// 1. Import the global styles (CSS variables + base reset)
import "@ws/ui/styles/globals.css";

// 2. Add this package to your Tailwind content paths
//    In your app's CSS where you import tailwindcss:
@source "../../node_modules/@ws/ui/src/**/*.{ts,tsx}";
```

## Dev

```bash
pnpm install
pnpm dev    # starts vite dev server at dev/
```

## Adding components

Copy shadcn component source into `src/components/`, adjust imports to use `@/lib/utils`, and re-export from `src/index.ts`.
