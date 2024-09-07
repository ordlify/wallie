interface PostConnectButtonProp {
    address: string;
    network: string;
    onViewProfile?: () => void;
    onChangeWallet?: () => void;
    onDisconnectWallet?: () => void;
}
export declare function PostConnectButton({ address, network, onViewProfile, onChangeWallet, onDisconnectWallet, }: PostConnectButtonProp): import("react/jsx-runtime").JSX.Element;
export {};
