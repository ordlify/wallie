import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

import ChevronDownIcon from "../../assets/chevron-down.svg";
import LeatherWalletIcon from "../../assets/leather-wallet.svg";
import LogoutIcon from "../../assets/logout.svg";
import MagicEdenIcon from "../../assets/magiceden-wallet.svg";
import OKXWalletIcon from "../../assets/okx-wallet.svg";
import UnisatWalletIcon from "../../assets/unisat-wallet.svg";
import XverseWalletIcon from "../../assets/xverse-wallet.svg";
import { Network, useWallie, Wallet } from "../../providers/WallieProvider";
import { truncateMiddle } from "../../utils/text-helper";

const WALLET_TO_ICON: Record<Wallet, string> = {
  [Wallet.XVERSE]: XverseWalletIcon,
  [Wallet.MAGICEDEN]: MagicEdenIcon,
  [Wallet.UNISAT]: UnisatWalletIcon,
  [Wallet.LEATHER]: LeatherWalletIcon,
  [Wallet.OKX]: OKXWalletIcon,
} as const;

interface PostConnectButtonProp {
  address: string;
  network: string;
  onViewProfile?: () => void;
  onChangeWallet?: () => void;
  onDisconnectWallet?: () => void;
}

const NETWORK_DISPLAY_NAME = {
  [Network.MAINNET]: "Mainnet",
  [Network.TESTNET]: "Testnet",
  [Network.SIGNET]: "Signet",
} as const;

export function PostConnectButton({
  address,
  network,
  onViewProfile,
  onChangeWallet,
  onDisconnectWallet,
}: PostConnectButtonProp) {
  const { wallet } = useWallie();

  return (
    <Menu
      as="section"
      className="wallie-relative wallie-inline-block wallie-text-left"
    >
      {({ open }) => (
        <>
          <Menu.Button>
            <div className="wallet-identifier-container">
              <img
                src={WALLET_TO_ICON[wallet as Wallet]}
                alt={`${wallet} is connected`}
              />
            </div>

            <section className="address-container">
              <p className="address">{truncateMiddle(address)}</p>
              <section className="network-container">
                <div className="status-indicator" />
                <p className="network">
                  {NETWORK_DISPLAY_NAME[network as Network] ?? network}
                </p>
              </section>
            </section>
            <img
              src={ChevronDownIcon}
              className={`dropdown-button ${
                open ? "close-dropdown-button" : "expand-dropdown-button"
              }`}
              alt="ord connect dropdown"
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="ord-wallet-connection-dropdown">
              <Menu.Item
                as="button"
                className="dropdown-button"
                onClick={() => onViewProfile?.()}
              >
                <span className="label">View profile</span>
                <span className="value">{truncateMiddle(address)}</span>
              </Menu.Item>
              <Menu.Item
                as="button"
                className="dropdown-button"
                onClick={() => onChangeWallet?.()}
              >
                <span className="change-wallet-label">Change wallet</span>
              </Menu.Item>
              <hr className="horizontal-separator" />
              <Menu.Item
                as="button"
                className="dropdown-button"
                onClick={() => onDisconnectWallet?.()}
              >
                <span className="label">Disconnect wallet</span>
                <img src={LogoutIcon} className="logout-icon" alt="logout" />
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
