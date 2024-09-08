import { Psbt } from "bitcoinjs-lib";
import { BitcoinProvider } from "sats-connect";
import { Wallet } from "@wallet-standard/core";
import { BrowserWalletNetwork } from "../../config/types";
import type { SatsConnectSignPSBTOptions } from "../internal/sats-connect/types";
import { BrowserWalletSignResponse, WalletAddress } from "../types";
export interface MagicEdenBitcoinProvider extends BitcoinProvider {
    isMagicEden: boolean | undefined;
}
export interface MagicEdenWallet extends Wallet {
    name: "Magic Eden";
    features: {
        "sats-connect:": {
            provider: MagicEdenBitcoinProvider;
        };
    };
}
declare function getMagicEdenWalletProvider(): Promise<MagicEdenBitcoinProvider>;
/**
 * Checks if the MagicEden Wallet extension is installed.
 *
 * @returns `true` if installed, `false` otherwise.
 * @throws {OrditSDKError} Function is called outside a browser without `window` object
 */
declare function isInstalled(): Promise<boolean>;
declare function getAddresses(network?: BrowserWalletNetwork): Promise<WalletAddress[]>;
declare function signPsbt(psbt: Psbt, { finalize, extractTx, network, inputsToSign, }?: SatsConnectSignPSBTOptions): Promise<BrowserWalletSignResponse>;
declare function signMessage(message: string, address: string, network?: BrowserWalletNetwork): Promise<BrowserWalletSignResponse>;
export { getAddresses, getMagicEdenWalletProvider, isInstalled, signMessage, signPsbt, };
