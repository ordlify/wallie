import { BIP32Interface } from "bip32";
import { Network as BitcoinNetwork, Payment, Psbt, Signer, Transaction } from "bitcoinjs-lib";
import { ECPairInterface } from "ecpair";
import type { AddressFormat, AddressType } from "../addresses/types";
import type { Network } from "../config/types";
import type { UTXO } from "../transactions/types";
import type { BufferOrHex, GetScriptTypeResponse, IsBitcoinPaymentResponse, NestedObject, OneOfAllDataFormats } from "./types";
export declare function getNetwork(value: Network): BitcoinNetwork;
export declare function createPayment(key: Buffer, type: AddressType, network: Network | BitcoinNetwork, paymentOptions?: Payment): Payment;
export declare function getDerivationPath(formatType: AddressFormat, account?: number, addressIndex?: number): string;
export declare function hdNodeToChild(node: BIP32Interface, formatType?: AddressFormat, addressIndex?: number, account?: number): BIP32Interface;
/**
 * This function was copied from bitcoinjs-lib as it is not exported.
 *
 * Reference: [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/ts_src/payments/bip341.ts)
 *
 * @param pubkey Public Key
 * @returns x-coordinate of public key
 */
export declare function toXOnly(pubkey: Buffer): Buffer;
/**
 * This function was copied from bitcoinjs-lib as it is not exported.
 *
 * Reference: [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/ts_src/payments/bip341.ts)
 *
 * @param pubKey Public Key
 * @param h Hash
 * @returns Concatenated TapTweak Hash
 */
export declare function tapTweakHash(pubKey: Buffer, h: Buffer | undefined): Buffer;
export declare function tweakSigner(signer: BIP32Interface | ECPairInterface, opts?: {
    tweakHash?: Buffer;
    network?: BitcoinNetwork;
}): Signer;
export declare const isObject: (o: unknown) => boolean;
export declare const isString: (s: unknown) => s is string | String;
/**
 * Encodes an object into [valid URI components](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent),
 * modifying the object in the process.
 *
 * @param obj Object
 * @returns The object is mutated.
 * @deprecated
 */
export declare function UNSTABLE_encodeObject(obj: NestedObject): NestedObject;
/**
 * Decodes an object into [valid URI components](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent),
 * modifying the object in the process.
 *
 * @param obj Object
 * @returns The object is mutated.
 * @deprecated
 */
export declare function UNSTABLE_decodeObject(obj: NestedObject): NestedObject;
export declare function convertSatoshisToBTC(satoshis: number): number;
export declare function convertBTCToSatoshis(btc: number): number;
export declare function generateTxUniqueIdentifier(txId: string, index: number): string;
/**
 * Converts an outpoint to id format.
 *
 * An outpoint refers to a specific output.
 *
 * Reference: https://developer.bitcoin.org/reference/transactions.html#outpoint-the-specific-part-of-a-specific-output
 *
 * @param outpoint Outpoint in string format `{txid}:{vout}`
 * @returns id formatted string, `{txid}i{vout}`
 */
export declare function outpointToIdFormat(outpoint: string): string;
export declare function decodePSBT({ hex, base64, buffer }: OneOfAllDataFormats): Psbt;
export declare function decodeTx({ hex, buffer }: BufferOrHex): Transaction;
export declare const isP2PKH: (script: Buffer, network: Network) => IsBitcoinPaymentResponse;
export declare const isP2WPKH: (script: Buffer, network: Network) => IsBitcoinPaymentResponse;
export declare const isP2SHScript: (script: Buffer, network: Network) => IsBitcoinPaymentResponse;
export declare const isP2TR: (script: Buffer, network: Network) => IsBitcoinPaymentResponse;
export declare function getScriptType(script: Buffer, network: Network): GetScriptTypeResponse;
export declare function getDummyP2TRInput(): UTXO;
