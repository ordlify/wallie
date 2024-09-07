import { BitcoinNetworkType } from 'sats-connect';
import { BrowserWalletNetwork } from '../../../config/types';

export declare const NETWORK_TO_BITCOIN_NETWORK_TYPE: Record<Extract<BrowserWalletNetwork, "mainnet" | "testnet">, BitcoinNetworkType>;
