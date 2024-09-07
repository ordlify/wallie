import { BitcoinProvider } from 'sats-connect';

interface MagicEdenBitcoinProvider extends BitcoinProvider {
    isMagicEden: boolean | undefined;
}
export default function walletProvider(): Promise<MagicEdenBitcoinProvider>;
export {};
