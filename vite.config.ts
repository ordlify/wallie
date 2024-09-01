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
      entry: resolve(__dirname, "src/index.ts"),
      name: "Wallie",
      fileName: "index", // Ensures the output is `index.js`
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Keep external dependencies out of the bundle
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
        Buffer: true,
      },
    }),
  ],
});
