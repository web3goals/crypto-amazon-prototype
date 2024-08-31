import { Address } from "viem";
import { Chain, morphHolesky, optimismSepolia } from "viem/chains";

export type ChainConfig = {
  chain: Chain;
  usdt: Address;
  storefront: Address;
  signProtocolApi: string;
  signProtocolSchemaId: string;
};

export const chainConfigs = {
  optimismSepolia: {
    chain: optimismSepolia,
    usdt: "0x55FC13643e03284242941F043967583aB79b288F",
    storefront: "0x61c582d77F0C92B7831bEC1ABfe8176e11832A52",
    signProtocolApi: "https://testnet-rpc.sign.global/api",
    signProtocolSchemaId: "onchain_evm_11155420_0x5",
  } as ChainConfig,
  morphHolesky: {
    chain: morphHolesky,
    usdt: "0x0000000000000000000000000000000000000000",
    storefront: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "",
    signProtocolSchemaId: "",
  } as ChainConfig,
};
