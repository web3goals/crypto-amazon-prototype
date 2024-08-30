import { ChainConfig, chainConfigs } from "@/config/chains";
import { Chain } from "viem";

export function getSupportedChains(): Chain[] {
  return Object.values(chainConfigs).map((chainConfig) => chainConfig.chain);
}

export function getStorefrontChainConfig(): ChainConfig {
  return chainConfigs.optimismSepolia;
}
