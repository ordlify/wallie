import { Sat } from './Sat';

/**
 * Degree converts Sat into format `A°B′C″D‴`
 */
export declare class Degree {
    /**
     * A° - Index of Sat in the Block
     */
    readonly hour: number;
    /**
     * B′ - Index of the Block in the Difficulty Adjustment Period (every 2016 blocks)
     */
    readonly minute: number;
    /**
     * C″ - Index of Block in Halving Epoch (every 210_000 blocks)
     */
    readonly second: number;
    /**
     * D‴ - Cycle Number
     */
    readonly third: number;
    constructor(sat: Sat);
    toString(): string;
}
