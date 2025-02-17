import { useCallback, useState } from "react";

import signMessage from "../lib/signMessage.ts";
import { useWallie } from "../providers/WallieProvider";

export function useSignMessage(): {
  isLoading: boolean;
  signMsg: (address: string, message: string) => Promise<string | null>;
  error: string | null;
} {
  const {
    network,
    wallet,
    publicKey,
    format,
    address: walletAddresses,
  } = useWallie();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signMsg = useCallback(
    async (address: string, message: string) => {
      setIsLoading(true);

      try {
        setError(null);
        if (!format || !publicKey || !wallet) {
          throw new Error("No wallet is connected");
        }

        if (
          walletAddresses.ordinals !== address &&
          walletAddresses.payments !== address
        ) {
          throw new Error("Address supplied is not connected address");
        }

        const signedMessage = await signMessage({
          address,
          wallet,
          message,
          network,
          format:
            walletAddresses.ordinals === address
              ? format.ordinals!
              : format.payments!,
        });

        setIsLoading(false);
        return signedMessage;
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
        throw err;
      }
    },
    [format, network, publicKey, wallet, walletAddresses],
  );

  return { signMsg, error, isLoading };
}
