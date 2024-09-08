import { ReactNode } from 'react';
import { OrdConnectKitProp } from '../OrdConnectKit';

interface PreConnectButtonProp extends OrdConnectKitProp {
    openModal: () => void;
    disabled?: boolean;
    connectButton?: string;
    connectButtonComponent: ReactNode;
}
export declare function PreConnectButton({ openModal, disabled, connectButton, connectButtonComponent, }: PreConnectButtonProp): import("react/jsx-runtime").JSX.Element;
export {};
