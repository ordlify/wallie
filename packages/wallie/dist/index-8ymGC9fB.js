import { k as P, O as i, B as l, m as p, n as b, d as y, l as f } from "./index-DpaD9iwk.js";
import { Psbt as x } from "bitcoinjs-lib";
import { B as O } from "./BrowserWalletNetworkMismatchError-D_4WJV6I.js";
var Y = /* @__PURE__ */ ((e) => (e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ALL_ANYONECANPAY = 129] = "ALL_ANYONECANPAY", e[e.NONE_ANYONECANPAY = 130] = "NONE_ANYONECANPAY", e[e.SINGLE_ANYONECANPAY = 131] = "SINGLE_ANYONECANPAY", e))(Y || {}), c = /* @__PURE__ */ ((e) => (e.P2WPKH = "p2wpkh", e.P2TR = "p2tr", e))(c || {});
async function w(e, o) {
  try {
    return (await window.LeatherProvider.request(
      e,
      o
    )).result;
  } catch (t) {
    const s = t, { message: r } = s.error;
    throw s.error.code === 4001 ? new P(r) : new i(`Leather error: ${r}`);
  }
}
function d() {
  if (typeof window > "u")
    throw new i("Cannot call this function outside a browser");
  return typeof window.LeatherProvider < "u";
}
async function C(e = "mainnet") {
  if (!d())
    throw new l("Leather not installed");
  const t = (await w("getAddresses", {
    network: e
  })).addresses.filter(
    (r) => r.type === c.P2TR || r.type === c.P2WPKH
  ), s = p(t[0].address);
  if (e !== "signet" && s !== e || e === "signet" && s !== "testnet")
    throw new O(
      "Leather network mismatch, please switch it manually"
    );
  return t.map((r) => ({
    publicKey: r.publicKey,
    address: r.address,
    format: b[r.type]
  }));
}
async function L(e, { network: o = "mainnet", paymentType: t }) {
  if (!d())
    throw new l("Leather not installed");
  const { signature: s } = await w(
    "signMessage",
    {
      message: e,
      paymentType: t,
      network: o
    }
  );
  return {
    base64: s,
    hex: y.from(s, "base64").toString("hex")
  };
}
async function g(e, {
  finalize: o = !0,
  extractTx: t = !0,
  allowedSighash: s,
  accountNumber: r,
  network: A = "mainnet",
  signAtIndexes: N = []
} = {}) {
  if (!d())
    throw new l("Leather not installed");
  if (t && !o)
    throw new f();
  const E = e.toHex(), m = await w("signPsbt", {
    hex: E,
    allowedSighash: s,
    account: r,
    network: A,
    signAtIndex: N,
    broadcast: !1
  }), n = x.fromHex(m.hex);
  if (o && N.forEach((a) => {
    try {
      n.finalizeInput(a);
    } catch (u) {
      throw console.error("Sign psbt error", u), new i("Failed to finalize input");
    }
  }), t)
    try {
      return {
        base64: null,
        hex: n.extractTransaction().toHex()
      };
    } catch (a) {
      throw a instanceof Error && a.message === "Not finalized" ? new f() : new i("Failed to extract transaction from PSBT");
    }
  return {
    base64: n.toBase64(),
    hex: n.toHex()
  };
}
export {
  c as L,
  L as a,
  Y as b,
  C as g,
  d as i,
  w as l,
  g as s
};
