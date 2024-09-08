import { O as w, B as c, j as g, k as d, l as f, d as h } from "./index-DpaD9iwk.js";
import { Psbt as m } from "bitcoinjs-lib";
import { B as u } from "./BrowserWalletSigningError-DZ6p2v9l.js";
const b = {
  mainnet: "livenet",
  testnet: "testnet"
};
function l() {
  if (typeof window > "u")
    throw new w("Cannot call this function outside a browser");
  return typeof window.unisat < "u";
}
async function B(o = "mainnet", i) {
  if (o === "signet")
    throw new w("signet network is not supported");
  if (!l())
    throw new c("Unisat not installed");
  try {
    const t = await window.unisat.getNetwork(), e = b[o];
    t !== e && await window.unisat.switchNetwork(e);
    const n = i ? await window.unisat.getAccounts() : await window.unisat.requestAccounts(), r = await window.unisat.getPublicKey(), s = n[0];
    if (!s)
      return [];
    const a = g(s, o);
    return [
      {
        publicKey: r,
        address: s,
        format: a
      }
    ];
  } catch (t) {
    if (t instanceof w)
      throw t;
    const e = t;
    throw (e == null ? void 0 : e.code) === 4001 ? new d() : new w(e.message);
  }
}
async function N(o, { finalize: i = !0, extractTx: t = !0 } = {}) {
  if (!l())
    throw new c("Unisat not installed");
  if (t && !i)
    throw new f();
  const e = o.toHex();
  let n = "";
  try {
    n = await window.unisat.signPsbt(e, {
      autoFinalized: i
    });
  } catch (s) {
    const a = s;
    if ((a == null ? void 0 : a.code) === 4001)
      throw new d();
  }
  if (!n)
    throw new u("Failed to sign psbt hex using Unisat");
  const r = m.fromHex(n);
  if (t)
    try {
      return {
        base64: null,
        hex: r.extractTransaction().toHex()
      };
    } catch (s) {
      throw s instanceof Error && s.message === "Not finalized" ? new f() : new w("Failed to extract transaction from PSBT");
    }
  else
    return {
      base64: r.toBase64(),
      hex: r.toHex()
    };
}
async function P(o, i = "ecdsa") {
  if (!l())
    throw new c("Unisat not installed");
  let t = "";
  try {
    t = await window.unisat.signMessage(o, i);
  } catch (e) {
    const n = e;
    if ((n == null ? void 0 : n.code) === 4001)
      throw new d();
  }
  if (!t)
    throw new u("Failed to sign message using Unisat");
  return {
    base64: t,
    hex: h.from(t, "base64").toString("hex")
  };
}
export {
  B as getAddresses,
  l as isInstalled,
  P as signMessage,
  N as signPsbt
};
