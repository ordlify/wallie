import { AddressFormat } from '@ordzaar/ordit-sdk';
import { Network, Wallet } from '../providers/WallieProvider';

interface SignMessageParams {
    message: string;
    wallet: Wallet;
    address: string;
    network: Network;
    format: AddressFormat;
}
/**
 * Sign message
 *
 * @param options Options
 * @returns base64 signature
 */
export default function signMessage({ message, wallet, address, network, format, }: SignMessageParams): Promise<string | null>;
export {};
