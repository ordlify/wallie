import { O as l, l as y, k as p, d as E, j as O } from "./index-DpaD9iwk.js";
import { initEccLib as T, Psbt as P } from "bitcoinjs-lib";
import { BitcoinNetworkType as B, getAddress as x, signTransaction as S, signMessage as W, sendBtcTransaction as v } from "sats-connect";
import * as I from "@bitcoinerlab/secp256k1";
import { B as g } from "./BrowserWalletSigningError-DZ6p2v9l.js";
import { f as K } from "./utils-pNFWFpI4.js";
const u = {
  mainnet: B.Mainnet,
  testnet: B.Testnet
};
T(I);
async function M(d, t = "mainnet") {
  if (t === "signet")
    throw new l("signet network is not supported");
  const o = [], a = (e) => {
    if (!e || !e.addresses || e.addresses.length !== 2)
      throw new g(
        "Failed to retrieve addresses using selected wallet"
      );
    e.addresses.forEach((s) => {
      const c = O(s.address, t);
      let r = s.publicKey;
      c === "taproot" && (r = K(s.publicKey)), o.push({
        publicKey: r,
        address: s.address,
        format: c
      });
    });
  }, i = () => {
    throw new p();
  }, n = {
    payload: {
      purposes: ["ordinals", "payment"],
      message: "Provide access to Payment address and Ordinals address",
      network: {
        type: u[t]
      }
    },
    getProvider: d,
    onFinish: (e) => a(e),
    onCancel: i
  };
  return await x(n), o;
}
async function R(d, t, {
  finalize: o = !0,
  extractTx: a = !0,
  network: i,
  inputsToSign: n
} = { network: "mainnet", inputsToSign: [] }) {
  if (i === "signet")
    throw new l("signet network is not supported");
  if (!o && a)
    throw new y();
  if (!t || !i || !n.length)
    throw new l("Invalid options provided");
  let e, s = null;
  const c = (F) => {
    const { psbtBase64: m } = F;
    if (!m)
      throw new g(
        "Failed to sign psbt using selected wallet"
      );
    const h = P.fromBase64(m);
    if (o && n.forEach((f) => {
      f.signingIndexes.forEach((b) => {
        try {
          h.finalizeInput(b);
        } catch (C) {
          throw console.error("Sign psbt error", C), new l("Failed to finalize input");
        }
      });
    }), a) {
      try {
        e = h.extractTransaction().toHex();
      } catch (f) {
        throw f instanceof Error && f.message === "Not finalized" ? new y() : new l("Failed to extract transaction from PSBT");
      }
      s = null;
    } else
      e = h.toHex(), s = h.toBase64();
  }, r = () => {
    throw new p();
  }, w = {
    payload: {
      network: {
        type: u[i]
      },
      message: "Sign PSBT",
      psbtBase64: t.toBase64(),
      broadcast: !1,
      inputsToSign: n
    },
    onFinish: c,
    onCancel: r,
    getProvider: d
  };
  return await S(w), { hex: e, base64: s };
}
async function H(d, t, o, a = "mainnet") {
  if (a === "signet")
    throw new l("signet network is not supported");
  if (!t || !a || !o)
    throw new l("Invalid options provided");
  let i, n = null;
  const e = (r) => {
    if (!r)
      throw new g(
        "Failed to sign message using selected wallet"
      );
    i = E.from(r, "base64").toString("hex"), n = r;
  }, s = () => {
    throw new p();
  }, c = {
    payload: {
      network: {
        type: u[a]
      },
      message: t,
      address: o
    },
    getProvider: d,
    onFinish: e,
    onCancel: s
  };
  return await W(c), { hex: i, base64: n };
}
async function q(d, t, o, a, i, n = "mainnet") {
  if (n === "signet")
    throw new l("signet network is not supported");
  if (!t || !n || !o)
    throw new l("Invalid options provided");
  let e;
  const s = (w) => {
    if (!w)
      throw new g(
        "Failed to sign message using selected wallet"
      );
    e = w;
  }, c = () => {
    throw new p();
  }, r = {
    payload: {
      network: {
        type: u[n]
      },
      message: t,
      recipients: [
        {
          address: o,
          amountSats: BigInt(i)
        }
      ],
      senderAddress: a
    },
    getProvider: d,
    onFinish: s,
    onCancel: c
  };
  return await v(r), { txid: e };
}
export {
  R as a,
  H as b,
  q as c,
  M as s
};
