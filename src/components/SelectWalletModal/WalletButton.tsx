import { useCallback, useState } from "react";

import LoadingIcon from "../../assets/loading.svg";
import { useWallie, Wallet } from "../../providers/WallieProvider";
import { truncateMiddle } from "../../utils/text-helper";

const WALLET_TO_NAME: Record<Wallet, string> = {
  [Wallet.MAGICEDEN]: "Magic Eden",
  [Wallet.UNISAT]: "UniSat",
  [Wallet.XVERSE]: "Xverse",
  [Wallet.LEATHER]: "Leather",
  [Wallet.OKX]: "OKX",
} as const;

interface WalletButtonProp {
  wallet: Wallet;
  subtitle: string;
  onConnect: () => Promise<boolean>;
  icon: string;
  setErrorMessage: (msg: string) => void;
  isDisabled?: boolean;
  isMobileDevice?: boolean;
  // renderAvatar?: (address: string, size: "large" | "small") => ReactNode;
}

export function WalletButton({
  wallet,
  subtitle,
  onConnect,
  icon,
  setErrorMessage,
  isDisabled,
  isMobileDevice,
  // renderAvatar,
}: WalletButtonProp) {
  const { wallet: _connectedWallet, address: _connectedAddress } = useWallie();

  // Introduce an initial state because otherwise while the modal is closing,
  // the connected address is suddenly updated in the dialog
  const [{ connectedWallet, connectedAddress }] = useState({
    connectedWallet: _connectedWallet,
    connectedAddress: _connectedAddress,
  });

  const [loading, setLoading] = useState(false);
  const walletName = WALLET_TO_NAME[wallet];

  const handleWalletConnectClick = useCallback(async () => {
    setLoading(true);
    const result = await Promise.race([
      onConnect()
        .then(() => setLoading(false))
        .catch(() => setLoading(false)),
      new Promise<string>((resolve) => {
        setTimeout(() => resolve("timeout"), 5000);
      }),
    ]);
    if (result === "timeout") {
      setErrorMessage(
        "No wallet pop-up? The extension is not responding. Try reloading your browser."
      );
    } else {
      setLoading(false);
    }
  }, [onConnect, setErrorMessage]);

  return (
    <button
      type="button"
      className="w-full flex flex-row justify-between items-center text-ord-light-gray bg-ord-light-blue hover:bg-ord-light-blue-250 p-2 rounded-lg md:text-xl space-x-4 md:space-x-6 ease-in transition-all duration-100 ease-in-outscale-120"
      onClick={handleWalletConnectClick}
      disabled={isDisabled}
    >
      <div className="flex flex-row space-x-2">
        <img className="w-5 md:w-8" src={icon} alt="" />
        <span className="text-lg block font-medium">{walletName}</span>
        <span
          className="text-sm font-medium"
          style={{ display: isMobileDevice ? "block" : "none" }}
        >
          {subtitle}
        </span>
      </div>
      {connectedWallet === wallet && connectedAddress.ordinals ? (
        <div className="flex flex-row ml-auto">
          <span className="text-sm font-medium pr-3">
            {truncateMiddle(connectedAddress.ordinals)}
          </span>
        </div>
      ) : null}
      {loading && (
        <img
          src={LoadingIcon}
          width={24}
          alt={`${walletName} extension is loading`}
        />
      )}
    </button>
  );
}
