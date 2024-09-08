/* eslint-disable no-console */
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
    const txId = await send("2NF2Uwm15ovqBFcKs6RHiNgzuAwCt7e2wCq", 5000);
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
      { extractTx: false },
    );
    console.log(signed);
  }, [address.payments, sign]);

  const handleSignMessage = useCallback(async () => {
    if (!address.ordinals) {
      throw new Error("No payment address");
    }

    const signed = await signMsg(
      address.ordinals,
      "This is a test message which will not be used anywhere.",
    );
    console.log(signed);
  }, [address.ordinals, signMsg]);

  return (
    <div className="wallie-flex wallie-flex-col">
      <div className="wallie-flex wallie-flex-col wallie-space-y-4 wallie-pt-4">
        <button
          type="button"
          className="wallie-bg-ord-light-blue-400 wallie-rounded-lg"
          onClick={handleCheckBalance}
        >
          Check balance
        </button>
        <button
          type="button"
          className="wallie-bg-ord-light-blue-400 wallie-rounded-lg"
          onClick={handleSend}
        >
          Send Btc
        </button>
        <button
          type="button"
          className="wallie-bg-ord-light-blue-400 wallie-rounded-lg"
          onClick={handleSignPsbt}
        >
          Sign PSBT
        </button>
        <button
          type="button"
          className="wallie-bg-ord-light-blue-400 wallie-rounded-lg"
          onClick={handleSignMessage}
        >
          Sign message
        </button>
      </div>
      <div className="wallie-break-all">
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
    <div className="wallie-app wallie-h-screen wallie-flex wallie-justify-center wallie-items-center">
      <WallieProvider initialNetwork={Network.TESTNET}>
        <div className="wallie-flex wallie-flex-col">
          <OrdConnectKit
            onViewProfile={() => console.log("View profile clicked")}
          />
          <TestControls />
        </div>
      </WallieProvider>
    </div>
  );
}
