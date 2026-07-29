import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readFileSync, readdirSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
const srcDir = resolve(__dirname, "src");
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const uiEntries = Object.fromEntries(
  readdirSync("src/components/ui")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => [`components/ui/${f.replace(".tsx", "")}`, resolve(__dirname, `src/components/ui/${f}`)])
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
        index: resolve(__dirname, "src/index.ts"),
        ui: resolve(__dirname, "src/ui.ts"),
        "block-editor": resolve(__dirname, "src/block-editor.ts"),
        lib: resolve(__dirname, "src/lib.ts"),
        hooks: resolve(__dirname, "src/hooks.ts"),
        ...uiEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) =>
        external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
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
