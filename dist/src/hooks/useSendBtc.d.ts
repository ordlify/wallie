type SendFunction = (address: string, satoshis: number) => Promise<string | null>;
export declare function useSendBtc(): {
    send: SendFunction;
    error: string | null;
    loading: boolean;
};
export {};
//# sourceMappingURL=useSendBtc.d.ts.map