import { useCallback, useState } from "react";
import {
  BitcoinNetworkType,
  request as STReques,
  RpcErrorCode,
  sendBtcTransaction,
} from "sats-connect";

import { leatherRequest } from "../browser-wallets/leather/utils";
import { getMagicEdenWalletProvider as getMeProvider } from "../browser-wallets/magiceden";
// import { sendBtc as sendXverseBTC } from "../browser-wallets/xverse";
import { useWallie } from "../providers/WallieProvider";

// Change to accept multiple recipients
type SendFunction = (
  recipients: { address: string; satoshis: number }[]
) => Promise<string | null>;

export function useSendBtc() {
  const { wallet, network, address, publicKey } = useWallie();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const send: SendFunction = useCallback(
    async (recipients) => {
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

        if (wallet === "magiceden") {
          const wp = await getMeProvider();

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
                recipients: recipients.map((recipient) => ({
                  address: recipient.address,
                  amountSats: BigInt(recipient.satoshis),
                })),
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

        if (wallet === "xverse") {
          let txid: string = "";
          try {
            const response = await STReques("sendTransfer", {
              recipients: recipients.map((recipient) => ({
                address: recipient.address,
                amount: recipient.satoshis,
              })),
            });
            if (response.status === "success") {
              // handle success
              txid = response.result.txid;
            } else if (response.error.code === RpcErrorCode.USER_REJECTION) {
              throw new Error("Transaction canceled");
            } else {
              throw new Error("Transaction canceled");
            }
          } catch (err) {
            throw new Error("Transaction canceled");
          }

          setLoading(false);
          return txid;
        }

        if (wallet === "unisat") {
          let txid: string = "";

          txid = await window.unisat.sendBitcoin(
            recipients[0].address,
            recipients[0].satoshis,
            {}
          );

          setLoading(false);
          return txid;
        }

        if (wallet === "leather") {
          let txid: string = "";

          const request: { txid: string } = await leatherRequest(
            "sendTransfer",
            {
              recipients: recipients.map((recipient) => ({
                address: recipient.address,
                amount: recipient.satoshis,
              })),
              network,
            }
          );
          txid = request.txid;
          setLoading(false);
          return txid;
        }

        if (wallet === "okx") {
          let txid: string = "";

          if (network === "mainnet") {
            txid = await window.okxwallet.bitcoin.sendBitcoin(
              recipients[0].address,
              recipients[0].satoshis,
              {}
            );
          } else if (network === "testnet") {
            txid = await window.okxwallet.bitcoinTestnet.sendBitcoin(
              recipients[0].address,
              recipients[0].satoshis,
              {}
            );
          }

          setLoading(false);
          return txid;
        }

        setLoading(false);
        return null;
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
        return null;
      }
    },
    [address, network, publicKey, wallet]
  );

  return { send, error, loading };
}
