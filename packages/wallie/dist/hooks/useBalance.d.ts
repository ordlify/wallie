export declare function useBalance(): {
    getBalance: () => Promise<number>;
    error: string | null;
    loading: boolean;
};
