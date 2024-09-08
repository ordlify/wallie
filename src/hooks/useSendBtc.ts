import { useCallback, useState } from "react";
import { BitcoinNetworkType, sendBtcTransaction } from "sats-connect";

import { leatherRequest } from "../browser-wallets/leather/utils";
import { getMagicEdenWalletProvider as getMeProvider } from "../browser-wallets/magiceden";
// import { sendBtc as sendXverseBTC } from "../browser-wallets/xverse";
import { useWallie } from "../providers/WallieProvider";

type SendFunction = (
  address: string,
  satoshis: number,
) => Promise<string | null>;

export function useSendBtc() {
  const { wallet, network, address, publicKey } = useWallie();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const send: SendFunction = useCallback(
    async (toAddress, satoshis) => {
      setLoading(true);
      try {
        setError(null);
        if (
          !address ||
          !address.payments ||
          !publicKey ||
          !publicKey.payments ||
          !wallet
        ) {
          throw new Error("No wallet is connected");
        }

        if (wallet === "magiceden" || wallet === "xverse") {
          const wp = wallet === "magiceden" ? await getMeProvider() : undefined;

          let txid: string | null = null;

          txid = await new Promise<string | null>((resolve, reject) => {
            sendBtcTransaction({
              payload: {
                network: {
                  type:
                    network === "mainnet"
                      ? BitcoinNetworkType.Mainnet
                      : BitcoinNetworkType.Testnet,
                },
                message: "Sign Transaction",
                recipients: [
                  {
                    address: toAddress,
                    amountSats: BigInt(satoshis),
                  },
                ],
                senderAddress: address.payments!,
              },
              getProvider: async () => wp,
              onFinish: (response) => {
                resolve(response);
              },
              onCancel: () => {
                reject(new Error("Transaction canceled"));
              },
            });
          });

          setLoading(false);
          return txid;
        }

        if (wallet === "unisat") {
          let txid: string = "";

          txid = await window.unisat.sendBitcoin(toAddress, satoshis, {});
          setLoading(false);
          return txid;
        }

        if (wallet === "leather") {
          let txid: string = "";

          const request: { txid: string } = await leatherRequest(
            "sendTransfer",
            {
              recipients: [
                {
                  address: toAddress,
                  amount: satoshis,
                },
              ],
              network,
            },
          );
          txid = request.txid;
          setLoading(false);
          return txid;
        }

        if (wallet === "okx") {
          let txid: string = "";
          if (network === "mainnet") {
            txid = await window.okxwallet.bitcoin.sendBitcoin(
              toAddress,
              satoshis,
              {},
            );
            setLoading(false);
            return txid;
          }

          if (network === "testnet") {
            txid = await window.okxwallet.bitcoinTestnet.sendBitcoin(
              toAddress,
              satoshis,
              {},
            );
            setLoading(false);
            return txid;
          }
        }

        setLoading(false);
        return null;
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
        return null;
      }
    },
    [address, network, publicKey, wallet],
  );

  return { send, error, loading };
}
