import { UniswapV2Factory } from "generated/src/Handlers.gen";
import { Pool } from "generated/src/Types.gen";
import { getChainConfig } from "./utils/chains";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./utils/token";
import { ADDRESS_ZERO, ONE_BI, ZERO_BD, ZERO_BI } from "./utils/constants";
import type { publicClients } from "./utils/viem";
import { Address, getFromId, getId } from "./utils";

UniswapV2Factory.PairCreated.contractRegister(({ event, context }) => {
  const subgraphConfig = getChainConfig(event.chainId);
  if (
    subgraphConfig.poolsToSkip.includes(event.params.pair) ||
    subgraphConfig.tokensToSkip.includes(event.params.token0 as Address) ||
    subgraphConfig.tokensToSkip.includes(event.params.token1 as Address)
  )
    return;

  context.addUniswapV2Pair(event.params.pair);
});

UniswapV2Factory.PairCreated.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryId = getId(event.srcAddress, event.chainId);
    const token0Id = getId(event.params.token0, event.chainId);
    const token1Id = getId(event.params.token1, event.chainId);

    let [factory, token0, token1] = await Promise.all([
      context.Factory.get(factoryId),
      context.Token.get(token0Id),
      context.Token.get(token1Id),
    ]);

    return { factoryId, factory, token0Id, token1Id, token0, token1 };
  },
  handler: async ({ event, context, loaderReturn }) => {
    let { factoryId, factory, token0Id, token0, token1Id, token1 } = loaderReturn;

    const subgraphConfig = getChainConfig(event.chainId);
    const tokenOverrides = subgraphConfig.tokenOverrides;

    if (!factory) {
      context.log.info(`Creating Factory`);

      factory = {
        id: factoryId,
        address: event.srcAddress,
        chainId: event.chainId,
        isV2: true,
        poolCount: ZERO_BI,
        totalVolumeETH: ZERO_BD,
        totalVolumeUSD: ZERO_BD,
        txCount: ZERO_BI,
        owner: ADDRESS_ZERO,
      };

      // create new bundle for tracking eth price
      context.Bundle.set({
        id: event.chainId.toString(),
        ethPriceUSD: ZERO_BD,
      });
    }

    factory = {
      ...factory,
      poolCount: factory.poolCount + ONE_BI,
    };

    const poolId = getId(event.params.pair, event.chainId);

    let pool: Pool = {
      id: poolId,
      token0_id: token0Id,
      token1_id: token1Id,
      address: event.params.pair,
      chainId: event.chainId,
      isV2: true,
      feeTier: ZERO_BI,
      createdAtTimestamp: event.block.timestamp,
      createdAtBlockNumber: event.block.number,
      liquidityProviderCount: ZERO_BI,
      txCount: ZERO_BI,
      liquidity: ZERO_BI,
      sqrtPrice: ZERO_BI,
      token0Price: ZERO_BD,
      token1Price: ZERO_BD,
      reserve0: ZERO_BD,
      reserve1: ZERO_BD,
      observationIndex: ZERO_BI,
      totalValueLockedToken0: ZERO_BD,
      totalValueLockedToken1: ZERO_BD,
      totalValueLockedUSD: ZERO_BD,
      totalValueLockedETH: ZERO_BD,
      totalValueLockedUSDUntracked: ZERO_BD,
      volumeToken0: ZERO_BD,
      volumeToken1: ZERO_BD,
      volumeUSD: ZERO_BD,
      untrackedVolumeUSD: ZERO_BD,
      tick: undefined,
    };

    if (!token0) {
      const [decimals, symbol, name] = await Promise.all([
        fetchTokenDecimals(event.params.token0, tokenOverrides, event.chainId as keyof typeof publicClients),
        fetchTokenSymbol(event.params.token0, tokenOverrides, event.chainId as keyof typeof publicClients),
        fetchTokenName(event.params.token0, tokenOverrides, event.chainId as keyof typeof publicClients),
      ]);

      if (decimals == null) {
        context.log.debug(`No Decimal for token0: ${event.params.token0}-${event.chainId}`);
        return;
      }

      token0 = {
        id: token0Id,
        address: event.params.token0,
        chainId: event.chainId,
        symbol,
        name,
        decimals,
        derivedETH: ZERO_BD,
        volume: ZERO_BD,
        volumeUSD: ZERO_BD,
        untrackedVolumeUSD: ZERO_BD,
        txCount: ZERO_BI,
        whitelistPools: [],
      };
    }

    if (!token1) {
      const [decimals, symbol, name] = await Promise.all([
        fetchTokenDecimals(event.params.token1, tokenOverrides, event.chainId as keyof typeof publicClients),
        fetchTokenSymbol(event.params.token1, tokenOverrides, event.chainId as keyof typeof publicClients),
        fetchTokenName(event.params.token1, tokenOverrides, event.chainId as keyof typeof publicClients),
      ]);

      if (decimals == null) {
        context.log.debug(`No Decimal for token1: ${event.params.token1}-${event.chainId}`);
        return;
      }

      token1 = {
        id: token1Id,
        address: event.params.token1,
        chainId: event.chainId,
        symbol,
        name,
        decimals,
        derivedETH: ZERO_BD,
        volume: ZERO_BD,
        volumeUSD: ZERO_BD,
        untrackedVolumeUSD: ZERO_BD,
        txCount: ZERO_BI,
        whitelistPools: [],
      };
    }

    // update white listed pools
    token1 = {
      ...token1,
      whitelistPools: [...token1.whitelistPools, getFromId(pool.id).address],
    };

    token0 = {
      ...token0,
      whitelistPools: [...token0.whitelistPools, getFromId(pool.id).address],
    };

    // Save all changes
    context.Pool.set(pool);
    context.Token.set(token0);
    context.Token.set(token1);
    context.Factory.set(factory);
  },
});
