import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: "./postcss.config.mjs",
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
      formats: ["es"],
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    eslint(),
    nodePolyfills({
      globals: {
        // required for ordit-sdk functionality
        Buffer: true,
      },
    }),
  ],
});
