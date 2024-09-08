import { PropsWithChildren } from "react";
import { AddressFormat } from "../addresses";
export declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    SIGNET = "signet"
}
export declare enum Wallet {
    UNISAT = "unisat",
    XVERSE = "xverse",
    MAGICEDEN = "magiceden",
    LEATHER = "leather",
    OKX = "okx"
}
export interface BiAddress<T> {
    payments: T | null;
    ordinals: T | null;
}
export type BiAddressString = BiAddress<string>;
export type BiAddressFormat = BiAddress<AddressFormat>;
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
export declare function WallieProvider({ children, initialNetwork, ssr, }: PropsWithChildren<WallieProviderProps>): import("react/jsx-runtime").JSX.Element;
export declare function useWallie(): WallieContextType;
export {};
