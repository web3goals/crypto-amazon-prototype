import { Address } from "viem";
import { Chain, morphHolesky, optimismSepolia } from "viem/chains";

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

export type ChainConfig = {
  chain: Chain;
  usdt: Address;
  storefront: Address;
  checkout: Address;
  checkoutPaymentTokenSymbol: string; // TODO: Load this data using checkout contract
  summarizer: Address;
  signProtocolApi: string;
  signProtocolSchemaId: string;
  indexerUrl: string;
};

export const chainConfigs = {
  optimismSepolia: {
    chain: optimismSepolia,
    usdt: "0x55FC13643e03284242941F043967583aB79b288F",
    storefront: "0xf2F5F769509065DFdfe9f31E440F3f94e9F7c21b",
    checkout: "0xE008d8d7C4a0368c68a37DE2e9E0D5C323EA9978",
    checkoutPaymentTokenSymbol: "USDT",
    summarizer: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "https://testnet-rpc.sign.global/api",
    signProtocolSchemaId: "onchain_evm_11155420_0x5",
    indexerUrl: "", // TODO: Replace link for release
  } as ChainConfig,
  morphHolesky: {
    chain: morphHolesky,
    usdt: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0x0000000000000000000000000000000000000000",
    checkoutPaymentTokenSymbol: "",
    summarizer: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "",
    signProtocolSchemaId: "",
    indexerUrl: "",
  } as ChainConfig,
  galadrielDevnet: {
    chain: galadrielDevnet,
    usdt: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0x0000000000000000000000000000000000000000",
    checkoutPaymentTokenSymbol: "",
    summarizer: "0x07b7e2AE0A9B1f74610e2465d8043e7E7a5632A6",
    signProtocolApi: "",
    signProtocolSchemaId: "",
    indexerUrl: "",
  } as ChainConfig,
};
