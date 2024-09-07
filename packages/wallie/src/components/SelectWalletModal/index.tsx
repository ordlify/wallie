import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import CloseModalIcon from "../../assets/close-modal.svg";
import LeatherWalletIcon from "../../assets/leather-wallet.svg";
import MagicEdenWalletIcon from "../../assets/magiceden-wallet.svg";
// import OKXWalletIcon from "../../assets/okx-wallet.svg";
import UnisatWalletIcon from "../../assets/unisat-wallet.svg";
import XverseWalletIcon from "../../assets/xverse-wallet.svg";
import { getAddresses as getLeatherAddresses } from "../../browser-wallets/leather";
import { getAddresses as getMagicEdenAddress } from "../../browser-wallets/magiceden";
// import { getAddresses as getOKXAddresses } from "../../browser-wallets/okx";
import { getAddresses as getUnisatAddresses } from "../../browser-wallets/unisat";
import { getAddresses as getXverseAddresses } from "../../browser-wallets/xverse";
import {
  BrowserWalletNotInstalledError,
  BrowserWalletRequestCancelledByUserError,
} from "../../errors";
// import { Network, useWallie, Wallet } from "../../providers/WallieProvider";
import { useWallie, Wallet } from "../../providers/WallieProvider";
import { isMobileUserAgent } from "../../utils/mobile-detector";
import { waitForUnisatExtensionReady } from "../../utils/unisat";

import { WalletButton } from "./WalletButton";

interface SelectWalletModalProp {
  isOpen: boolean;
  closeModal: () => void;
}

const WALLET_CHROME_EXTENSION_URL: Record<Wallet, string> = {
  [Wallet.OKX]: "https://www.okx.com/web3",
  [Wallet.XVERSE]: "https://www.xverse.app/download",
  [Wallet.LEATHER]: "https://leather.io/install-extension",
  [Wallet.MAGICEDEN]: "https://wallet.magiceden.io/",
  [Wallet.UNISAT]: "https://unisat.io/download", // their www subdomain doesn't work
};

