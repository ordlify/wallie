import { Psbt } from "bitcoinjs-lib";
import { BitcoinProvider } from "sats-connect";

import { BrowserWalletNetwork } from "../../config/types";
import { BrowserWalletNotInstalledError, OrditSDKError } from "../../errors";
import {
  satsConnectWalletGetAddresses,
  satsConnectWalletSendBTC,
  satsConnectWalletSignMessage,
  satsConnectWalletSignPsbt,
} from "../internal/sats-connect";
import type { SatsConnectSignPSBTOptions } from "../internal/sats-connect/types";
import {
  BrowserWalletSendBtcResponse,
  BrowserWalletSignResponse,
  WalletAddress,
} from "../types";

/**
 * Checks if the Xverse extension is installed.
 *
 * @returns `true` if installed, `false` otherwise.
 * @throws {OrditSDKError} Function is called outside a browser without `window` object
 */
function isInstalled(): boolean {
  if (typeof window === "undefined") {
    throw new OrditSDKError("Cannot call this function outside a browser");
  }

  return typeof window.XverseProviders?.BitcoinProvider !== "undefined";
}

async function getXverseWalletProvider(): Promise<BitcoinProvider> {
  if (!isInstalled()) {
    throw new BrowserWalletNotInstalledError("Selected wallet not installed");
  }

  return window.XverseProviders!.BitcoinProvider!;
}

async function getAddresses(
  network: BrowserWalletNetwork = "mainnet",
): Promise<WalletAddress[]> {
  if (!isInstalled()) {
    throw new BrowserWalletNotInstalledError("Selected wallet not installed");
  }

  return satsConnectWalletGetAddresses(getXverseWalletProvider, network);
}

async function signPsbt(
  psbt: Psbt,
  {
    finalize = true,
    extractTx = true,
    network,
    inputsToSign,
  }: SatsConnectSignPSBTOptions = { network: "mainnet", inputsToSign: [] },
): Promise<BrowserWalletSignResponse> {
  if (!isInstalled()) {
    throw new BrowserWalletNotInstalledError("Selected wallet not installed");
  }

  return satsConnectWalletSignPsbt(getXverseWalletProvider, psbt, {
    finalize,
    extractTx,
    network,
    inputsToSign,
  });
}

async function signMessage(
  message: string,
  address: string,
  network: BrowserWalletNetwork = "mainnet",
): Promise<BrowserWalletSignResponse> {
  if (!isInstalled()) {
    throw new BrowserWalletNotInstalledError("Selected wallet not installed");
  }

  return satsConnectWalletSignMessage(
    getXverseWalletProvider,
    message,
    address,
    network,
  );
}

async function sendBtc(
  message: string,
  address: string,
  senderAddress: string,
  satoshis: number,
  network: BrowserWalletNetwork = "mainnet",
): Promise<BrowserWalletSendBtcResponse> {
  if (!isInstalled()) {
    throw new BrowserWalletNotInstalledError("Selected wallet not installed");
  }

  return satsConnectWalletSendBTC(
    getXverseWalletProvider,
    message,
    address,
    senderAddress,
    satoshis,
    network,
  );
}

export { getAddresses, isInstalled, sendBtc, signMessage, signPsbt };
