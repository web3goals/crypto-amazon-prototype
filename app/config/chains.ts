import { Address } from "viem";
import { Chain, optimismSepolia } from "viem/chains";

const galadrielDevnet: Chain = {
  id: 696969,
  name: "Galadriel Devnet",
  nativeCurrency: { name: "GAL", symbol: "GAL", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://devnet.galadriel.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Galadriel Devnet Explorer",
      url: "https://explorer.galadriel.com",
    },
  },
  testnet: true,
};

const rootstockTestnet: Chain = {
  id: 31,
  name: "Rootstock Testnet",
  nativeCurrency: { name: "tRBTC", symbol: "tRBTC", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        `https://rpc.testnet.rootstock.io/${process.env.NEXT_PUBLIC_ROOTSTOCK_RPC_API_KEY}`,
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Rootstock Testnet Explorer",
      url: "https://explorer.testnet.rootstock.io/",
    },
  },
  testnet: true,
};

const morphHoleskyTestnet: Chain = {
  id: 2810,
  name: "Morph Holesky Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc-quicknode-holesky.morphl2.io"],
      webSocket: ["wss://rpc-quicknode-holesky.morphl2.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Morph Holesky Testnet Explorer",
      url: "https://explorer-holesky.morphl2.io/",
    },
  },
  testnet: true,
};

const chilizSpicyTestnet: Chain = {
  id: 88882,
  name: "Chiliz Spicy Testnet",
  nativeCurrency: { name: "CHZ", symbol: "CHZ", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://spicy-rpc.chiliz.com/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Chiliz Spicy Testnet Explorer",
      url: "https://testnet.chiliscan.com/",
    },
  },
  testnet: true,
};

const hederaTestnet: Chain = {
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet.hashio.io/api"],
    },
  },
  blockExplorers: {
    default: {
      name: "Hedera Testnet Explorer",
      url: "https://hashscan.io/testnet/dashboard",
    },
  },
  testnet: true,
};

export type ChainConfig = {
  chain: Chain;
  usdt: Address;
  fanToken: Address;
  storefront: Address;
  checkout: Address;
  checkoutPaymentTokenSymbol: string; // TODO: Load this data using token contract
  checkoutPaymentTokenDecimals: number; // TODO: Load this data using token contract
  summarizer: Address;
  signProtocolApi: string;
  signProtocolSchemaId: string;
  indexerUrl: string;
};

export const chainConfigs = {
  optimismSepolia: {
    chain: optimismSepolia,
    usdt: "0x55FC13643e03284242941F043967583aB79b288F",
    fanToken: "0x0000000000000000000000000000000000000000",
    storefront: "0xf2F5F769509065DFdfe9f31E440F3f94e9F7c21b",
    checkout: "0xE008d8d7C4a0368c68a37DE2e9E0D5C323EA9978",
    checkoutPaymentTokenSymbol: "USDT",
    checkoutPaymentTokenDecimals: 18,
    summarizer: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "https://testnet-rpc.sign.global/api",
    signProtocolSchemaId: "onchain_evm_11155420_0x5",
    indexerUrl: "https://indexer.bigdevenergy.link/9634760/v1/graphql",
  } as ChainConfig,
  galadrielDevnet: {
    chain: galadrielDevnet,
    usdt: "0x0000000000000000000000000000000000000000",
    fanToken: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0x0000000000000000000000000000000000000000",
    checkoutPaymentTokenSymbol: "",
    checkoutPaymentTokenDecimals: 18,
    summarizer: "0x07b7e2AE0A9B1f74610e2465d8043e7E7a5632A6",
    signProtocolApi: "",
    signProtocolSchemaId: "",
    indexerUrl: "",
  } as ChainConfig,
  rootstockTestnet: {
    chain: rootstockTestnet,
    usdt: "0xF1843bab521395b7aE283E93A98423Dc2956bd84",
    fanToken: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0xe9F2eaF94D0F94329381037b98F6795410B8E8F8",
    checkoutPaymentTokenSymbol: "USDT",
    checkoutPaymentTokenDecimals: 18,
    summarizer: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "",
    signProtocolSchemaId: "",
    indexerUrl: "",
  } as ChainConfig,
  morphHoleskyTestnet: {
    chain: morphHoleskyTestnet,
    usdt: "0xF1843bab521395b7aE283E93A98423Dc2956bd84",
    fanToken: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0xe9F2eaF94D0F94329381037b98F6795410B8E8F8",
    checkoutPaymentTokenSymbol: "USDT",
    checkoutPaymentTokenDecimals: 18,
    summarizer: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "",
    signProtocolSchemaId: "",
    indexerUrl: "",
  } as ChainConfig,
  chilizSpicyTestnet: {
    chain: chilizSpicyTestnet,
    usdt: "0x0000000000000000000000000000000000000000",
    fanToken: "0xF1843bab521395b7aE283E93A98423Dc2956bd84",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0x12884Fb3EAEB3C0A2C6EC390954304bc37192611",
    checkoutPaymentTokenSymbol: "FANT",
    checkoutPaymentTokenDecimals: 0,
    summarizer: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "",
    signProtocolSchemaId: "",
    indexerUrl: "",
  } as ChainConfig,
  hederaTestnet: {
    chain: hederaTestnet,
    usdt: "0x1c1c64407d373bcD4faA320586e1f97a56a43AEC",
    fanToken: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0x8db9bad4D40d2b9cB038d0A9f919F48aB0ae0457",
    checkoutPaymentTokenSymbol: "USDT",
    checkoutPaymentTokenDecimals: 3,
    summarizer: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "",
    signProtocolSchemaId: "",
    indexerUrl: "",
  } as ChainConfig,
};
