import { O as l, B as s } from "./index-DpaD9iwk.js";
import { s as d, a as c, b as w, c as f } from "./index-Ce_KeVGW.js";
function r() {
  var e;
  if (typeof window > "u")
    throw new l("Cannot call this function outside a browser");
  return typeof ((e = window.XverseProviders) == null ? void 0 : e.BitcoinProvider) < "u";
}
async function i() {
  if (!r())
    throw new s("Selected wallet not installed");
  return window.XverseProviders.BitcoinProvider;
}
async function g(e = "mainnet") {
  if (!r())
    throw new s("Selected wallet not installed");
  return d(i, e);
}
async function m(e, {
  finalize: t = !0,
  extractTx: n = !0,
  network: o,
  inputsToSign: a
} = { network: "mainnet", inputsToSign: [] }) {
  if (!r())
    throw new s("Selected wallet not installed");
  return c(i, e, {
    finalize: t,
    extractTx: n,
    network: o,
    inputsToSign: a
  });
}
async function v(e, t, n = "mainnet") {
  if (!r())
    throw new s("Selected wallet not installed");
  return w(
    i,
    e,
    t,
    n
  );
}
async function h(e, t, n, o, a = "mainnet") {
  if (!r())
    throw new s("Selected wallet not installed");
  return f(
    i,
    e,
    t,
    n,
    o,
    a
  );
}
export {
  g as getAddresses,
  r as isInstalled,
  h as sendBtc,
  v as signMessage,
  m as signPsbt
};
