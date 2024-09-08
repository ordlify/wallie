export declare function useSignMessage(): {
    isLoading: boolean;
    signMsg: (address: string, message: string) => Promise<string | null>;
    error: string | null;
};
