import { ReactNode } from "react";
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
export declare function OrdConnectKit({ connectButton, connectButtonComponent, hideConnectButton, onViewProfile, onChangeWalletClick, onDisconnectWalletClick, }: OrdConnectKitProp): import("react/jsx-runtime").JSX.Element;
