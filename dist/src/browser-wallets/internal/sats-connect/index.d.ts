import { Psbt } from "bitcoinjs-lib";
import { BitcoinProvider } from "sats-connect";
import type { BrowserWalletNetwork } from "../../../config/types";
import type { BrowserWalletSendBtcResponse, BrowserWalletSignResponse, WalletAddress } from "../../types";
import type { SatsConnectSignPSBTOptions } from "./types";
/**
 * Gets addresses from the browser wallet.
 *
 * @param network Network
 * @returns An array of WalletAddress objects.
 * @throws {BrowserWalletNotInstalledError} Wallet is not installed
 * @throws {BrowserWalletSigningError} Failed to sign with Selected Wallet
 * @throws {BrowserWalletRequestCancelledByUserError} Request was cancelled by user
 */
declare function satsConnectWalletGetAddresses(getProvider: () => Promise<BitcoinProvider>, network?: BrowserWalletNetwork): Promise<WalletAddress[]>;
/**
 * Signs a Partially Signed Bitcoin Transaction (PSBT).
 * To learn more, visit https://github.com/bitcoin/bitcoin/blob/master/doc/psbt.md
 *
 * @param psbt Partially Signed Bitcoin Transaction
 * @param options Options for signing
 * @returns An object containing `base64` and `hex` if the transaction is not extracted, or `hex` if the transaction is extracted.
 * @throws {BrowserWalletNotInstalledError} Wallet is not installed
 * @throws {BrowserWalletExtractTxFromNonFinalizedPsbtError} Failed to extract transaction as not all inputs are finalized
 * @throws {BrowserWalletSigningError} Failed to sign with sellected wallet
 * @throws {OrditSDKError} Invalid options provided
 * @throws {BrowserWalletRequestCancelledByUserError} Request was cancelled by user
 */
declare function satsConnectWalletSignPsbt(getProvider: () => Promise<BitcoinProvider>, psbt: Psbt, { finalize, extractTx, network, inputsToSign, }?: SatsConnectSignPSBTOptions): Promise<BrowserWalletSignResponse>;
/**
 * Send a Bitcoin transaction.
 *
 * @param message Message to be signed
 * @param address Address to sign with
 * @param network Network (mainnet or testnet)
 * @returns An object containing `base64` and `hex`.
 * @throws {BrowserWalletNotInstalledError} Wallet is not installed
 * @throws {BrowserWalletSigningError} Failed to sign with selected wallet
 * @throws {OrditSDKError} Invalid options provided
 * @throws {BrowserWalletRequestCancelledByUserError} Request was cancelled by user
 */
declare function satsConnectWalletSignMessage(getProvider: () => Promise<BitcoinProvider>, message: string, address: string, network?: BrowserWalletNetwork): Promise<BrowserWalletSignResponse>;
/**
 * Send a Bitcoin transaction.
 *
 * @param message Message to be signed
 * @param address Address to sign with
 * @param network Network (mainnet or testnet)
 * @returns An object containing `base64` and `hex`.
 * @throws {BrowserWalletNotInstalledError} Wallet is not installed
 * @throws {BrowserWalletSigningError} Failed to sign with selected wallet
 * @throws {OrditSDKError} Invalid options provided
 * @throws {BrowserWalletRequestCancelledByUserError} Request was cancelled by user
 */
declare function satsConnectWalletSendBTC(getProvider: () => Promise<BitcoinProvider>, message: string, address: string, senderAddress: string, satoshis: number, network?: BrowserWalletNetwork): Promise<BrowserWalletSendBtcResponse>;
export { satsConnectWalletGetAddresses, satsConnectWalletSendBTC, satsConnectWalletSignMessage, satsConnectWalletSignPsbt, };
export * from "../../types";
export * from "./types";
//# sourceMappingURL=index.d.ts.map