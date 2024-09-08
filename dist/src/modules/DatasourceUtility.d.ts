import type { GetUnspentsResponse } from "../api/types";
import type { Inscription } from "../inscription/types";
import type { UTXO } from "../transactions/types";
interface SegregateUTXOsBySpendStatusArgOptions {
    utxos: UTXO[];
}
interface ParseInscriptionsOptions {
    decodeMetadata: boolean;
}
declare class DatasourceUtility {
    /**
     * Parses an inscription.
     *
     * @param inscription Inscription
     * @param options Options
     * - `decodeMetadata` decodes the metadata object into [valid URI components](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent).
     * @returns Parsed inscription
     */
    static parseInscription(inscription: Inscription, { decodeMetadata }: ParseInscriptionsOptions): {
        meta: Record<string, unknown> | undefined;
        id: string;
        outpoint: string;
        owner: string;
        genesis: string;
        fee: number;
        height: number;
        number: number;
        sat: number;
        timestamp: number;
        mediaType: string;
        mediaSize: number;
        mediaContent: string;
    };
    /**
     * Parses inscriptions.
     *
     * @param inscriptions Inscriptions
     * @param options Options
     * - `decodeMetadata` decodes the metadata object into [valid URI components](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent).
     * @returns Parsed inscriptions
     */
    static parseInscriptions(inscriptions: Inscription[], { decodeMetadata }: ParseInscriptionsOptions): {
        meta: Record<string, unknown> | undefined;
        id: string;
        outpoint: string;
        owner: string;
        genesis: string;
        fee: number;
        height: number;
        number: number;
        sat: number;
        timestamp: number;
        mediaType: string;
        mediaSize: number;
        mediaContent: string;
    }[];
    static segregateUTXOsBySpendStatus({ utxos, }: SegregateUTXOsBySpendStatusArgOptions): GetUnspentsResponse;
}
export { DatasourceUtility };
//# sourceMappingURL=DatasourceUtility.d.ts.map