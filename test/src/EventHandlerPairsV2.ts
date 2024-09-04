import { UniswapV2Pair } from "generated/src/Handlers.gen";
import { BigDecimal } from "generated";
import { ONE_BI, ZERO_BD, ZERO_BI } from "./utils/constants";
import { convertTokenToDecimal, getFactoryAddress, getFromId, getId, safeDiv } from "./utils";
import { findNativePerToken, getNativePriceInUSD, getTrackedAmountUSD } from "./utils/pricing";
import { getChainConfig } from "./utils/chains";
import {
  getDayID,
  getHourIndex,
  updatePoolDayData,
  updatePoolHourData,
  updateTokenDayData,
  updateTokenHourData,
} from "./utils/intervalUpdates";

UniswapV2Pair.Burn.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, true);

    const poolId = getId(event.srcAddress, event.chainId);
    const factoryId = getId(factoryAddress, event.chainId);

    let [bundle, pool, factory] = await Promise.all([
      context.Bundle.get(event.chainId.toString())!,
      context.Pool.get(poolId)!,
      context.Factory.get(factoryId)!,
    ]);

    let token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID = getDayID(event.block.timestamp);

    if (pool) {
      [token0, token1] = await Promise.all([context.Token.get(pool.token0_id), context.Token.get(pool.token1_id)]);
      if (token0 && token1) {
        const poolAddress = getFromId(pool.id).address;
        const token0Address = getFromId(token0.id).address;
        const token1Address = getFromId(token1.id).address;

        const dayPoolID = poolAddress.concat("-").concat(dayID.toString()).concat("-").concat(event.chainId.toString());
        const hourIndex = getHourIndex(event.block.timestamp); // get unique hour within unix history
        const hourPoolID = poolAddress
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token0DayID = token0Address
          .concat("-")
          .concat(dayID.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token1DayID = token1Address
          .concat("-")
          .concat(dayID.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token0HourID = token0Address
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token1HourID = token1Address
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());

        [poolDayData, poolHourData, token0DayData, token1DayData, token0HourData, token1HourData] = await Promise.all([
          context.PoolDayData.get(dayPoolID),
          context.PoolHourData.get(hourPoolID),
          context.TokenDayData.get(token0DayID),
          context.TokenDayData.get(token1DayID),
          context.TokenHourData.get(token0HourID),
          context.TokenHourData.get(token1HourID),
        ]);
      }
    }

    return {
      bundle,
      pool,
      factory,
      token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID,
    };
  },
  handler: async ({ event, context, loaderReturn }) => {
    let {
      bundle,
      pool,
      factory,
      token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID,
    } = loaderReturn;

    if (!bundle) {
      return context.log.warn(`Bundle not found for chain ${event.chainId}`);
    }

    if (!pool) {
      return context.log.warn(`Pool not found for chain ${event.chainId}: ${event.srcAddress}`);
    }

    if (!factory) {
      return context.log.warn(`Factory not found for chain ${event.chainId}`);
    }

    if (token0 && token1) {
      // update globals
      factory = {
        ...factory,
        txCount: factory.txCount + ONE_BI,
      };

      token0 = {
        ...token0,
        txCount: token0.txCount + ONE_BI,
      };

      token1 = {
        ...token1,
        txCount: token1.txCount + ONE_BI,
      };

      pool = {
        ...pool,
        txCount: pool.txCount + ONE_BI,
      };

      updatePoolDayData(dayID, pool, poolDayData, event.chainId, context);
      updatePoolHourData(event.block.timestamp, pool, poolHourData, event.chainId, context);
      updateTokenDayData(token0, bundle, dayID, token0DayData, event.chainId, context);
      updateTokenDayData(token1, bundle, dayID, token1DayData, event.chainId, context);
      updateTokenHourData(token0, bundle, event.block.timestamp, token0HourData, event.chainId, context);
      updateTokenHourData(token1, bundle, event.block.timestamp, token1HourData, event.chainId, context);

      context.Token.set(token0);
      context.Token.set(token1);
      context.Pool.set(pool);
      context.Factory.set(factory);
    }
  },
});

