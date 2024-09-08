import { Height } from "./Height";
import type { Sat } from "./Sat";
export declare class Epoch {
    #private;
    readonly n: number;
    /**
     * First epoch where no new bitcoin will be mined
     */
    static readonly FIRST_POST_SUBSIDY: Epoch;
    constructor(n: number);
    static from(sat: Sat): Epoch;
    static fromHeight(height: Height): Epoch;
    /**
     * subsidy refers to how much satoshis will be created/mined per block
     */
    get subsidy(): number;
    get startingSat(): Sat;
    get startingHeight(): Height;
}
//# sourceMappingURL=Epoch.d.ts.map