import { Psbt } from 'bitcoinjs-lib';
import { Network } from '../config/types';
import { FeeEstimator } from '../fee/FeeEstimator';
import { InputsToSign } from '../inscription/types';
import { BaseDatasource } from '../modules/BaseDatasource';
import { InputType } from './helper';
import { Output, UTXOLimited } from './types';

export interface PSBTBuilderOptions {
    address: string;
    changeAddress?: string;
    feeRate: number;
    network?: Network;
    outputs: Output[];
    publicKey: string;
    autoAdjustment?: boolean;
    instantTradeMode?: boolean;
    datasource?: BaseDatasource;
}
export type InjectableInput = {
    injectionIndex: number;
    txInput: unknown;
    sats: number;
    standardInput: InputType;
};
export interface InjectableOutput {
    injectionIndex: number;
    txOutput: unknown;
    sats: number;
    standardOutput: unknown;
}
export declare class PSBTBuilder extends FeeEstimator {
    protected address: string;
    protected changeAddress?: string;
    /**
     * Change amount in satoshis
     */
    protected changeAmount: number;
    protected datasource: BaseDatasource;
    protected injectableInputs: InjectableInput[];
    protected injectableOutputs: InjectableOutput[];
    /**
     * Input amount in satoshis
     */
    protected inputAmount: number;
    protected inputs: InputType[];
    /**
     * Output amount in satoshis
     */
    protected outputAmount: number;
    protected outputs: Output[];
    protected psbt: Psbt;
    protected publicKey: string;
    /**
     * Replace-by-fee (RBF) is a feature that allows users to replace one version of an unconfirmed transaction
     * with a different version of the transaction that pays a higher transaction fee.
     * This can be done multiple times while the transaction is unconfirmed.
     *
     * Reference: [BIP-125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki)
     */
    protected rbf: boolean;
    protected utxos: UTXOLimited[];
    protected usedUTXOs: string[];
    /**
     * Enable auto adjustment.
     *
     * When `true`, change is calculated and UTXOs will be added as required to account for network fees.
     *
     * Otherwise, change is not calculated and no UTXOs will be added.
     */
    private autoAdjustment;
    private instantTradeMode;
    private noMoreUTXOS;
    get data(): {
        fee: number;
        virtualSize: number;
        weight: number;
        changeAmount: number;
        inputAmount: number;
        outputAmount: number;
    };
    constructor({ address, changeAddress, datasource, feeRate, network, publicKey, outputs, autoAdjustment, instantTradeMode, }: PSBTBuilderOptions);
    toPSBT(): Psbt;
    toHex(): string;
    toBase64(): string;
    /**
     * Set Replace-by-fee (RBF) value
     *
     * Replace-by-fee (RBF) is a feature that allows users to replace one version of an unconfirmed transaction
     * with a different version of the transaction that pays a higher transaction fee.
     * This can be done multiple times while the transaction is unconfirmed.
     *
     * Reference: [BIP-125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki)
     */
    setRBF(value: boolean): void;
    /**
     * Gets the x-coordinate of the public key.
     */
    get xKey(): string;
    get inputsToSign(): InputsToSign;
    protected initPSBT(): void;
    protected getInputSequence(): 4294967293 | 4294967295;
    private injectInput;
    private injectOutput;
    private addInputs;
    private addOutputs;
    private calculateOutputAmount;
    /**
     * Calculates change amount from transaction and fetches additional UTXOs as required to cover output and network fees, if change is negative.
     */
    private recursivelyCalculateChangeAmount;
    private getRetrievedUTXOsValue;
    private getReservedUTXOs;
    private getUTXOAmountToRequestFromChangeAmount;
    /**
     * Retrieves UTXOs using `getSpendables` RPC.
     *
     * @param address Address
     * @param amount Amount in satoshis
     */
    private retrieveUTXOs;
    protected retrieveSelectedUTXOs(address: string, amount: number): Promise<UTXOLimited[]>;
    /**
     * Prepares inputs from UTXOs.
     */
    private prepareInputs;
    /**
     * Prepares PSBT to be set to a network, calculating and validating both inputs and outputs.
     */
    prepare(): Promise<void>;
    /**
     * Initializes PSBT instance, adding all inputs and outputs and calculates network fees.
     *
     * @returns PSBTBuilder instance
     */
    private process;
}
