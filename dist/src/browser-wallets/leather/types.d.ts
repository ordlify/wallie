import { BrowserWalletNetwork } from "../../config/types";
export declare enum LeatherSignatureHash {
    ALL = 1,
    NONE = 2,
    SINGLE = 3,
    ALL_ANYONECANPAY = 129,
    NONE_ANYONECANPAY = 130,
    SINGLE_ANYONECANPAY = 131
}
export declare enum LeatherAddressType {
    P2WPKH = "p2wpkh",
    P2TR = "p2tr"
}
export type LeatherJsonRPCResponse<T> = {
    id: string;
    jsonrpc: string;
    result: T;
};
export type LeatherAddress = {
    symbol: string;
    type?: LeatherAddressType;
    address: string;
    publicKey?: string;
    derivationPath?: string;
    tweakedPublicKey?: string;
};
export type LeatherGetAddresses = {
    addresses: LeatherAddress[];
};
export type LeatherSignMessage = {
    address: string;
    message: string;
    signature: string;
};
export type LeatherSignPsbt = {
    hex: string;
};
export type LeatherSignPSBTOptions = {
    allowedSighash?: LeatherSignatureHash[];
    finalize?: boolean;
    extractTx?: boolean;
    /**
     * default is user's current network
     */
    network?: BrowserWalletNetwork;
    /**
     * default is user's current account
     */
    accountNumber?: number;
    signAtIndexes?: number[];
};
export type LeatherSignMessageOptions = {
    network: BrowserWalletNetwork;
    paymentType: LeatherAddressType;
};
//# sourceMappingURL=types.d.ts.map