UniswapV2Pair.Mint.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, true);

    const poolId = getId(event.srcAddress, event.chainId);
    const factoryId = getId(factoryAddress, event.chainId);

    let [bundle, pool, factory] = await Promise.all([
      context.Bundle.get(event.chainId.toString())!,
      context.Pool.get(poolId)!,
      context.Factory.get(factoryId)!,
    ]);

    let token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID = getDayID(event.block.timestamp);

    if (pool) {
      [token0, token1] = await Promise.all([context.Token.get(pool.token0_id), context.Token.get(pool.token1_id)]);
      if (token0 && token1) {
        const poolAddress = getFromId(pool.id).address;
        const token0Address = getFromId(token0.id).address;
        const token1Address = getFromId(token1.id).address;

        const dayPoolID = poolAddress.concat("-").concat(dayID.toString()).concat("-").concat(event.chainId.toString());
        const hourIndex = getHourIndex(event.block.timestamp); // get unique hour within unix history
        const hourPoolID = poolAddress
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token0DayID = token0Address
          .concat("-")
          .concat(dayID.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token1DayID = token1Address
          .concat("-")
          .concat(dayID.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token0HourID = token0Address
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token1HourID = token1Address
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());

        [poolDayData, poolHourData, token0DayData, token1DayData, token0HourData, token1HourData] = await Promise.all([
          context.PoolDayData.get(dayPoolID),
          context.PoolHourData.get(hourPoolID),
          context.TokenDayData.get(token0DayID),
          context.TokenDayData.get(token1DayID),
          context.TokenHourData.get(token0HourID),
          context.TokenHourData.get(token1HourID),
        ]);
      }
    }

    return {
      bundle,
      pool,
      factory,
      token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID,
    };
  },
  handler: async ({ event, context, loaderReturn }) => {
    let {
      bundle,
      pool,
      factory,
      token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID,
    } = loaderReturn;

    if (!bundle) {
      return context.log.warn(`Bundle not found for chain ${event.chainId}`);
    }

    if (!pool) {
      return context.log.warn(`Pool not found for chain ${event.chainId}: ${event.srcAddress}`);
    }

    if (!factory) {
      return context.log.warn(`Factory not found for chain ${event.chainId}`);
    }

    if (token0 && token1) {
      const amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals);
      const amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals);

      token0 = {
        ...token0,
        txCount: token0.txCount + ONE_BI,
      };

      token1 = {
        ...token1,
        txCount: token1.txCount + ONE_BI,
      };

      const totalValueLockedETH = pool.totalValueLockedToken0
        .times(token0.derivedETH)
        .plus(pool.totalValueLockedToken1.times(token1.derivedETH));

      pool = {
        ...pool,
        txCount: pool.txCount + ONE_BI,
        totalValueLockedToken0: pool.totalValueLockedToken0.plus(amount0),
        totalValueLockedToken1: pool.totalValueLockedToken1.plus(amount1),
        totalValueLockedETH: totalValueLockedETH,
        totalValueLockedUSD: totalValueLockedETH.times(bundle.ethPriceUSD),
      };

      updatePoolDayData(dayID, pool, poolDayData, event.chainId, context);
      updatePoolHourData(event.block.timestamp, pool, poolHourData, event.chainId, context);
      updateTokenDayData(token0, bundle, dayID, token0DayData, event.chainId, context);
      updateTokenDayData(token1, bundle, dayID, token1DayData, event.chainId, context);
      updateTokenHourData(token0, bundle, event.block.timestamp, token0HourData, event.chainId, context);
      updateTokenHourData(token1, bundle, event.block.timestamp, token1HourData, event.chainId, context);

      context.Token.set(token0);
      context.Token.set(token1);
      context.Pool.set(pool);
      context.Factory.set(factory);
    }
  },
});

