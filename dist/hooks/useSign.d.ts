import { SerializedPsbt, SignPsbtOptionsParams } from "../lib/signPsbt";
export declare function useSign(): {
    sign: (address: string, unsignedPsbtBase64: string, options: SignPsbtOptionsParams) => Promise<SerializedPsbt>;
    error: string | null;
    loading: boolean;
};
