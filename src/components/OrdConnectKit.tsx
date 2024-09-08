import { ReactNode } from "react";

import useHasMounted from "../hooks/useHasMounted";
import { useWallie } from "../providers/WallieProvider";

import { PostConnectButton } from "./PostConnectButton";
import { PreConnectButton } from "./PreConnectButton";
import { SelectWalletModal } from "./SelectWalletModal";

import "./style.css";

export interface OrdConnectKitProp {
  connectButton?: string;
  connectButtonComponent?: ReactNode;
  hideConnectButton?: boolean;
  onViewProfile?: () => void;
  onChangeWalletClick?: () => void;
  onDisconnectWalletClick?: () => void;
}

/**
 * Parent React component for OrdConnectKit, in the form of a button.
 *
 * @component
 * @param {Object} props - Props for the OrdConnectKit component.
 * @param {boolean} [props.hideConnectButton] - Hides the connect and connected status button.
 * @param {Function} [props.onViewProfile] - Callback function to handle clicking view wallet profile.
 * @param {Function} [props.onChangeWalletClick] - Callback function to handle clicking change wallet.
 * @param {Function} [props.onDisconnectWalletClick] - Callback function to handle clicking disconnect wallet.
 * @returns {JSX.Element} OrdConnectKit React component.
 */
export function OrdConnectKit({
  connectButton,
  connectButtonComponent,
  hideConnectButton,
  onViewProfile,
  onChangeWalletClick,
  onDisconnectWalletClick,
}: OrdConnectKitProp) {
  const {
    address,
    disconnectWallet,
    network,
    isModalOpen,
    openModal,
    closeModal,
  } = useWallie();

  const hasMounted = useHasMounted();

  const renderConnectButton = () => {
    if (hideConnectButton) {
      return null;
    }

    return address?.ordinals ? (
      <PostConnectButton
        address={address.ordinals}
        network={network}
        onViewProfile={onViewProfile}
        onChangeWallet={() => {
          openModal();
          onChangeWalletClick?.();
        }}
        onDisconnectWallet={() => {
          disconnectWallet();
          onDisconnectWalletClick?.();
        }}
      />
    ) : (
      <PreConnectButton
        disabled={!hasMounted}
        connectButton={connectButton}
        connectButtonComponent={connectButtonComponent}
        openModal={openModal}
      />
    );
  };

  return (
    <>
      {renderConnectButton()}
      {hasMounted ? (
        <SelectWalletModal isOpen={isModalOpen} closeModal={closeModal} />
      ) : null}
    </>
  );
}
