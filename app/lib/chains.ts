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

export function getChainConfigsWithCheckout(): ChainConfig[] {
  return Object.values(chainConfigs).filter(
    (chainConfig) =>
      !isAddressEqual(chainConfig.checkout, zeroAddress) &&
      chainConfig.checkoutPaymentTokenSymbol.length > 0
  );
}

export function getChainConfigById(id: string): ChainConfig | undefined {
  return Object.values(chainConfigs).find(
    (chainConfig) => chainConfig.chain.id.toString() === id
  );
}
