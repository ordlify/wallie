import { AddressFormat } from "../addresses";
import {
  LeatherAddressType,
  signMessage as signLeatherMessage,
} from "../browser-wallets/leather";
import { signMessage as signMagicEdenMessage } from "../browser-wallets/magiceden";
import { signMessage as signOKXMessage } from "../browser-wallets/okx";
import { signMessage as signUnisatMessage } from "../browser-wallets/unisat";
import { signMessage as signXverseMessage } from "../browser-wallets/xverse";
import { Network, Wallet } from "../providers/WallieProvider";

interface SignMessageParams {
  message: string;
  wallet: Wallet;
  address: string;
  network: Network;
  format: AddressFormat;
}

function leatherPaymentTypeFromFormat(
  format: AddressFormat,
): LeatherAddressType {
  if (format === "segwit") {
    return LeatherAddressType.P2WPKH;
  }
  if (format === "taproot") {
    return LeatherAddressType.P2TR;
  }
  throw new Error("Leather payment address format is not supported");
}

/**
 * Sign message
 *
 * @param options Options
 * @returns base64 signature
 */
export default async function signMessage({
  message,
  wallet,
  address,
  network,
  format,
}: SignMessageParams): Promise<string | null> {
  if (wallet === Wallet.MAGICEDEN) {
    const { base64 } = await signMagicEdenMessage(message, address, network);
    return base64;
  }

  if (wallet === Wallet.UNISAT) {
    const { base64 } = await signUnisatMessage(message, "bip322-simple");
    return base64;
  }

  if (wallet === Wallet.XVERSE) {
    const { base64 } = await signXverseMessage(message, address, network);
    return base64;
  }

  if (wallet === Wallet.LEATHER) {
    const paymentType = leatherPaymentTypeFromFormat(format);
    const { base64 } = await signLeatherMessage(message, {
      paymentType,
      network,
    });
    return base64;
  }

  if (wallet === Wallet.OKX) {
    const { base64 } = await signOKXMessage(message, "bip322-simple", network);
    return base64;
  }

  throw new Error("Invalid wallet selected");
}
