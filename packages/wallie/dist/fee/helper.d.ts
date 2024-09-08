import type { AddressFormat } from "../addresses/types";
/**
 * Transaction header size for all script types. We overestimate the header size (previously 10 for p2sh-p2wpkh and legacy) during calculation as the final result will have almost no difference.
 */
export declare const TRANSACTION_HEADER_SIZE = 10.5;
/**
 * Gets the base size of a script type.
 *
 * @param type Script type (based on address format)
 * @returns Input, output and witness size of the script
 */
export declare function getBaseSizeByType(type: AddressFormat): {
    input: number;
    output: number;
    witness: number;
};
