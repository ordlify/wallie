export type LeatherErrorResponse = {
    error: {
        code: number;
        message: string;
    };
    id: string;
    jsonrpc: string;
};
export declare function leatherRequest<T>(arg: string, params?: object | string[]): Promise<T>;
