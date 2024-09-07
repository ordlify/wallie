/**
 * Amount lower than this is considered as dust value
 * and majority of the miners don't pick txs w/ the following output value or lower
 */
export declare const MINIMUM_AMOUNT_IN_SATS = 600;
/**
 * Fee calculated by the fee estimator cannot be greater than 0.05 BTC in any case
 */
export declare const MAXIMUM_FEE = 5000000;
/**
 * Maximum number of bytes pushable to the witness stack
 */
export declare const MAXIMUM_SCRIPT_ELEMENT_SIZE = 520;
/**
 * Input from seller PSBT when unwrapped & merged,
 * is placed on the 2nd index in instant-buy-sell flow
 */
export declare const INSTANT_BUY_SELLER_INPUT_INDEX = 2;
/**
 * BIP32 instance
 */
export declare const BIP32: import('bip32').BIP32API;
/**
 * Fixed chain code for public key operations
 */
export declare const CHAIN_CODE: Buffer;
