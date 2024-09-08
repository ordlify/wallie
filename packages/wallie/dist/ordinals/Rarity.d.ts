import type { Sat } from "./Sat";
import { Sattribute } from "./Sattributes";
export type RarityAttribute = Sattribute.Common | Sattribute.Uncommon | Sattribute.Rare | Sattribute.Epic | Sattribute.Legendary | Sattribute.Mythic;
export declare class Rarity {
    readonly name: RarityAttribute;
    constructor(name: RarityAttribute);
    static from(sat: Sat): Rarity;
    toString(): RarityAttribute;
}
