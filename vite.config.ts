import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: "./postcss.config.mjs",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),

    // lib: {
    //   entry: {
    //     index: resolve(__dirname, "src/index.ts"),
    //   },
    //   formats: ["es"],
    // },
    // rollupOptions: {
    //   external: ["react", "react-dom"],
    // },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    eslint(),
    cssInjectedByJsPlugin(),
    nodePolyfills({
      globals: {
        Buffer: true,
      },
    }),
  ],
});
