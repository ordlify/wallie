import { Wallet } from '../../providers/WallieProvider';

interface WalletButtonProp {
    wallet: Wallet;
    subtitle: string;
    onConnect: () => Promise<boolean>;
    icon: string;
    setErrorMessage: (msg: string) => void;
    isDisabled?: boolean;
    isMobileDevice?: boolean;
}
export declare function WalletButton({ wallet, subtitle, onConnect, icon, setErrorMessage, isDisabled, isMobileDevice, }: WalletButtonProp): import("react/jsx-runtime").JSX.Element;
export {};
