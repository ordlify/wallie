import type { Network } from "../config/types";
import type { Address, AddressFormat, AddressType } from "./types";
export declare function getAddressFormat(address: string, network: Network): AddressFormat;
export declare function getAddressesFromPublicKey(publicKey: string | Buffer, network?: Network, type?: Exclude<AddressType, "p2wsh"> | "all"): Address[];
export declare function getNetworkByAddress(address: string): Network;
export * from "./constants";
export * from "./types";
//# sourceMappingURL=index.d.ts.map