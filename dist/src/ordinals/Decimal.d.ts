import type { Height } from "./Height";
import type { Sat } from "./Sat";
/**
 * Decimal converts Sat into format `A.B`
 */
export declare class Decimal {
    readonly height: Height;
    readonly offset: number;
    constructor(height: Height, // A is the block height
    offset: number);
    static from(sat: Sat): Decimal;
    toString(): string;
}
//# sourceMappingURL=Decimal.d.ts.map