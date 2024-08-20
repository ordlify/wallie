import { BitcoinProvider } from "sats-connect";
import { getWallets, Wallet } from "@wallet-standard/core";

interface MagicEdenBitcoinProvider extends BitcoinProvider {
  isMagicEden: boolean | undefined;
}

interface MagicEdenWallet extends Wallet {
  name: "Magic Eden";
  features: {
    "sats-connect:": {
      provider: MagicEdenBitcoinProvider;
    };
  };
}

export default async function walletProvider(): Promise<MagicEdenBitcoinProvider> {
  const { get } = getWallets();

  const wallets = get();

  const meWallet = wallets.find(
    (wallet) =>
      wallet.name === "Magic Eden" &&
      (wallet as MagicEdenWallet).features["sats-connect:"]?.provider
        ?.isMagicEden === true
  ) as MagicEdenWallet | undefined;

  if (!meWallet) {
    throw new Error("Magic Eden wallet not found");
  }

  return meWallet.features["sats-connect:"].provider;
}
