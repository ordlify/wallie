import { Psbt } from 'bitcoinjs-lib';
import { BrowserWalletNetwork } from '../../config/types';
import { SatsConnectSignPSBTOptions } from '../internal/sats-connect/types';
import { BrowserWalletSignResponse, WalletAddress } from '../types';

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
export { getAddresses, isInstalled, signMessage, signPsbt };
