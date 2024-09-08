import { Psbt } from "bitcoinjs-lib";
import { BrowserWalletNetwork } from "../../config/types";
import type { BrowserWalletSignResponse, WalletAddress } from "../types";
import { LeatherSignMessageOptions, LeatherSignPSBTOptions } from "./types";
declare function isInstalled(): boolean;
declare function getAddresses(network?: BrowserWalletNetwork): Promise<WalletAddress[]>;
declare function signMessage(message: string, { network, paymentType }: LeatherSignMessageOptions): Promise<BrowserWalletSignResponse>;
declare function signPsbt(psbt: Psbt, { finalize, extractTx, allowedSighash, accountNumber, network, signAtIndexes, }?: LeatherSignPSBTOptions): Promise<BrowserWalletSignResponse>;
export { getAddresses, isInstalled, signMessage, signPsbt };
export * from "./types";
//# sourceMappingURL=index.d.ts.map