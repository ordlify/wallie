/* eslint-disable no-console */
import { useCallback, useState } from "react";

import OviatoIcon from "./assets/oviato.svg";
import WalletIcon from "./assets/wallet.svg";
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
  const [signedPSBT, setSignedPSBT] = useState("");
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const { address, wallet, publicKey } = useWallie();

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
    const txId = await send([
      {
        address: "2NF2Uwm15ovqBFcKs6RHiNgzuAwCt7e2wCq",
        satoshis: 5000,
      },
    ]);
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
      "cHNidP8BAHICAAAAAWI8EbPFFZWhp7gXnLngmM3bdqKc0QDEOha93typ7S8rAQAAAAD/////AqCGAQAAAAAAF6kU7unYQzr9tuR+JJ7ADIKpX3L0dnmHvqNcOwAAAAAWABRkFFfHApMmD/BIwUKcg7P+2hJ0jQAAAAAAAQEfEjBeOwAAAAAWABRkFFfHApMmD/BIwUKcg7P+2hJ0jQAAAA==",
      { extractTx: false }
    );
    console.log(signed);

    setSignedPSBT(`${signed.base64}`);
  }, [address.payments, sign]);

  const handleSignPsbtOrdinal = useCallback(async () => {
    if (!address.ordinals) {
      throw new Error("No ordinal address");
    }

    const signed = await sign(
      address.ordinals,
      "cHNidP8BAF4CAAAAAQAETtAe71WiHgO1YGpOgZbBsatebr/G1C1CR01e3+VuAAAAAAD/////AeQEAAAAAAAAIlEgdwTJ4gYd2kPxcH02uu2T5dU/K2F5kxwhofJYzXX+mFgAAAAAAAEBK+QEAAAAAAAAIlEgZJHk50klgryDZQUcXCAe6WIxIATDDLQKwBfadvhqN1oBFyDqNzBAobAmhJAFf56kJTj7TX9TDleCEOkm+9wTmJ8kBQAA",
      { extractTx: false }
    );
    console.log(signed);

    setSignedPSBT(`${signed.base64}`);
  }, [address.ordinals, sign]);

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
    <div className="wallie-flex wallie-flex-col wallie-text-white">
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
          onClick={handleSignPsbtOrdinal}
        >
          Sign Ordinals PSBT
        </button>
        <button
          type="button"
          className="wallie-bg-ord-light-blue-400 wallie-rounded-lg"
          onClick={handleSignMessage}
        >
          Sign message
        </button>
      </div>
      <div className="wallie-break-all wallie-space-y-4">
        {wallet ? <p>Wallet: {wallet}</p> : null}
        {publicKey ? <p>Hex Payments: {publicKey.payments}</p> : null}
        {address?.payments ? <p>Payments: {address.payments ?? ""}</p> : null}
        {publicKey ? <p>Hex Ordinals: {publicKey.ordinals}</p> : null}
        {address?.ordinals ? <p>Ordinals: {address.ordinals ?? ""}</p> : null}
        {typeof balance === "number" || isLoadingBalance ? (
          <p>
            Wallet Balance: {isLoadingBalance ? "Loading" : `${balance} sats`}
          </p>
        ) : null}
        {balanceError ? <p>Wallet Balance Error: {balanceError}</p> : null}
        {result ? <p>Transaction ID: {result}</p> : null}
        {signedPSBT ? (
          <p className="wallie-text-orange-600">SIGNED PSBT: {signedPSBT}</p>
        ) : null}
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
    <div className="wallie-app wallie-h-screen wallie-flex wallie-flex-col wallie-justify-center wallie-items-center wallie-text-white wallie-max-w-4xl wallie-mx-auto">
      <div className="wallie-flex wallie-flex-row wallie-space-x-4 wallie-justify-items-center wallie-items-center">
        <img src={OviatoIcon} alt="" />
        <span>|</span>
        <h2 className="wallie-text-2xl">Wallie Play Ground</h2>
      </div>
      <WallieProvider initialNetwork={Network.TESTNET}>
        <div className="wallie-flex wallie-flex-col">
          <OrdConnectKit
            onViewProfile={() => console.log("View profile clicked")}
            connectButtonComponent={
              <div className="wallie-bg-ord-orange wallie-rounded-full wallie-flex wallie-flex-row md:wallie-space-x-2 wallie-items-center wallie-justify-center wallie-p-2 wallie-space-x-2">
                <img
                  src={WalletIcon}
                  alt=""
                  className="wallie-w-6 md:wallie-w-7"
                />
                <span className="wallie-text-ord-blue wallie-mb-0.5">
                  Wallet Connect
                </span>
              </div>
            }
          />
          <TestControls />
        </div>
      </WallieProvider>
    </div>
  );
}
