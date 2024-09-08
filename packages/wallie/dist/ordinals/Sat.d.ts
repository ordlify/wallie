import { Decimal } from "./Decimal";
import { Degree } from "./Degree";
import { Epoch } from "./Epoch";
import { Height } from "./Height";
import { Rarity } from "./Rarity";
import { Sattributes } from "./Sattributes";
export declare class Sat {
    #private;
    readonly n: number;
    constructor(n: number);
    static fromName(name: string): Sat;
    get height(): Height;
    get cycle(): number;
    get percentile(): string;
    get degree(): Degree;
    get third(): number;
    get epoch(): Epoch;
    get period(): number;
    get rarity(): Rarity;
    get epochPosition(): number;
    get decimal(): Decimal;
    get name(): string;
    get sattributes(): Sattributes;
    toJSON(): {
        number: number;
        decimal: string;
        degree: string;
        name: string;
        block: number;
        cycle: number;
        epoch: number;
        period: number;
        offset: number;
        rarity: import("./Rarity").RarityAttribute;
        percentile: string;
        sattributes: import("./Sattributes").Sattribute[];
    };
}
/**
 * Copied from the ord server implementation https://github.com/ordinals/ord/blob/8e8449bcc55af275b79fff00077d4841528aa233/src/epoch.rs#L6-L42
 */
export declare const STARTING_SATS: Sat[];
