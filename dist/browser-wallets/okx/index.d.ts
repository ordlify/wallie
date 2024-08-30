import { Psbt } from 'bitcoinjs-lib';
import { BrowserWalletNetwork } from '../../config/types';
import { BrowserWalletSignResponse, WalletAddress } from '../types';
import { OKXSignPSBTOptions } from './types';

declare function isInstalled(): boolean;
declare function getAddresses(network?: BrowserWalletNetwork): Promise<WalletAddress[]>;
declare function signPsbt(psbt: Psbt, { finalize, extractTx, network, inputsToSign, }?: OKXSignPSBTOptions): Promise<BrowserWalletSignResponse>;
declare function signMessage(message: string, type?: MessageSignatureTypes, network?: BrowserWalletNetwork): Promise<BrowserWalletSignResponse>;
export { getAddresses, isInstalled, signMessage, signPsbt };
export * from '../types';
export * from './types';
