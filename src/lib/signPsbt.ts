import { Psbt } from "bitcoinjs-lib";

import { signPsbt as signLeatherPsbt } from "../browser-wallets/leather";
import { signPsbt as signMagicEdenPsbt } from "../browser-wallets/magiceden";
import { signPsbt as signOKXPsbt } from "../browser-wallets/okx";
import { signPsbt as signUnisatPsbt } from "../browser-wallets/unisat";
import { signPsbt as signXversePsbt } from "../browser-wallets/xverse";
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
export default async function signPsbt({
  address,
  wallet,
  network,
  psbt,
  options,
}: SignPsbtParams): Promise<SerializedPsbt> {
  if (options?.signingIndexes?.length && options?.inputsToSign?.length) {
    throw new Error("Cannot have both indexes and inputs to sign together");
  }

  const finalize = options?.finalize ?? true;
  const extractTx = options?.extractTx ?? true;
  const getAllInputIndices = () =>
    psbt.data.inputs.map((value, index) => index);

  if (wallet === Wallet.MAGICEDEN) {
    const signedMagicEdenPsbt = await signMagicEdenPsbt(psbt, {
      network,
      inputsToSign: options?.inputsToSign ?? [
        {
          address,
          signingIndexes: options?.signingIndexes ?? getAllInputIndices(),
          sigHash: options?.sigHash,
        },
      ],
      finalize,
      extractTx,
    });
    return signedMagicEdenPsbt;
  }

  if (wallet === Wallet.UNISAT) {
    const signedUnisatPsbt = await signUnisatPsbt(psbt, {
      finalize,
      extractTx,
    });
    return signedUnisatPsbt;
  }

  if (wallet === Wallet.XVERSE) {
    const signedXversePsbt = await signXversePsbt(psbt, {
      network,
      inputsToSign: options?.inputsToSign ?? [
        {
          address,
          signingIndexes: options?.signingIndexes ?? getAllInputIndices(), // If signingIndexes is not provided, just sign everything
          sigHash: options?.sigHash,
        },
      ],
      finalize,
      extractTx,
    });
    return signedXversePsbt;
  }

  if (wallet === Wallet.LEATHER) {
    const signedLeatherPsbt = await signLeatherPsbt(psbt, {
      network,
      finalize,
      extractTx,
      allowedSighash: options?.sigHash ? [options?.sigHash] : [],
      signAtIndexes: options?.signingIndexes ?? getAllInputIndices(), // If signingIndexes is not provided, just sign everything
    });
    return signedLeatherPsbt;
  }

  if (wallet === Wallet.OKX) {
    const signedOKXPsbt = await signOKXPsbt(psbt, {
      finalize,
      extractTx,
      network,
      inputsToSign: options?.inputsToSign ?? [
        {
          address,
          signingIndexes: options?.signingIndexes ?? getAllInputIndices(), // If signingIndexes is not provided, just sign everything
          sigHash: options?.sigHash,
        },
      ],
    });
    return signedOKXPsbt;
  }

  // else throw error
  throw new Error("Invalid wallet selected");
}
