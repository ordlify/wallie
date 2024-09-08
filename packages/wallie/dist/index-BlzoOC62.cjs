"use strict";const e=require("./index-C0i2q9jJ.cjs"),B=require("bitcoinjs-lib"),w=require("sats-connect"),b=require("@bitcoinerlab/secp256k1"),f=require("./BrowserWalletSigningError-pfMHrxFL.cjs"),C=require("./utils-BHteXc3c.cjs");function m(s){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(s){for(const n in s)if(n!=="default"){const o=Object.getOwnPropertyDescriptor(s,n);Object.defineProperty(t,n,o.get?o:{enumerable:!0,get:()=>s[n]})}}return t.default=s,Object.freeze(t)}const W=m(b),p={mainnet:w.BitcoinNetworkType.Mainnet,testnet:w.BitcoinNetworkType.Testnet};B.initEccLib(W);async function F(s,t="mainnet"){if(t==="signet")throw new e.OrditSDKError("signet network is not supported");const n=[],o=r=>{if(!r||!r.addresses||r.addresses.length!==2)throw new f.BrowserWalletSigningError("Failed to retrieve addresses using selected wallet");r.addresses.forEach(a=>{const d=e.getAddressFormat(a.address,t);let c=a.publicKey;d==="taproot"&&(c=C.fromXOnlyToFullPubkey(a.publicKey)),n.push({publicKey:c,address:a.address,format:d})})},l=()=>{throw new e.BrowserWalletRequestCancelledByUserError},i={payload:{purposes:["ordinals","payment"],message:"Provide access to Payment address and Ordinals address",network:{type:p[t]}},getProvider:s,onFinish:r=>o(r),onCancel:l};return await w.getAddress(i),n}async function T(s,t,{finalize:n=!0,extractTx:o=!0,network:l,inputsToSign:i}={network:"mainnet",inputsToSign:[]}){if(l==="signet")throw new e.OrditSDKError("signet network is not supported");if(!n&&o)throw new e.BrowserWalletExtractTxFromNonFinalizedPsbtError;if(!t||!l||!i.length)throw new e.OrditSDKError("Invalid options provided");let r,a=null;const d=E=>{const{psbtBase64:y}=E;if(!y)throw new f.BrowserWalletSigningError("Failed to sign psbt using selected wallet");const g=B.Psbt.fromBase64(y);if(n&&i.forEach(h=>{h.signingIndexes.forEach(S=>{try{g.finalizeInput(S)}catch(O){throw console.error("Sign psbt error",O),new e.OrditSDKError("Failed to finalize input")}})}),o){try{r=g.extractTransaction().toHex()}catch(h){throw h instanceof Error&&h.message==="Not finalized"?new e.BrowserWalletExtractTxFromNonFinalizedPsbtError:new e.OrditSDKError("Failed to extract transaction from PSBT")}a=null}else r=g.toHex(),a=g.toBase64()},c=()=>{throw new e.BrowserWalletRequestCancelledByUserError},u={payload:{network:{type:p[l]},message:"Sign PSBT",psbtBase64:t.toBase64(),broadcast:!1,inputsToSign:i},onFinish:d,onCancel:c,getProvider:s};return await w.signTransaction(u),{hex:r,base64:a}}async function K(s,t,n,o="mainnet"){if(o==="signet")throw new e.OrditSDKError("signet network is not supported");if(!t||!o||!n)throw new e.OrditSDKError("Invalid options provided");let l,i=null;const r=c=>{if(!c)throw new f.BrowserWalletSigningError("Failed to sign message using selected wallet");l=e.Buffer.from(c,"base64").toString("hex"),i=c},a=()=>{throw new e.BrowserWalletRequestCancelledByUserError},d={payload:{network:{type:p[o]},message:t,address:n},getProvider:s,onFinish:r,onCancel:a};return await w.signMessage(d),{hex:l,base64:i}}async function P(s,t,n,o,l,i="mainnet"){if(i==="signet")throw new e.OrditSDKError("signet network is not supported");if(!t||!i||!n)throw new e.OrditSDKError("Invalid options provided");let r;const a=u=>{if(!u)throw new f.BrowserWalletSigningError("Failed to sign message using selected wallet");r=u},d=()=>{throw new e.BrowserWalletRequestCancelledByUserError},c={payload:{network:{type:p[i]},message:t,recipients:[{address:n,amountSats:BigInt(l)}],senderAddress:o},getProvider:s,onFinish:a,onCancel:d};return await w.sendBtcTransaction(c),{txid:r}}exports.satsConnectWalletGetAddresses=F;exports.satsConnectWalletSendBTC=P;exports.satsConnectWalletSignMessage=K;exports.satsConnectWalletSignPsbt=T;
