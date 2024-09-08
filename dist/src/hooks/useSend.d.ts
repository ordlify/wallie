type SendFunction = (address: string, satoshis: number, feeRate: number, relay?: boolean) => Promise<string | null>;
export declare function useSend(): {
    send: SendFunction;
    error: string | null;
    loading: boolean;
};
export {};
//# sourceMappingURL=useSend.d.ts.map