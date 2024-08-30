"use client";

import { getSupportedChains } from "@/lib/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import Web3AuthConnectorInstance from "./web3-auth-connector";

const wagmiTransports = getSupportedChains().reduce(
  (prevoiusValue, chain) =>
    Object.assign(prevoiusValue, { [chain.id]: http() }),
  {}
);

export const wagmiConfig = createConfig({
  chains: [getSupportedChains()[0], ...getSupportedChains().slice(1)],
  transports: wagmiTransports,
  connectors: [Web3AuthConnectorInstance(getSupportedChains())],
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
