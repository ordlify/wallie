import { O as n, B as c, j as K, k as g, l as x, d as W } from "./index-DpaD9iwk.js";
import { Psbt as E } from "bitcoinjs-lib";
import { B as p } from "./BrowserWalletSigningError-DZ6p2v9l.js";
import { f as O } from "./utils-pNFWFpI4.js";
function d() {
  if (typeof window > "u")
    throw new n("Cannot call this function outside a browser");
  return typeof window.okxwallet < "u";
}
function u(o = "mainnet") {
  if (!d())
    throw new c("OKX Wallet not installed");
  let e;
  switch (o) {
    case "mainnet":
      e = window.okxwallet.bitcoin;
      break;
    case "testnet":
      e = window.okxwallet.bitcoinTestnet;
      break;
    case "signet":
      e = window.okxwallet.bitcoinSignet;
      break;
    default:
      throw new n("Invalid network");
  }
  if (!e)
    throw new n("Failed to get OKX Wallet provider");
  return e;
}
async function v(o = "mainnet") {
  if (!d())
    throw new c("OKX Wallet not installed");
  const e = u(o);
  try {
    const { address: t, publicKey: s } = await e.connect(), r = K(t, o), i = O(s);
    if (!t || !i || !r)
      throw new n("Failed to get addresses from OKX Wallet");
    return [
      {
        publicKey: i,
        address: t,
        format: r
      }
    ];
  } catch (t) {
    if (t instanceof n)
      throw t;
    const s = t;
    throw s.code === 4001 ? new g() : new n(s.message);
  }
}
async function H(o, {
  finalize: e = !0,
  extractTx: t = !0,
  network: s,
  inputsToSign: r
} = { network: "mainnet", inputsToSign: [] }) {
  if (!d())
    throw new c("OKX Wallet not installed");
  if (t && !e)
    throw new x();
  const i = u(s), l = o.toHex();
  let f = "";
  const m = [];
  r.forEach((a) => {
    const { address: w, signingIndexes: y, sigHash: b } = a;
    y.forEach((k) => {
      m.push({
        index: k,
        address: w,
        sighashTypes: b ? [b] : void 0
      });
    });
  });
  try {
    f = await i.signPsbt(l, {
      autoFinalized: e,
      toSignInputs: m
    });
  } catch (a) {
    const w = a;
    throw w.code === 4001 ? new g() : new n(w.message);
  }
  if (!f)
    throw new p(
      "Failed to sign psbt hex using OKX Wallet"
    );
  const h = E.fromHex(f);
  if (t)
    try {
      return {
        base64: null,
        hex: h.extractTransaction().toHex()
      };
    } catch (a) {
      throw a instanceof Error && a.message === "Not finalized" ? new x() : new n("Failed to extract transaction from PSBT");
    }
  else
    return {
      base64: h.toBase64(),
      hex: h.toHex()
    };
}
async function S(o, e = "ecdsa", t = "mainnet") {
  if (!d())
    throw new c("OKX Wallet not installed");
  const s = u(t);
  let r = "";
  try {
    r = await s.signMessage(o, e);
  } catch (i) {
    const l = i;
    throw l.code === 4001 ? new g() : new n(l.message);
  }
  if (!r)
    throw new p(
      "Failed to sign message using OKX Wallet"
    );
  return {
    base64: r,
    hex: W.from(r, "base64").toString("hex")
  };
}
export {
  v as getAddresses,
  d as isInstalled,
  S as signMessage,
  H as signPsbt
};
