import { createPublicClient, http, fallback } from "viem";
import { mainnet, base } from "viem/chains";

export enum ChainId {
  BASE = 8453,
  MAINNET = 1,
}

export const publicClients = {
  1: createPublicClient({
    chain: mainnet,
    transport: fallback([http("https://eth-mainnet.g.alchemy.com/v2/IFR0JiPQYC2J9hlu-jElUyCpg9bljNNK"), http()]),
  }),
  8453: createPublicClient({
    chain: base,
    transport: fallback([http("https://base-mainnet.g.alchemy.com/v2/IFR0JiPQYC2J9hlu-jElUyCpg9bljNNK"), http()]),
  }),
};
