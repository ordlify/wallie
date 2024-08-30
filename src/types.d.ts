type UnisatNetwork = "livenet" | "testnet";

type MessageSignatureTypes = "bip322-simple" | "ecdsa";

type Unisat = {
  addListener: (eventName: string, callback: (arg: string) => void) => void;
  removeListener: (eventName: string, callback: (arg: string) => void) => void;
  getNetwork: () => Promise<UnisatNetwork>;
  switchNetwork: (targetNetwork: UnisatNetwork) => Promise<void>;
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  getPublicKey: () => Promise<string>;
  signPsbt: (
    psbt: Psbt,
    options: BrowserWalletSignPSBTOptions
  ) => Promise<string>;
  signMessage: (
    message: string,
    type: MessageSignatureTypes
  ) => Promise<string>;
  sendBitcoin: (
    address: string,
    satoshis: number,
    options: { feeRate?: number }
  ) => Promise<string>;
  getBalance: () => Promise<{
    confirmed: number;
    total: number;
    unconfirmed: number;
  }>;
};

type LeatherJsonRPCResponse<T> = {
  id: string;
  jsonrpc: string;
  result: T;
};

type LeatherProvider = {
  request: (
    arg: string,
    params?: object | string[]
  ) => Promise<LeatherJsonRPCResponse<any>>;
};

declare interface Window {
  chrome: {
    app: {
      isInstalled: boolean;
      InstallState: {
        DISABLED: "disabled";
        INSTALLED: "installed";
        NOT_INSTALLED: "not_installed";
      };
      RunningState: {
        CANNOT_RUN: "cannot_run";
        READY_TO_RUN: "ready_to_run";
        RUNNING: "running";
      };
    };
  };
  unisat: Unisat;
  satsConnect: any;
  LeatherProvider: LeatherProvider;
  okxwallet: {
    bitcoin: OKXWalletProvider;
    bitcoinTestnet: OKXWalletProvider;
    bitcoinSignet: OKXWalletProvider;
  };
}

interface BtcKitRequestFn {
  (arg: object | string, params?: object | string[]): Promise<object>;
}

type LeatherProvider = {
  request: BtcKitRequestFn;
};

type MetaMask = {
  isMetaMask: boolean;
  request: (options: { method: string; params?: unknown }) => Promise<unknown>;
};

type OKXAccount = {
  address: string;
  publicKey: string;
};

type OKXSignInput = {
  index: number;
  address?: string;
  publicKey?: string;
  sighashTypes?: number[];
};

type OKXWalletProvider = {
  connect: () => Promise<OKXAccount>;
  signMessage: (
    message: string,
    type: MessageSignatureTypes
  ) => Promise<string>;
  signPsbt: (
    psbtHex: string,
    options: {
      autoFinalized: boolean;
      toSignInputs: OKXSignInput[];
    }
  ) => Promise<string>;
  sendBitcoin: (
    address: string,
    satoshis: number,
    options: { feeRate?: number }
  ) => Promise<string>;
};

type OKXWallet = {
  bitcoin: OKXWalletProvider;
  bitcoinTestnet: OKXWalletProvider;
  bitcoinSignet: OKXWalletProvider;
};

declare module "buffer-reverse" {
  export = (_: Buffer): Buffer => {};
}
