import { ChainConfig, chainConfigs } from "@/config/chains";
import { Chain, isAddressEqual, zeroAddress } from "viem";

export function getSupportedChains(): Chain[] {
  return Object.values(chainConfigs).map((chainConfig) => chainConfig.chain);
}

export function getStorefrontChainConfig(): ChainConfig {
  return chainConfigs.optimismSepolia;
}

export function getChainConfigsWithUsdt(): ChainConfig[] {
  return Object.values(chainConfigs).filter(
    (chainConfig) => !isAddressEqual(chainConfig.usdt, zeroAddress)
  );
}
