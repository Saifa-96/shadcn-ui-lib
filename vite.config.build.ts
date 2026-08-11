import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
const srcDir = resolve(__dirname, "src");
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const uiEntries = Object.fromEntries(
  readdirSync("src/components/ui")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => [
      `components/ui/${f.replace(".tsx", "")}`,
      resolve(__dirname, `src/components/ui/${f}`),
    ]),
);

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      outDirs: "dist",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: {
        ui: resolve(__dirname, "src/ui.ts"),
        "block-editor": resolve(__dirname, "src/block-editor.ts"),
        form: resolve(__dirname, "src/form.ts"),
        lib: resolve(__dirname, "src/lib.ts"),
        hooks: resolve(__dirname, "src/hooks.ts"),
        ...uiEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: srcDir,
        entryFileNames: "[name].js",
      },
    },
    cssCodeSplit: false,
    emptyOutDir: true,
  },
});
