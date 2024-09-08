import { Dispatch, SetStateAction } from "react";
export declare function useLocalStorage<T>(key: string, initialValue: T, options?: {
    initializeWithValue?: boolean;
}): [T, Dispatch<SetStateAction<T>>];