UniswapV2Pair.Sync.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, true);
    const poolId = getId(event.srcAddress, event.chainId);
    const factoryId = getId(factoryAddress, event.chainId);

    let [bundle, pool, factory] = await Promise.all([
      context.Bundle.get(event.chainId.toString())!,
      context.Pool.get(poolId),
      context.Factory.get(factoryId)!,
    ]);
    let token0, token1;
    if (pool) {
      [token0, token1] = await Promise.all([context.Token.get(pool.token0_id), context.Token.get(pool.token1_id)]);
    }

    if (bundle) {
      const subgraphConfig = getChainConfig(event.chainId);
      const stablecoinWrappedNativePoolAddress = subgraphConfig.stablecoinWrappedNativePoolAddress;

      const stablecoinWrappedNativePoolId = getId(stablecoinWrappedNativePoolAddress, event.chainId);
      let stablecoinWrappedNativePool = await context.Pool.get(stablecoinWrappedNativePoolId);
      const stablecoinIsToken0 = subgraphConfig.stablecoinIsToken0;

      bundle = {
        ...bundle,
        ethPriceUSD: getNativePriceInUSD(stablecoinIsToken0, stablecoinWrappedNativePool),
      };
    }

    return { bundle, pool, factory, token0, token1 };
  },
  handler: async ({ event, context, loaderReturn }) => {
    let { bundle, pool, factory, token0, token1 } = loaderReturn;

    if (!bundle) {
      return context.log.warn(`Bundle not found for chain ${event.chainId}`);
    }

    if (!pool) {
      return context.log.warn(`Pool not found for chain ${event.chainId}: ${event.srcAddress}`);
    }

    if (!factory) {
      return context.log.warn(`Factory not found for chain ${event.chainId}`);
    }

    if (token0 && token1) {
      const reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals);
      const reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals);

      let token0Price = pool.token0Price;
      let token1Price = pool.token1Price;
      if (!reserve0.eq(ZERO_BD)) {
        token0Price = BigDecimal(pool.reserve1.toString()).div(pool.reserve0.toString());
      }
      if (!reserve1.eq(ZERO_BD)) {
        token1Price = BigDecimal(pool.reserve0.toString()).div(pool.reserve1.toString());
      }

      pool = {
        ...pool,
        txCount: pool.txCount + ONE_BI,
        reserve0: reserve0,
        reserve1: reserve1,
        sqrtPrice: ZERO_BI,
        token0Price: token0Price,
        token1Price: token1Price,
      };

      context.Bundle.set(bundle);
      context.Pool.set(pool);
    }
  },
});

