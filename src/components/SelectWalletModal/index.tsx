import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  BrowserWalletNotInstalledError,
  BrowserWalletRequestCancelledByUserError,
} from "@ordzaar/ordit-sdk";
import { getAddresses as getLeatherAddresses } from "@ordzaar/ordit-sdk/leather";
import { getAddresses as getMagicEdenAddress } from "@ordzaar/ordit-sdk/magiceden";
import { getAddresses as getOKXAddresses } from "@ordzaar/ordit-sdk/okx";
import { getAddresses as getUnisatAddresses } from "@ordzaar/ordit-sdk/unisat";
import { getAddresses as getXverseAddresses } from "@ordzaar/ordit-sdk/xverse";

import CloseModalIcon from "../../assets/close-modal.svg";
import LeatherWalletIcon from "../../assets/leather-wallet.svg";
import MagicEdenWalletIcon from "../../assets/magiceden-wallet.svg";
import OKXWalletIcon from "../../assets/okx-wallet.svg";
import UnisatWalletIcon from "../../assets/unisat-wallet.svg";
import XverseWalletIcon from "../../assets/xverse-wallet.svg";
import { Network, useWallie, Wallet } from "../../providers/WallieProvider";
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
        | Error
    ) => {
      if (err instanceof BrowserWalletNotInstalledError) {
        window.open(
          WALLET_CHROME_EXTENSION_URL[walletProvider],
          "_blank",
          "noopener,noreferrer"
        );
      }
      setErrorMessage(err.message ?? err.toString());
      console.error(`Error while connecting to ${walletProvider} wallet`, err);
      disconnectWallet();
    },
    [disconnectWallet]
  );

  const onConnectMagicEdenWallet = useCallback(async () => {
    if (network === "testnet") {
      const unsupportedNetworkError = new Error(
        "Magic Eden wallet is not supported on testnet"
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
          walletAddress.format === "p2sh-p2wpkh"
      );

      if (!paymentAddress) {
        throw new Error(
          "Magic Eden via Ordit did not return a P2SH or Segwit address."
        );
      }

      const ordinalsAddress = magicEdenAddresses.find(
        (walletAddress) => walletAddress.format === "taproot"
      );

      if (!ordinalsAddress) {
        throw new Error(
          "Magic Eden via Ordit did not return a Taproot address."
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
    ]
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
          walletAddress.format === "segwit"
      );

      if (!paymentAddress) {
        throw new Error(
          "Xverse via Ordit did not return a P2SH or Segwit address."
        );
      }

      const ordinalsAddress = xverse.find(
        (walletAddress) => walletAddress.format === "taproot"
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
        (walletAddress) => walletAddress.format === "segwit"
      );
      if (!paymentAddress) {
        throw new Error("Leather via Ordit did not return a Segwit address.");
      }

      const ordinalAddress = leather.find(
        (walletAddress) => walletAddress.format === "taproot"
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

  const onConnectOKXWallet = useCallback(async () => {
    try {
      setErrorMessage("");
      const okx = await getOKXAddresses(network);
      if (!okx || okx.length < 1) {
        disconnectWallet();
        throw new Error("OKX via Ordit returned no addresses.");
      }

      const okxWallet = okx[0];
      updateAddress({
        ordinals: okxWallet.address,
        payments: okxWallet.address,
      });
      updatePublicKey({
        ordinals: okxWallet.publicKey,
        payments: okxWallet.publicKey,
      });
      updateWallet(Wallet.OKX);
      updateFormat({
        ordinals: okxWallet.format,
        payments: okxWallet.format,
      });
      closeModal();
      return true;
    } catch (err) {
      onError(Wallet.OKX, err as Error);
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
  }, [wallet, onConnectUnisatWallet, disconnectWallet]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="z-50 fixed inset-0 overflow-y-auto"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-90 md:bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <section className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full w-full md:w-[364px] mx-auto items-end justify-center p-4 text-left sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-ord-blue-600 transform overflow-hidden rounded-lg p-8 transition-all w-full">
                <section className="flex flex-row">
                  <Dialog.Title
                    as="h3"
                    className="text-[21px] font-medium leading-8 -mt-1  text-ord-gray"
                  >
                    Connect a wallet to continue
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="ml-auto"
                  >
                    <img
                      src={CloseModalIcon}
                      alt="close modal"
                      className="w-[19px] h-[19px]"
                    />
                  </button>
                </section>

                <p className="text-ord-light-blue-400 font-medium py-3">
                  Choose a wallet below to connect and continue
                </p>

                {errorMessage && (
                  <p className="text-ord-alert pb-4">{errorMessage}</p>
                )}

                <section className="w-full">
                  <section className="w-full space-y-4">
                    <WalletButton
                      wallet={Wallet.XVERSE}
                      subtitle=""
                      onConnect={onConnectXverseWallet}
                      icon={XverseWalletIcon}
                      setErrorMessage={setErrorMessage}
                      isMobileDevice={isMobile}
                    />
                    {!isMobile || (isMobile && network === Network.MAINNET) ? (
                      <WalletButton
                        wallet={Wallet.OKX}
                        subtitle=""
                        onConnect={onConnectOKXWallet}
                        icon={OKXWalletIcon}
                        setErrorMessage={setErrorMessage}
                        isMobileDevice={isMobile}
                      />
                    ) : null}
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
                    {!isMobile && (
                      <>
                        <WalletButton
                          wallet={Wallet.MAGICEDEN}
                          subtitle="Coming soon on mobile browsing"
                          onConnect={onConnectMagicEdenWallet}
                          icon={MagicEdenWalletIcon}
                          setErrorMessage={setErrorMessage}
                          isDisabled={isMobile}
                          isMobileDevice={isMobile}
                        />
                        <WalletButton
                          wallet={Wallet.LEATHER}
                          subtitle="Coming soon on mobile browsing"
                          onConnect={onConnectLeatherWallet}
                          icon={LeatherWalletIcon}
                          setErrorMessage={setErrorMessage}
                          isDisabled={isMobile}
                          isMobileDevice={isMobile}
                        />
                      </>
                    )}
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
