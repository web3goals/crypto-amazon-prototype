import { Address } from "viem";
import { Chain, morphHolesky, optimismSepolia } from "viem/chains";

export type ChainConfig = {
  chain: Chain;
  storefront: Address;
  signProtocolApi: string;
  signProtocolSchemaId: string;
};

export const chainConfigs = {
  optimismSepolia: {
    chain: optimismSepolia,
    storefront: "0x61c582d77F0C92B7831bEC1ABfe8176e11832A52",
    signProtocolApi: "https://testnet-rpc.sign.global/api",
    signProtocolSchemaId: "onchain_evm_11155420_0x5",
  } as ChainConfig,
  morphHolesky: {
    chain: morphHolesky,
    storefront: "0x0000000000000000000000000000000000000000",
    signProtocolApi: "",
    signProtocolSchemaId: "",
  } as ChainConfig,
};
