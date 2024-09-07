/**
 * 1 btc = 100_000_000 satoshis
 */
export declare const COIN_VALUE = 100000000;
/**
 * bitcoin halving happens after every 210_000 blocks
 */
export declare const SUBSIDY_HALVING_INTERVAL = 210000;
/**
 * bitcoin mining difficulty changes every 2016 blocks (~2 weeks)
 */
export declare const DIFFCHANGE_INTERVAL = 2016;
/**
 * every 6 halving, it will coincide with difficulty adjustment.
 */
export declare const CYCLE_EPOCHS = 6;
/**
 * max satoshi supply
 */
export declare const SAT_SUPPLY = 2099999997690000;
/**
 * the last satoshi number that will ever be mined
 */
export declare const LAST_SAT: number;
