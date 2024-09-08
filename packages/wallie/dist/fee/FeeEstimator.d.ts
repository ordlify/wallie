import { Psbt } from "bitcoinjs-lib";
import type { Network } from "../config/types";
import type { FeeEstimatorOptions } from "./types";
declare class FeeEstimator {
    /**
     * Fee in satoshis
     */
    protected fee: number;
    /**
     * Fee rate in satoshis
     */
    protected feeRate: number;
    protected network: Network;
    protected psbt: Psbt;
    protected witness?: Buffer[];
    protected virtualSize: number;
    protected weight: number;
    constructor({ feeRate, network, psbt, witness }: FeeEstimatorOptions);
    get data(): {
        fee: number;
        virtualSize: number;
        weight: number;
    };
    /**
     * Calculates network fee based on virtual size of transaction and fee rate.
     *
     * @returns Estimated network fee
     * @throws {OrditSDKError} Fee is above MAXIMUM_FEE (5,000,000 satoshis)
     */
    calculateNetworkFee(): number;
    private getInputAndOutputScriptTypes;
    private calculateScriptWitnessSize;
    private getBaseSize;
    private calculateVirtualSize;
}
export { FeeEstimator };
