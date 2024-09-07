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
}

export function WalletButton({
  wallet,
  subtitle,
  onConnect,
  icon,
  setErrorMessage,
  isDisabled,
  isMobileDevice,
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
      className="wallie-w-full wallie-flex wallie-flex-row wallie-justify-between wallie-items-center wallie-text-ord-light-gray wallie-bg-ord-light-blue wallie-hover:bg-ord-light-blue-250 wallie-p-2 wallie-rounded-lg md:wallie-text-xl wallie-space-x-4 md:space-x-6 wallie-ease-in wallie-transition-all wallie-duration-100 wallie-ease-in-outscale-120"
      onClick={handleWalletConnectClick}
      disabled={isDisabled}
    >
      <div className="wallie-flex wallie-flex-row wallie-space-x-2">
        <img className="wallie-w-5 md:wallie-w-8" src={icon} alt="" />
        <span className="wallie-text-lg wallie-block wallie-font-medium">
          {walletName}
        </span>
        <span
          className="wallie-text-sm wallie-font-medium"
          style={{ display: isMobileDevice ? "block" : "none" }}
        >
          {subtitle}
        </span>
      </div>
      {connectedWallet === wallet && connectedAddress.ordinals ? (
        <div className="wallie-flex wallie-flex-row wallie-ml-auto">
          <span className="wallie-text-sm wallie-font-medium wallie-pr-3">
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
