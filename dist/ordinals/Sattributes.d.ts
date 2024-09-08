import type { Sat } from "./Sat";
export declare enum Sattribute {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    Epic = "epic",
    Legendary = "legendary",
    Mythic = "mythic",
    Palindrome = "palindrome"
}
export declare class Sattributes {
    readonly sattributes: Sattribute[];
    constructor(sattributes: Sattribute[]);
    static from(sat: Sat): Sattributes;
    static isPalindrome(n: number): boolean;
    toString(): string;
    toList(): Sattribute[];
}
