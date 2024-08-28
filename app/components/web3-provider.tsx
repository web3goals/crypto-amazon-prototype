"use client";

import { chainConfigs } from "@/config/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import Web3AuthConnectorInstance from "./web3-auth-connector";

export const supportedChains = Object.values(chainConfigs).map(
  (chainConfig) => chainConfig.chain
);

const wagmiTransports = supportedChains.reduce(
  (prevoiusValue, chain) =>
    Object.assign(prevoiusValue, { [chain.id]: http() }),
  {}
);

export const wagmiConfig = createConfig({
  chains: [supportedChains[0], ...supportedChains.slice(1)],
  transports: wagmiTransports,
  connectors: [Web3AuthConnectorInstance(supportedChains)],
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
