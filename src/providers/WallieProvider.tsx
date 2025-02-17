/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AddressFormat } from "../addresses";
import { useLocalStorage } from "../hooks/useLocalStorage";

export enum Network {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  SIGNET = "signet",
}

export enum Wallet {
  UNISAT = "unisat",
  XVERSE = "xverse",
  MAGICEDEN = "magiceden",
  LEATHER = "leather",
  OKX = "okx",
}

export interface BiAddress<T> {
  payments: T | null;
  ordinals: T | null;
}

export type BiAddressString = BiAddress<string>;
export type BiAddressFormat = BiAddress<AddressFormat>;

const EMPTY_BIADDRESS_OBJECT = {
  payments: null,
  ordinals: null,
};

interface WallieContextType {
  address: BiAddressString;
  updateAddress: (address: BiAddressString) => void;
  publicKey: BiAddressString;
  updatePublicKey: (publicKey: BiAddressString) => void;
  network: Network;
  updateNetwork: (network: Network) => void;
  wallet: Wallet | null;
  updateWallet: (wallet: Wallet | null) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  format: BiAddressFormat;
  updateFormat: (format: BiAddressFormat) => void;
  disconnectWallet: () => void;
}

const WallieContext = createContext<WallieContextType | undefined>(undefined);

const ADDRESS = "address";
const WALLET = "wallet";
const PUBLIC_KEY = "publicKey";
const FORMAT = "format";

export type WallieProviderProps = {
  initialNetwork: Network;
  ssr?: boolean;
};

/**
 * (Optionally) global context provider for WallieKit and its consumer(s).
 *
 * @component
 * @example
 * // Usage:
 * // Wrap your application with the WallieProvider to access the WallieContext.
 * // The provider manages the state and provides it to the child components.
 *
 * import { WallieProvider } from "./WallieProvider";
 *
 * function App() {
 *   return (
 *     <WallieProvider>
 *       <YourAppContent />
 *     </WallieProvider>
 *   );
 * }
 *
 * @param props - Props object.
 * @param props.initialNetwork - Initial network state if network is not set.
 * @param props.ssr - Enable SSR.
 * @returns Provider component for Wallie.
 */
export function WallieProvider({
  children,
  initialNetwork,
  ssr = false,
}: PropsWithChildren<WallieProviderProps>) {
  if (!initialNetwork) {
    throw new Error("Initial network cannot be empty");
  }
  const [network, setNetwork] = useState(initialNetwork);

  const [address, setAddress] = useLocalStorage<BiAddressString>(
    ADDRESS,
    EMPTY_BIADDRESS_OBJECT,
    { initializeWithValue: !ssr }
  );

  const [wallet, setWallet] = useLocalStorage<Wallet | null>(WALLET, null, {
    initializeWithValue: !ssr,
  });
  const [publicKey, setPublicKey] = useLocalStorage<BiAddressString>(
    PUBLIC_KEY,
    EMPTY_BIADDRESS_OBJECT,
    { initializeWithValue: !ssr }
  );

  const [format, setFormat] = useLocalStorage<BiAddressFormat>(
    FORMAT,
    EMPTY_BIADDRESS_OBJECT,
    { initializeWithValue: !ssr }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const disconnectWallet = useCallback(() => {
    setAddress(EMPTY_BIADDRESS_OBJECT);
    setPublicKey(EMPTY_BIADDRESS_OBJECT);
    setFormat(EMPTY_BIADDRESS_OBJECT as BiAddressFormat);
    setWallet(null);
  }, [setAddress, setFormat, setPublicKey, setWallet]);

  const context: WallieContextType = useMemo(
    () => ({
      address,
      updateAddress: setAddress,
      publicKey,
      updatePublicKey: setPublicKey,
      network,
      updateNetwork: setNetwork,
      wallet,
      updateWallet: setWallet,
      isModalOpen,
      openModal,
      closeModal,
      format,
      updateFormat: setFormat,
      disconnectWallet,
    }),
    [
      address,
      setAddress,
      publicKey,
      setPublicKey,
      network,
      setNetwork,
      wallet,
      setWallet,
      isModalOpen,
      openModal,
      closeModal,
      format,
      setFormat,
      disconnectWallet,
    ]
  );

  useEffect(() => {
    setNetwork(initialNetwork);
  }, [initialNetwork]);

  return (
    <WallieContext.Provider value={context}>{children}</WallieContext.Provider>
  );
}

export function useWallie() {
  const context = useContext(WallieContext);

  if (!context) {
    throw new Error("useWallie must be used within WallieProvider");
  }

  return context;
}