UniswapV2Pair.Swap.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, true);
    const poolId = getId(event.srcAddress, event.chainId);
    const factoryId = getId(factoryAddress, event.chainId);

    let [bundle, pool, factory] = await Promise.all([
      context.Bundle.get(event.chainId.toString())!,
      context.Pool.get(poolId),
      context.Factory.get(factoryId)!,
    ]);

    let token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID = getDayID(event.block.timestamp),
      token0DerivedEth,
      token1DerivedEth;

    if (pool) {
      [token0, token1] = await Promise.all([context.Token.get(pool.token0_id), context.Token.get(pool.token1_id)]);
      if (token0 && token1) {
        const poolAddress = getFromId(pool.id).address;
        const token0Address = getFromId(token0.id).address;
        const token1Address = getFromId(token1.id).address;

        const dayPoolID = poolAddress.concat("-").concat(dayID.toString()).concat("-").concat(event.chainId.toString());
        const hourIndex = getHourIndex(event.block.timestamp); // get unique hour within unix history
        const hourPoolID = poolAddress
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token0DayID = token0Address
          .concat("-")
          .concat(dayID.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token1DayID = token1Address
          .concat("-")
          .concat(dayID.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token0HourID = token0Address
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());
        const token1HourID = token1Address
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());

        [poolDayData, poolHourData, token0DayData, token1DayData, token0HourData, token1HourData] = await Promise.all([
          context.PoolDayData.get(dayPoolID),
          context.PoolHourData.get(hourPoolID),
          context.TokenDayData.get(token0DayID),
          context.TokenDayData.get(token1DayID),
          context.TokenHourData.get(token0HourID),
          context.TokenHourData.get(token1HourID),
        ]);

        if (bundle) {
          const subgraphConfig = getChainConfig(event.chainId);
          const stablecoinWrappedNativePoolAddress = subgraphConfig.stablecoinWrappedNativePoolAddress;

          const wrappedNativeAddress = subgraphConfig.wrappedNativeAddress;
          const stablecoinAddresses = subgraphConfig.stablecoinAddresses;
          const minimumNativeLocked = subgraphConfig.minimumNativeLocked;

          const stablecoinWrappedNativePoolId = getId(stablecoinWrappedNativePoolAddress, event.chainId);
          let stablecoinWrappedNativePool = await context.Pool.get(stablecoinWrappedNativePoolId);
          const stablecoinIsToken0 = subgraphConfig.stablecoinIsToken0;

          bundle = {
            ...bundle,
            ethPriceUSD: getNativePriceInUSD(stablecoinIsToken0, stablecoinWrappedNativePool),
          };

          [token0DerivedEth, token1DerivedEth] = await Promise.all([
            findNativePerToken(
              token0,
              wrappedNativeAddress,
              stablecoinAddresses,
              minimumNativeLocked,
              bundle,
              event.chainId,
              context
            ),
            findNativePerToken(
              token1,
              wrappedNativeAddress,
              stablecoinAddresses,
              minimumNativeLocked,
              bundle,
              event.chainId,
              context
            ),
          ]);
        }
      }
    }

    return {
      bundle,
      pool,
      factory,
      token0,
      token1,
      poolDayData,
      poolHourData,
      token0DayData,
      token1DayData,
      token0HourData,
      token1HourData,
      dayID,
      token0DerivedEth,
      token1DerivedEth,
    };
  },
  handler: async ({ event, context, loaderReturn }) => {
    let {
      bundle,
      pool,
      factory,
      token0,
      token1,
      poolDayData: _poolDayData,
      poolHourData: _poolHourData,
      token0DayData: _token0DayData,
      token1DayData: _token1DayData,
      token0HourData: _token0HourData,
      token1HourData: _token1HourData,
      dayID,
      token0DerivedEth,
      token1DerivedEth,
    } = loaderReturn;
    const subgraphConfig = getChainConfig(event.chainId);
    const whitelistTokens = subgraphConfig.whitelistTokens;

    if (!bundle) {
      return context.log.warn(`Bundle not found for chain ${event.chainId}`);
    }

    if (!factory) {
      return context.log.warn(`Factory not found for chain ${event.chainId}`);
    }

    if (!pool) {
      return context.log.warn(`Pool not found for chain ${event.chainId}: ${event.srcAddress}`);
    }

    // hot fix for bad pricing (LUSD/WETH)
    if (pool.id == "0x9663f2ca0454accad3e094448ea6f77443880454".concat("-").concat(event.chainId.toString())) return;

    if (token0 && token1) {
      const amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals);
      const amount1In = convertTokenToDecimal(event.params.amount1In, token1.decimals);
      const amount0Out = convertTokenToDecimal(event.params.amount0Out, token0.decimals);
      const amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals);

      const amount0Total = amount0Out.plus(amount0In);
      const amount1Total = amount1Out.plus(amount1In);

      const amount0ETH = amount0Total.times(token0.derivedETH);
      const amount1ETH = amount1Total.times(token1.derivedETH);
      const amount0USD = amount0ETH.times(bundle.ethPriceUSD);
      const amount1USD = amount1ETH.times(bundle.ethPriceUSD);

      // get amount that should be tracked only - div 2 because cant count both input and output as volume
      const amountTotalUSDTracked = getTrackedAmountUSD(
        amount0Total,
        token0,
        amount1Total,
        token1,
        whitelistTokens,
        bundle
      ).div(BigDecimal("2"));
      const amountTotalETHTracked = safeDiv(amountTotalUSDTracked, bundle.ethPriceUSD);
      const amountTotalUSDUntracked = amount0USD.plus(amount1USD).div(BigDecimal("2"));

      factory = {
        ...factory,
        txCount: factory.txCount + ONE_BI,
        totalVolumeETH: factory.totalVolumeETH.plus(amountTotalETHTracked),
        totalVolumeUSD: factory.totalVolumeUSD.plus(amountTotalUSDTracked),
      };

      let token0Price = pool.token0Price;
      let token1Price = pool.token1Price;
      if (!amount0Total.eq(ZERO_BD)) {
        token0Price = amount1Total.div(amount0Total);
      }
      if (!amount1Total.eq(ZERO_BD)) {
        token1Price = amount0Total.div(amount1Total);
      }

      pool = {
        ...pool,
        txCount: pool.txCount + ONE_BI,
        volumeToken0: pool.volumeToken0.plus(amount0ETH),
        volumeToken1: pool.volumeToken1.plus(amount1ETH),
        volumeUSD: pool.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: pool.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
        tick: undefined,
        sqrtPrice: ZERO_BI,
        token0Price,
        token1Price,
        totalValueLockedToken0: pool.totalValueLockedToken0.plus(amount0Total),
        totalValueLockedToken1: pool.totalValueLockedToken1.plus(amount1Total),
      };

      token0 = {
        ...token0,
        volume: token0.volume.plus(amount0Total),
        volumeUSD: token0.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token0.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
        txCount: token0.txCount + ONE_BI,
      };

      token1 = {
        ...token1,
        volume: token1.volume.plus(amount1Total),
        volumeUSD: token1.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token1.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
        txCount: token1.txCount + ONE_BI,
      };

      if (token0DerivedEth && token1DerivedEth) {
        token0 = {
          ...token0,
          derivedETH: token0DerivedEth,
        };

        token1 = {
          ...token1,
          derivedETH: token1DerivedEth,
        };
      }

      const totalValueLockedETH = pool.totalValueLockedToken0
        .times(token0.derivedETH)
        .plus(pool.totalValueLockedToken1.times(token1.derivedETH));

      pool = {
        ...pool,
        totalValueLockedETH: totalValueLockedETH,
        totalValueLockedUSD: totalValueLockedETH.times(bundle.ethPriceUSD),
      };

      let poolDayData = updatePoolDayData(dayID, pool, _poolDayData, event.chainId, context);
      let poolHourData = updatePoolHourData(event.block.timestamp, pool, _poolHourData, event.chainId, context);
      let token0DayData = updateTokenDayData(token0, bundle, dayID, _token0DayData, event.chainId, context);
      let token1DayData = updateTokenDayData(token1, bundle, dayID, _token1DayData, event.chainId, context);
      let token0HourData = updateTokenHourData(
        token0,
        bundle,
        event.block.timestamp,
        _token0HourData,
        event.chainId,
        context
      );
      let token1HourData = updateTokenHourData(
        token1,
        bundle,
        event.block.timestamp,
        _token1HourData,
        event.chainId,
        context
      );

      poolDayData = {
        ...poolDayData,
        volumeUSD: poolDayData.volumeUSD.plus(amountTotalUSDTracked),
        volumeToken0: poolDayData.volumeToken0.plus(amount0Total),
        volumeToken1: poolDayData.volumeToken1.plus(amount1Total),
      };

      poolHourData = {
        ...poolHourData,
        volumeUSD: poolHourData.volumeUSD.plus(amountTotalUSDTracked),
        volumeToken0: poolHourData.volumeToken0.plus(amount0Total),
        volumeToken1: poolHourData.volumeToken1.plus(amount1Total),
      };

      token0DayData = {
        ...token0DayData,
        volume: token0DayData.volume.plus(amount0Total),
        volumeUSD: token0DayData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token0DayData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      token0HourData = {
        ...token0HourData,
        volume: token0HourData.volume.plus(amount0Total),
        volumeUSD: token0HourData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token0HourData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      token1DayData = {
        ...token1DayData,
        volume: token1DayData.volume.plus(amount1Total),
        volumeUSD: token1DayData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token1DayData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      token1HourData = {
        ...token1HourData,
        volume: token1HourData.volume.plus(amount1Total),
        volumeUSD: token1HourData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token1HourData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      context.Bundle.set(bundle);
      context.TokenDayData.set(token0DayData);
      context.TokenDayData.set(token1DayData);
      context.PoolDayData.set(poolDayData);
      context.PoolHourData.set(poolHourData);
      context.TokenHourData.set(token0HourData);
      context.TokenHourData.set(token1HourData);
      context.PoolHourData.set(poolHourData);
      context.Factory.set(factory);
      context.Pool.set(pool);
      context.Token.set(token0);
      context.Token.set(token1);
    }
  },
});
