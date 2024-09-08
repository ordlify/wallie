import { Psbt } from "bitcoinjs-lib";
import type { BrowserWalletNetwork } from "../../config/types";
import type { BrowserWalletSignResponse, WalletAddress } from "../types";
import type { UnisatSignPSBTOptions } from "./types";
type MessageSignatureTypes = "bip322-simple" | "ecdsa";
/**
 * Checks if the browser wallet extension is installed.
 *
 * @returns `true` if installed, `false` otherwise.
 * @throws {OrditSDKError} Function is called outside a browser without `window` object
 */
declare function isInstalled(): boolean;
/**
 * Gets addresses from the browser wallet.
 *
 * @param network Network
 * @param readOnly Read only (when set to true, the wallet modal appears)
 * @returns An array of WalletAddress objects.
 * @throws {BrowserWalletNotInstalledError} Wallet is not installed
 * @throws {BrowserWalletRequestCancelledByUserError} Request was cancelled by user
 * @throws {OrditSDKError} Internal error
 */
declare function getAddresses(network?: BrowserWalletNetwork, readOnly?: boolean): Promise<WalletAddress[]>;
/**
 * Signs a Partially Signed Bitcoin Transaction (PSBT).
 * To learn more, visit https://github.com/bitcoin/bitcoin/blob/master/doc/psbt.md
 *
 * @param psbt Partially Signed Bitcoin Transaction
 * @param options Options for signing
 * @returns An object containing `base64` and `hex` if the transaction is not extracted, or `hex` if the transaction is extracted.
 * @throws {BrowserWalletNotInstalledError} Wallet is not installed
 * @throws {BrowserWalletSigningError} Signing failed
 */
declare function signPsbt(psbt: Psbt, { finalize, extractTx }?: UnisatSignPSBTOptions): Promise<BrowserWalletSignResponse>;
/**
 * Signs a message.
 *
 * @param message Message to be signed
 * @param type Signature type
 * @returns An object containing `base64` and `hex`.
 * @throws {BrowserWalletNotInstalledError} Wallet is not installed
 * @throws {BrowserWalletSigningError} Signing failed
 */
declare function signMessage(message: string, type?: MessageSignatureTypes): Promise<BrowserWalletSignResponse>;
export { getAddresses, isInstalled, signMessage, signPsbt };
export * from "../types";
export * from "./types";
//# sourceMappingURL=index.d.ts.map