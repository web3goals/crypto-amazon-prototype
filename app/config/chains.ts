import { Address } from "viem";
import { Chain, morphHolesky, optimismSepolia } from "viem/chains";

export type ChainConfig = {
  chain: Chain;
  storefront: Address;
};

export const chainConfigs = {
  optimismSepolia: {
    chain: optimismSepolia,
    storefront: "0x0000000000000000000000000000000000000000",
  } as ChainConfig,
  morphHolesky: {
    chain: morphHolesky,
    storefront: "0x0000000000000000000000000000000000000000",
  } as ChainConfig,
};