export function SelectWalletModal({
  isOpen,
  closeModal,
}: SelectWalletModalProp) {
  const {
    updateAddress,
    network,
    updateWallet,
    updatePublicKey,
    updateFormat,
    wallet,
    format,
    address,
    publicKey,
    disconnectWallet,
  } = useWallie();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isMobile = isMobileUserAgent();

  const onError = useCallback(
    (
      walletProvider: Wallet,
      err:
        | BrowserWalletNotInstalledError
        | BrowserWalletRequestCancelledByUserError
        | Error,
    ) => {
      if (err instanceof BrowserWalletNotInstalledError) {
        window.open(
          WALLET_CHROME_EXTENSION_URL[walletProvider],
          "_blank",
          "noopener,noreferrer",
        );
      }
      setErrorMessage(err.message ?? err.toString());
      disconnectWallet();
    },
    [disconnectWallet],
  );

  const onConnectMagicEdenWallet = useCallback(async () => {
    if (network === "testnet") {
      const unsupportedNetworkError = new Error(
        "Magic Eden wallet is not supported on testnet",
      );
      onError(Wallet.MAGICEDEN, unsupportedNetworkError);
      return false;
    }

    try {
      setErrorMessage("");
      const magicEdenAddresses = await getMagicEdenAddress(network);
      if (!magicEdenAddresses || magicEdenAddresses.length < 1) {
        disconnectWallet();
        throw new Error("Magic Eden via Ordit returned no addresses.");
      }

      // Magic Eden provides a segwit address by default for sending and receiving payments
      // Imported xverse wallets will return a p2sh address for payments by default instead
      const paymentAddress = magicEdenAddresses.find(
        (walletAddress) =>
          walletAddress.format === "segwit" ||
          walletAddress.format === "p2sh-p2wpkh",
      );

      if (!paymentAddress) {
        throw new Error(
          "Magic Eden via Ordit did not return a P2SH or Segwit address.",
        );
      }

      const ordinalsAddress = magicEdenAddresses.find(
        (walletAddress) => walletAddress.format === "taproot",
      );

      if (!ordinalsAddress) {
        throw new Error(
          "Magic Eden via Ordit did not return a Taproot address.",
        );
      }

      updateAddress({
        ordinals: ordinalsAddress.address,
        payments: paymentAddress.address,
      });
      updatePublicKey({
        ordinals: ordinalsAddress.publicKey,
        payments: paymentAddress.publicKey,
      });
      updateWallet(Wallet.MAGICEDEN);
      updateFormat({
        ordinals: ordinalsAddress.format,
        payments: paymentAddress.format,
      });
      closeModal();
      return true;
    } catch (err) {
      onError(Wallet.MAGICEDEN, err as Error);
      return false;
    }
  }, [
    closeModal,
    disconnectWallet,
    network,
    onError,
    updateAddress,
    updateFormat,
    updatePublicKey,
    updateWallet,
  ]);

  const onConnectUnisatWallet = useCallback(
    async ({ readOnly }: { readOnly?: boolean } = {}) => {
      try {
        // Reset error message
        setErrorMessage("");
        const unisat = await getUnisatAddresses(network, readOnly);

        if (!unisat || unisat.length < 1) {
          disconnectWallet();
          throw new Error("Unisat via Ordit returned no addresses.");
        }

        // Unisat only returns one wallet by default
        const unisatWallet = unisat[0];
        updateAddress({
          ordinals: unisatWallet.address,
          payments: unisatWallet.address,
        });
        updatePublicKey({
          ordinals: unisatWallet.publicKey,
          payments: unisatWallet.publicKey,
        });
        updateWallet(Wallet.UNISAT);
        updateFormat({
          ordinals: unisatWallet.format,
          payments: unisatWallet.format,
        });

        closeModal();
        return true;
      } catch (err) {
        onError(Wallet.UNISAT, err as Error);
        return false;
      }
    },
    [
      closeModal,
      disconnectWallet,
      network,
      onError,
      updateAddress,
      updateFormat,
      updatePublicKey,
      updateWallet,
    ],
  );

  const onConnectXverseWallet = useCallback(async () => {
    try {
      setErrorMessage("");
      const xverse = await getXverseAddresses(network);
      // P2SH-P2WPKH = BTC
      // Taproot = Ordinals / Inscriptions
      if (!xverse || xverse.length < 1) {
        disconnectWallet();
        throw new Error("Xverse via Ordit returned no addresses.");
      }

      // Xverse provides a nested segwit address by default for sending and receiving payments
      // Ledger wallets on Xverse will return a native segwit address for payments instead
      const paymentAddress = xverse.find(
        (walletAddress) =>
          walletAddress.format === "p2sh-p2wpkh" ||
          walletAddress.format === "segwit",
      );

      if (!paymentAddress) {
        throw new Error(
          "Xverse via Ordit did not return a P2SH or Segwit address.",
        );
      }

      const ordinalsAddress = xverse.find(
        (walletAddress) => walletAddress.format === "taproot",
      );

      if (!ordinalsAddress) {
        throw new Error("Xverse via Ordit did not return a Taproot address.");
      }

      updateAddress({
        ordinals: ordinalsAddress.address,
        payments: paymentAddress.address,
      });
      updatePublicKey({
        ordinals: ordinalsAddress.publicKey,
        payments: paymentAddress.publicKey,
      });
      updateWallet(Wallet.XVERSE);
      updateFormat({
        ordinals: ordinalsAddress.format,
        payments: paymentAddress.format,
      });
      closeModal();
      return true;
    } catch (err) {
      onError(Wallet.XVERSE, err as Error);
      return false;
    }
  }, [
    closeModal,
    disconnectWallet,
    network,
    onError,
    updateAddress,
    updateFormat,
    updatePublicKey,
    updateWallet,
  ]);

  const onConnectLeatherWallet = useCallback(async () => {
    try {
      setErrorMessage("");
      const leather = await getLeatherAddresses(network);
      if (!leather || leather.length < 1) {
        disconnectWallet();
        throw new Error("Leather via Ordit returned no addresses.");
      }

      const paymentAddress = leather.find(
        (walletAddress) => walletAddress.format === "segwit",
      );
      if (!paymentAddress) {
        throw new Error("Leather via Ordit did not return a Segwit address.");
      }

      const ordinalAddress = leather.find(
        (walletAddress) => walletAddress.format === "taproot",
      );
      if (!ordinalAddress) {
        throw new Error("Leather via Ordit did not return a Taproot address.");
      }

      updateAddress({
        ordinals: ordinalAddress.address,
        payments: paymentAddress.address,
      });
      updatePublicKey({
        ordinals: ordinalAddress.publicKey,
        payments: paymentAddress.publicKey,
      });
      updateWallet(Wallet.LEATHER);
      updateFormat({
        ordinals: ordinalAddress.format,
        payments: paymentAddress.format,
      });
      closeModal();
      return true;
    } catch (err) {
      onError(Wallet.LEATHER, err as Error);
      return false;
    }
  }, [
    closeModal,
    disconnectWallet,
    network,
    onError,
    updateAddress,
    updateFormat,
    updatePublicKey,
    updateWallet,
  ]);

  // const onConnectOKXWallet = useCallback(async () => {
  //   try {
  //     setErrorMessage("");
  //     const okx = await getOKXAddresses(network);
  //     if (!okx || okx.length < 1) {
  //       disconnectWallet();
  //       throw new Error("OKX via Ordit returned no addresses.");
  //     }

  //     const okxWallet = okx[0];
  //     updateAddress({
  //       ordinals: okxWallet.address,
  //       payments: okxWallet.address,
  //     });
  //     updatePublicKey({
  //       ordinals: okxWallet.publicKey,
  //       payments: okxWallet.publicKey,
  //     });
  //     updateWallet(Wallet.OKX);
  //     updateFormat({
  //       ordinals: okxWallet.format,
  //       payments: okxWallet.format,
  //     });
  //     closeModal();
  //     return true;
  //   } catch (err) {
  //     onError(Wallet.OKX, err as Error);
  //     return false;
  //   }
  // }, [
  //   closeModal,
  //   disconnectWallet,
  //   network,
  //   onError,
  //   updateAddress,
  //   updateFormat,
  //   updatePublicKey,
  //   updateWallet,
  // ]);

  // Reconnect address change listener if there there is already a connected wallet
  useEffect(() => {
    if (wallet !== Wallet.UNISAT) {
      return undefined;
    }

    let isMounted = true;
    let isConnectSuccessful = false;
    const listener = () => onConnectUnisatWallet();

    if (address && publicKey && format) {
      const connectToUnisatWalletOnReady = async () => {
        const isUnisatExtensionReady = await waitForUnisatExtensionReady();
        if (!isMounted) {
          return;
        }
        if (!isUnisatExtensionReady) {
          disconnectWallet();
          return;
        }

        isConnectSuccessful = await onConnectUnisatWallet({ readOnly: true });
        if (!isMounted) {
          return;
        }

        if (isConnectSuccessful) {
          window.unisat.addListener("accountsChanged", listener);
        }
      };
      connectToUnisatWalletOnReady();
    }
    return () => {
      isMounted = false;
      if (isConnectSuccessful) {
        window.unisat.removeListener("accountsChanged", listener);
      }
    };
  }, [
    wallet,
    onConnectUnisatWallet,
    disconnectWallet,
    address,
    publicKey,
    format,
  ]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="wallie-z-50 wallie-fixed wallie-inset-0 wallie-overflow-y-auto"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="wallie-ease-out wallie-duration-300"
          enterFrom="wallie-opacity-0"
          enterTo="wallie-opacity-100"
          leave="wallie-ease-in wallie-duration-200"
          leaveFrom="wallie-opacity-100"
          leaveTo="wallie-opacity-0"
        >
          <div className="wallie-fixed wallie-inset-0 wallie-bg-black wallie-bg-opacity-90 md:wallie-bg-opacity-75 wallie-transition-opacity" />
        </Transition.Child>

        <section className="wallie-fixed wallie-inset-0 wallie-z-10 wallie-overflow-y-auto">
          <div className="wallie-flex wallie-min-h-full wallie-w-full md:wallie-w-96 wallie-mx-auto wallie-items-end wallie-justify-center wallie-p-4 wallie-text-left sm:wallie-items-center sm:wallie-p-0">
            <Transition.Child
              as={Fragment}
              enter="wallie-ease-out wallie-duration-300"
              enterFrom="wallie-opacity-0 wallie-scale-95"
              enterTo="wallie-opacity-100 wallie-scale-100"
              leave="wallie-ease-in wallie-duration-200"
              leaveFrom="wallie-opacity-100 wallie-scale-100"
              leaveTo="wallie-opacity-0 wallie-scale-95"
            >
              <Dialog.Panel className="wallie-relative wallie-bg-ord-blue-600 wallie-transform wallie-overflow-hidden wallie-rounded-lg wallie-p-8 wallie-transition-all wallie-w-full">
                <section className="wallie-flex wallie-flex-row">
                  <Dialog.Title
                    as="h3"
                    className="wallie-text-[21px] wallie-font-medium wallie-leading-8 wallie--mt-1  wallie-text-ord-gray"
                  >
                    Connect a wallet to continue
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="wallie-ml-auto"
                  >
                    <img
                      src={CloseModalIcon}
                      alt="close modal"
                      className="wallie-w-[19px] wallie-h-[19px]"
                    />
                  </button>
                </section>

                <p className="wallie-text-ord-light-blue-400 wallie-font-medium wallie-py-3">
                  Choose a wallet below to connect and continue
                </p>

                {errorMessage && (
                  <p className="wallie-text-ord-alert wallie-pb-4">
                    {errorMessage}
                  </p>
                )}

                <section className="wallie-w-full">
                  <section className="wallie-w-full wallie-space-y-4">
                    <WalletButton
                      wallet={Wallet.LEATHER}
                      subtitle="Coming soon on mobile browsing"
                      onConnect={onConnectLeatherWallet}
                      icon={LeatherWalletIcon}
                      setErrorMessage={setErrorMessage}
                      isDisabled={isMobile}
                      isMobileDevice={isMobile}
                    />
                    <WalletButton
                      wallet={Wallet.XVERSE}
                      subtitle=""
                      onConnect={onConnectXverseWallet}
                      icon={XverseWalletIcon}
                      setErrorMessage={setErrorMessage}
                      isMobileDevice={isMobile}
                    />
                    {/* {!isMobile || (isMobile && network === Network.MAINNET) ? (
                      <WalletButton
                        wallet={Wallet.OKX}
                        subtitle=""
                        onConnect={onConnectOKXWallet}
                        icon={OKXWalletIcon}
                        setErrorMessage={setErrorMessage}
                        isMobileDevice={isMobile}
                      />
                    ) : null} */}
                    {!isMobile && ( // TODO: remove this once unisat supported on mobile devices
                      <WalletButton
                        wallet={Wallet.UNISAT}
                        subtitle="Coming soon on mobile browsing"
                        onConnect={onConnectUnisatWallet}
                        icon={UnisatWalletIcon}
                        setErrorMessage={setErrorMessage}
                        isDisabled={isMobile} // disable unisat on mobile until it is supported
                        isMobileDevice={isMobile}
                      />
                    )}
                    <WalletButton
                      wallet={Wallet.MAGICEDEN}
                      subtitle=""
                      onConnect={onConnectMagicEdenWallet}
                      icon={MagicEdenWalletIcon}
                      setErrorMessage={setErrorMessage}
                      isMobileDevice={isMobile}
                    />
                  </section>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </section>
      </Dialog>
    </Transition>
  );
}
