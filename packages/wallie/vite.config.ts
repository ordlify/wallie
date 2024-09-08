import { resolve } from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react-swc";

import * as packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: "./postcss.config.mjs",
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        magiceden: resolve(__dirname, "src/browser-wallets/magiceden/index.ts"),
        unisat: resolve(__dirname, "src/browser-wallets/unisat/index.ts"),
        xverse: resolve(__dirname, "src/browser-wallets/xverse/index.ts"),
        leather: resolve(__dirname, "src/browser-wallets/leather/index.ts"),
        okx: resolve(__dirname, "src/browser-wallets/okx/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@bitcoinerlab/secp256k1",
        "@wallet-standard/core",
        "bignumber.js",
        "bip32",
        "bip39",
        "bitcoin-address-validation",
        "bitcoinjs-lib",
        "bitcoinjs-message",
        "buffer-reverse",
        "cross-fetch",
        "ecpair",
        "sats-connect",
      ],
    },
    commonjsOptions: {
      include: [/node_modules/, ...Object.keys(packageJson.peerDependencies)],
    },
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
