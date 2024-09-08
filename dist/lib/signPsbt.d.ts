import { Psbt } from "bitcoinjs-lib";
import { Network, Wallet } from "../providers/WallieProvider";
interface InputsToSign {
    address: string;
    signingIndexes: number[];
    sigHash?: number;
}
export interface SignPsbtOptionsParams {
    finalize?: boolean;
    extractTx?: boolean;
    signingIndexes?: number[];
    inputsToSign?: InputsToSign[];
    sigHash?: number;
}
interface SignPsbtParams {
    address: string;
    wallet: Wallet;
    network: Network;
    psbt: Psbt;
    options?: SignPsbtOptionsParams;
}
export interface SerializedPsbt {
    hex: string;
    base64: string | null;
}
/**
 * @description accept wallet type and calls the right ordit function to sign the psbt.
 * @param wallet
 * @param network
 * @param psbt
 * @param options
 */
export default function signPsbt({ address, wallet, network, psbt, options, }: SignPsbtParams): Promise<SerializedPsbt>;
export {};
