import { Wallet } from "../../providers/WallieProvider";
interface WalletButtonProp {
    wallet: Wallet;
    subtitle: string;
    onConnect: () => Promise<boolean>;
    icon: string;
    setErrorMessage: (msg: string) => void;
    isDisabled?: boolean;
    isMobileDevice?: boolean;
    preferred?: boolean;
}
export declare function WalletButton({ wallet, subtitle, onConnect, icon, setErrorMessage, isDisabled, isMobileDevice, preferred, }: WalletButtonProp): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WalletButton.d.ts.map