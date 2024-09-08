import { getWallets as c } from "@wallet-standard/core";
import { B as o } from "./BrowserWalletNetworkMismatchError-D_4WJV6I.js";
import { B as i, O as d } from "./index-DpaD9iwk.js";
import { s as f, a as u, b as g } from "./index-Ce_KeVGW.js";
async function r() {
  const { get: n } = c(), e = n().find(
    (t) => {
      var a, s;
      return t.name === "Magic Eden" && ((s = (a = t.features["sats-connect:"]) == null ? void 0 : a.provider) == null ? void 0 : s.isMagicEden) === !0;
    }
  );
  if (!e)
    throw new i(
      "Magic Eden Wallet not installed."
    );
  return e.features["sats-connect:"].provider;
}
async function l() {
  if (typeof window > "u")
    throw new d("Cannot call this function outside a browser");
  try {
    const n = await r();
    return n.isMagicEden !== void 0 && n.isMagicEden === !0;
  } catch (n) {
    if (n instanceof i)
      return !1;
    throw n;
  }
}
async function M(n = "mainnet") {
  if (!l())
    throw new i(
      "Magic Eden Wallet not installed."
    );
  if (n !== "mainnet")
    throw new o(
      "Magic Eden Wallet only supports mainnet"
    );
  return f(r, n);
}
async function W(n, {
  finalize: e = !0,
  extractTx: t = !0,
  network: a,
  inputsToSign: s
} = { network: "mainnet", inputsToSign: [] }) {
  if (!l())
    throw new i(
      "Magic Eden Wallet not installed."
    );
  if (a !== "mainnet")
    throw new o(
      "Magic Eden Wallet only supports mainnet"
    );
  return u(r, n, {
    finalize: e,
    extractTx: t,
    network: a,
    inputsToSign: s
  });
}
async function h(n, e, t = "mainnet") {
  if (!l())
    throw new i(
      "Magic Eden Wallet not installed."
    );
  if (t !== "mainnet")
    throw new o(
      "Magic Eden Wallet only supports mainnet"
    );
  return g(
    r,
    n,
    e,
    t
  );
}
export {
  M as getAddresses,
  r as getMagicEdenWalletProvider,
  l as isInstalled,
  h as signMessage,
  W as signPsbt
};
