import type { AddressFormat } from "../addresses/types";
import type { Network } from "../config/types";
import { BaseDatasource } from "../modules";
import type { UTXO, UTXOLimited } from "./types";
interface BaseInputType {
    hash: string;
    index: number;
    sighashType?: number;
}
type LegacyInputType = BaseInputType & {
    type: Extract<AddressFormat, "legacy">;
    nonWitnessUtxo?: Buffer;
    witnessUtxo?: {
        script: Buffer;
        value: number;
    };
};
type SegwitInputType = BaseInputType & {
    type: Extract<AddressFormat, "segwit">;
    witnessUtxo?: {
        script: Buffer;
        value: number;
    };
    witness?: Buffer[];
};
type P2SHP2WPKHInputType = BaseInputType & Omit<SegwitInputType, "type"> & {
    type: Extract<AddressFormat, "p2sh-p2wpkh">;
    redeemScript: Buffer;
};
interface TapScript {
    leafVersion: number;
    script: Buffer;
}
export declare type ControlBlock = Buffer;
export interface TapLeafScript extends TapScript {
    controlBlock: ControlBlock;
}
type TaprootInputType = BaseInputType & Omit<SegwitInputType, "type"> & {
    type: Extract<AddressFormat, "taproot">;
    tapInternalKey: Buffer;
    tapLeafScript?: TapLeafScript[];
};
export type InputType = LegacyInputType | SegwitInputType | P2SHP2WPKHInputType | TaprootInputType;
interface ProcessInputOptions {
    utxo: UTXO | UTXOLimited;
    pubKey: string;
    network: Network;
    sighashType?: number;
    witness?: Buffer[];
    datasource?: BaseDatasource;
}
export declare function processInput({ utxo, pubKey, network, sighashType, witness, datasource: _datasource, }: ProcessInputOptions): Promise<InputType>;
export {};
//# sourceMappingURL=helper.d.ts.map