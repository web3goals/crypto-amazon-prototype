import { Address } from "viem";
import { Chain, morphHolesky, optimismSepolia } from "viem/chains";

export type ChainConfig = {
  chain: Chain;
  usdt: Address;
  storefront: Address;
  checkout: Address;
  checkoutPaymentTokenSymbol: string; // TODO: Load this data using checkout contract
  signProtocolApi: string;
  signProtocolSchemaId: string;
};

export const chainConfigs = {
  optimismSepolia: {
    chain: optimismSepolia,
    usdt: "0x55FC13643e03284242941F043967583aB79b288F",
    storefront: "0x61c582d77F0C92B7831bEC1ABfe8176e11832A52",
    checkout: "0xE008d8d7C4a0368c68a37DE2e9E0D5C323EA9978",
    checkoutPaymentTokenSymbol: "USDT",
    signProtocolApi: "https://testnet-rpc.sign.global/api",
    signProtocolSchemaId: "onchain_evm_11155420_0x5",
  } as ChainConfig,
  morphHolesky: {
    chain: morphHolesky,
    usdt: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    checkout: "0x0000000000000000000000000000000000000000",
    checkoutPaymentTokenSymbol: "",
    signProtocolApi: "",
    signProtocolSchemaId: "",
  } as ChainConfig,
};
