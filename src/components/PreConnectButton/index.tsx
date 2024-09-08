import { ReactNode } from "react";

import WalletIcon from "../../assets/wallet-icon.svg";
import type { OrdConnectKitProp } from "../OrdConnectKit";

interface PreConnectButtonProp extends OrdConnectKitProp {
  openModal: () => void;
  disabled?: boolean;
  connectButton?: string;
  connectButtonComponent: ReactNode;
}

export function PreConnectButton({
  openModal,
  disabled,
  connectButton = "Wallet Connect",
  connectButtonComponent,
}: PreConnectButtonProp) {
  if (connectButtonComponent) {
    return (
      <button
        onClick={openModal}
        aria-label="Connect Button"
        type="button"
        className="wallie-w-full"
      >
        {connectButtonComponent}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={openModal}
      disabled={disabled}
      className="wallie-bg-ord-orange wallie-rounded-full wallie-flex wallie-flex-row md:wallie-space-x-2 wallie-items-center wallie-p-1 wallie-pr-2 wallie-px-1 md:wallie-pr-3 md:wallie-px-3"
    >
      <img className="wallie-w-6 md:wallie-w-7" src={WalletIcon} alt="" />
      <span className="wallie-hidden md:wallie-block wallie-text-ord-blue wallie-mb-1 wallie-pr-2">
        {connectButton}
      </span>
    </button>
  );
}
