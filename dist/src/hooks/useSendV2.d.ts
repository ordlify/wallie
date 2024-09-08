type SendFunction = (sendParams: SendParams) => Promise<SendResponse>;
type SendParams = {
    toAddress: string;
    satoshis: number;
    feeRate: number;
    relay?: boolean;
    rbf?: boolean;
};
type SendResponse = {
    txId?: string;
    signedPsbtHex?: string;
    error?: string;
};
export declare function useSendV2(): {
    send: SendFunction;
    isLoading: boolean;
};
export {};
//# sourceMappingURL=useSendV2.d.ts.map