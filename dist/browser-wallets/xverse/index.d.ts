import { Psbt } from "bitcoinjs-lib";
import { BrowserWalletNetwork } from "../../config/types";
import type { SatsConnectSignPSBTOptions } from "../internal/sats-connect/types";
import { BrowserWalletSendBtcResponse, BrowserWalletSignResponse, WalletAddress } from "../types";
/**
 * Checks if the Xverse extension is installed.
 *
 * @returns `true` if installed, `false` otherwise.
 * @throws {OrditSDKError} Function is called outside a browser without `window` object
 */
declare function isInstalled(): boolean;
declare function getAddresses(network?: BrowserWalletNetwork): Promise<WalletAddress[]>;
declare function signPsbt(psbt: Psbt, { finalize, extractTx, network, inputsToSign, }?: SatsConnectSignPSBTOptions): Promise<BrowserWalletSignResponse>;
declare function signMessage(message: string, address: string, network?: BrowserWalletNetwork): Promise<BrowserWalletSignResponse>;
declare function sendBtc(message: string, address: string, senderAddress: string, satoshis: number, network?: BrowserWalletNetwork): Promise<BrowserWalletSendBtcResponse>;
export { getAddresses, isInstalled, sendBtc, signMessage, signPsbt };
