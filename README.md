# @oviato/wallie (Wallie)

Wallie is a library designed to interact with multiple Bitcoin wallets, providing a seamless experience for sending BTC, signing messages, and more. It supports several popular wallets with a focus on ordinal and inscription safety.

## Supported Wallets

| Wallet     | Ordinal-safety | Inscription-safety |
| ---------- | -------------- | ------------------ |
| OKX        | ✅             | ✅                 |
| Unisat     | ✅             | ✅                 |
| Xverse     | ✅             | ✅                 |
| Magic Eden | ✅             | ✅                 |
| Leather    | ✅             | ✅                 |

## Features

Wallie includes the following features:

- **Wallet connect:** Connect wallet to supported wallets
- **Sign a Message:** Securely sign a message using your connected Bitcoin wallet.
- **Send BTC:** Easily send Bitcoin to any address with safety and network checks.

## Usage Example

Below is an example of how to use Wallie in a React application to check the balance, send BTC, and sign messages:

```typescript
import { useCallback, useState } from "react";

import { useBalance } from "./hooks/useBalance";
import { useSignMessage } from "./hooks/useSignMessage";
import { Network, useWallie, WallieProvider } from "./providers/WallieProvider";
import { OrdConnectKit, useSendBtc, useSign } from "./index";

function TestControls() {
  const { send, error: sendError, loading: isSending } = useSendBtc();
  const {
    getBalance,
    error: balanceError,
    loading: isLoadingBalance,
  } = useBalance();
  const { sign, error: signPsbtError } = useSign();
  const { signMsg, error: signMessageError } = useSignMessage();
  const [result, setResult] = useState("");
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const { address, wallet } = useWallie();

  const handleCheckBalance = useCallback(async () => {
    try {
      const walletBalance = await getBalance();
      setBalance(walletBalance);
    } catch (err) {
      console.log("Failed to fetch balance", err);
      setBalance(undefined);
    }
  }, [getBalance]);

  const handleSend = useCallback(async () => {
    const txId = await send("3E8G3V48L4xCaoEExMRjeP7E3Q1km2sHd6", 2000);
    if (txId) {
      setResult(txId);
    }
  }, [send]);

  const handleSignPsbt = useCallback(async () => {
    if (!address.payments) {
      throw new Error("No payment address");
    }

    const signed = await sign(
      address.payments,
      "cHNidP8BAFICAAAAARXJoLPdXB0nA98DsK0PaC5ABbmJbxKPAZ+WUvKJYgieAAAAAAD/////AaRCDwAAAAAAFgAUQQLeNoYbzPdxCaEZpQnxIuzjchIAAAAAAAEBH2QAAAAAAAAAFgAUQQLeNoYbzPdxCaEZpQnxIuzjchIBAwSDAAAAAAA=",
      { extractTx: false }
    );
    console.log(signed);
  }, [address.payments, sign]);

  const handleSignMessage = useCallback(async () => {
    if (!address.ordinals) {
      throw new Error("No payment address");
    }

    const signed = await signMsg(
      address.ordinals,
      "This is a test message which will not be used anywhere."
    );
    console.log(signed);
  }, [address.ordinals, signMsg]);

  return (
    <div className="wallie-flex flex-col">
      <div className="flex flex-col space-y-4 pt-4">
        <button
          type="button"
          className="bg-ord-light-blue-400 rounded-lg"
          onClick={handleCheckBalance}
        >
          Check balance
        </button>
        <button
          type="button"
          className="bg-ord-light-blue-400 rounded-lg"
          onClick={handleSend}
        >
          Send Btc
        </button>
        <button
          type="button"
          className="bg-ord-light-blue-400 rounded-lg"
          onClick={handleSignPsbt}
        >
          Sign PSBT
        </button>
        <button
          type="button"
          className="bg-ord-light-blue-400 rounded-lg"
          onClick={handleSignMessage}
        >
          Sign message
        </button>
      </div>
      <div className="break-all">
        {wallet ? <p>Wallet: {wallet}</p> : null}
        {address?.ordinals ? (
          <p>Connected Address: {address.ordinals ?? ""}</p>
        ) : null}
        {typeof balance === "number" || isLoadingBalance ? (
          <p>
            Wallet Balance: {isLoadingBalance ? "Loading" : `${balance} sats`}
          </p>
        ) : null}
        {balanceError ? <p>Wallet Balance Error: {balanceError}</p> : null}
        {result ? <p>Transaction ID: {result}</p> : null}
        {signPsbtError ? <p>Sign Psbt Error: {signPsbtError}</p> : null}
        {signMessageError ? (
          <p>Sign Message Error: {signMessageError}</p>
        ) : null}
        {sendError ? <p>Send Error: {sendError}</p> : null}
        {isSending ? <p>Sending</p> : null}
      </div>
    </div>
  );
}

export function SampleApp() {
  return (
    <div className="app h-screen flex justify-center items-center">
      <WallieProvider initialNetwork={Network.MAINNET}>
        <div className="flex flex-col">
          <OrdConnectKit
            onViewProfile={() => console.log("View profile clicked")}
          />
          <TestControls />
        </div>
      </WallieProvider>
    </div>
  );
}
```

## Acknowledgements

This project is forked from ordzaar/ord-connect. We acknowledge their work as the foundation for Wallie.

## License

MIT License
