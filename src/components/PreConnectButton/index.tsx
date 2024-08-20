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
      <button onClick={openModal} aria-label="Connect Button" type="button">
        {connectButtonComponent}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={openModal}
      disabled={disabled}
      className="bg-ord-orange rounded-full flex flex-row md:space-x-2 items-center p-1 pr-2 px-1 md:pr-3 md:px-3"
    >
      <img className="w-6 md:w-7" src={WalletIcon} alt="" />
      <span className="hidden md:block text-ord-blue  mb-1 pr-2">
        {connectButton}
      </span>
    </button>
  );
}
