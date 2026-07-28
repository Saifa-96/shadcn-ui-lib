import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readFileSync, readdirSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  "react/jsx-runtime",
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
        "block-editor": resolve(__dirname, "src/components/block-editor/editor.tsx"),
        "lib/utils": resolve(__dirname, "src/lib/utils.ts"),
        ...uiEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) =>
        external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
    cssCodeSplit: false,
    emptyOutDir: true,
  },
});
