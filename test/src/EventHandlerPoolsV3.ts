import { UniswapV3Pool } from "generated/src/Handlers.gen";
import { BigDecimal } from "generated";
import { ONE_BI, ZERO_BD } from "./utils/constants";
import { convertTokenToDecimal, getFactoryAddress, getFromId, getId, safeDiv } from "./utils";
import {
  findNativePerToken,
  getNativePriceInUSD,
  getTrackedAmountUSD,
  sqrtPriceX96ToTokenPrices,
} from "./utils/pricing";
import { getChainConfig } from "./utils/chains";
import {
  getDayID,
  getHourIndex,
  updatePoolDayData,
  updatePoolHourData,
  updateTokenDayData,
  updateTokenHourData,
} from "./utils/intervalUpdates";
import { createTick } from "./utils/tick";

UniswapV3Pool.Burn.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, false);

    const lowerTickId = event.srcAddress + "#" + event.params.tickLower.toString() + "-" + event.chainId.toString();
    const upperTickId = event.srcAddress + "#" + event.params.tickUpper.toString() + "-" + event.chainId.toString();

    const poolId = getId(event.srcAddress, event.chainId);
    const factoryId = getId(factoryAddress, event.chainId);

    let [bundle, pool, factory, lowerTick, upperTick] = await Promise.all([
      context.Bundle.get(event.chainId.toString())!,
      context.Pool.get(poolId)!,
      context.Factory.get(factoryId)!,
      context.Tick.get(lowerTickId),
      context.Tick.get(upperTickId),
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
      lowerTick,
      upperTick,
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
      lowerTick,
      upperTick,
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

      // Pools liquidity tracks the currently active liquidity given pools current tick.
      // We only want to update it on burn if the position being burnt includes the current tick.
      if (pool.tick && event.params.tickLower <= pool.tick && event.params.tickUpper > pool.tick) {
        pool = {
          ...pool,
          liquidity: pool.liquidity - event.params.amount,
        };
      }

      if (lowerTick && upperTick) {
        const amount = event.params.amount;

        lowerTick = {
          ...lowerTick,
          liquidityGross: lowerTick.liquidityGross - amount,
          liquidityNet: lowerTick.liquidityNet - amount,
        };

        upperTick = {
          ...upperTick,
          liquidityGross: upperTick.liquidityGross - amount,
          liquidityNet: upperTick.liquidityNet + amount,
        };

        context.Tick.set(lowerTick);
        context.Tick.set(upperTick);
      }

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

UniswapV3Pool.Collect.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, false);
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
      return;
    }

    if (!factory) {
      return context.log.warn(`Factory not found for chain ${event.chainId}`);
    }

    if (!token0 || !token1) return;

    // Get formatted amounts collected.
    const collectedAmountToken0 = convertTokenToDecimal(event.params.amount0, token0.decimals);
    const collectedAmountToken1 = convertTokenToDecimal(event.params.amount1, token1.decimals);

    // Reset tvl aggregates until new amounts calculated
    factory = {
      ...factory,
      txCount: factory.txCount + ONE_BI,
    };

    // update token data
    token0 = {
      ...token0,
      txCount: token0.txCount + ONE_BI,
    };

    const totalValueLockedToken0 = pool.totalValueLockedToken0.minus(collectedAmountToken0);
    const totalValueLockedToken1 = pool.totalValueLockedToken1.minus(collectedAmountToken1);
    const totalValueLockedETH = totalValueLockedToken0
      .times(token0.derivedETH)
      .plus(totalValueLockedToken1.times(token1.derivedETH));

    pool = {
      ...pool,
      txCount: pool.txCount + ONE_BI,
      totalValueLockedToken0,
      totalValueLockedToken1,
      totalValueLockedETH,
      totalValueLockedUSD: totalValueLockedETH.times(bundle.ethPriceUSD),
    };

    // Update Interval Data
    updatePoolDayData(dayID, pool, poolDayData, event.chainId, context);
    updatePoolHourData(event.block.timestamp, pool, poolHourData, event.chainId, context);
    updateTokenDayData(token0, bundle, dayID, token0DayData, event.chainId, context);
    updateTokenDayData(token1, bundle, dayID, token1DayData, event.chainId, context);
    updateTokenHourData(token0, bundle, event.block.timestamp, token0HourData, event.chainId, context);
    updateTokenHourData(token1, bundle, event.block.timestamp, token1HourData, event.chainId, context);

    context.Token.set(token0);
    context.Token.set(token1);
    context.Factory.set(factory);
    context.Pool.set(pool);
  },
});

UniswapV3Pool.Initialize.handlerWithLoader({
  loader: async ({ event, context }) => {
    const subgraphConfig = getChainConfig(event.chainId);

    const stablecoinWrappedNativePoolAddress = subgraphConfig.stablecoinWrappedNativePoolAddress;
    const poolId = getId(event.srcAddress, event.chainId);
    const stablecoinWrappedNativePoolId = getId(stablecoinWrappedNativePoolAddress, event.chainId);

    let [bundle, pool, stablecoinWrappedNativePool] = await Promise.all([
      context.Bundle.get(event.chainId.toString())!,
      context.Pool.get(poolId)!,
      context.Pool.get(stablecoinWrappedNativePoolId),
    ]);

    let token0,
      token1,
      poolDayData,
      poolHourData,
      dayID = getDayID(event.block.timestamp),
      token0DerivedEth,
      token1DerivedEth;

    if (pool) {
      [token0, token1] = await Promise.all([context.Token.get(pool.token0_id), context.Token.get(pool.token1_id)]);
      if (token0 && token1) {
        const wrappedNativeAddress = subgraphConfig.wrappedNativeAddress;
        const stablecoinAddresses = subgraphConfig.stablecoinAddresses;
        const minimumNativeLocked = subgraphConfig.minimumNativeLocked;

        const poolAddress = getFromId(pool.id).address;

        const dayPoolID = poolAddress.concat("-").concat(dayID.toString()).concat("-").concat(event.chainId.toString());
        const hourIndex = getHourIndex(event.block.timestamp); // get unique hour within unix history
        const hourPoolID = poolAddress
          .concat("-")
          .concat(hourIndex.toString())
          .concat("-")
          .concat(event.chainId.toString());

        [poolDayData, poolHourData] = await Promise.all([
          context.PoolDayData.get(dayPoolID),
          context.PoolHourData.get(hourPoolID),
        ]);

        if (bundle) {
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
      subgraphConfig,
      bundle,
      pool,
      stablecoinWrappedNativePool,
      token0,
      token1,
      poolDayData,
      poolHourData,
      dayID,
      token0DerivedEth,
      token1DerivedEth,
    };
  },
  handler: async ({ event, context, loaderReturn }) => {
    let { bundle, pool, token0, token1, poolDayData, poolHourData, dayID, token0DerivedEth, token1DerivedEth } =
      loaderReturn;

    if (!pool) {
      return context.log.warn(`Pool not found for chain ${event.chainId}: ${event.srcAddress}`);
    }

    pool = {
      ...pool,
      sqrtPrice: event.params.sqrtPriceX96,
      tick: event.params.tick,
    };

    context.Pool.set(pool);

    if (!bundle) {
      return context.log.warn(`Bundle not found for chain ${event.chainId}`);
    }

    // Update Interval Data
    updatePoolDayData(dayID, pool, poolDayData, event.chainId, context);
    updatePoolHourData(event.block.timestamp, pool, poolHourData, event.chainId, context);

    // update token prices
    if (token0 && token1 && token0DerivedEth && token1DerivedEth) {
      token0 = {
        ...token0,
        derivedETH: token0DerivedEth,
      };

      token1 = {
        ...token1,
        derivedETH: token1DerivedEth,
      };

      context.Bundle.set(bundle);
      context.Token.set(token0);
      context.Token.set(token1);
    }
  },
});

UniswapV3Pool.Mint.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, false);

    const lowerTickId = event.srcAddress + "#" + event.params.tickLower.toString() + "-" + event.chainId.toString();
    const upperTickId = event.srcAddress + "#" + event.params.tickUpper.toString() + "-" + event.chainId.toString();

    const poolId = getId(event.srcAddress, event.chainId);
    const factoryId = getId(factoryAddress, event.chainId);

    let [bundle, pool, factory, lowerTick, upperTick] = await Promise.all([
      context.Bundle.get(event.chainId.toString())!,
      context.Pool.get(poolId)!,
      context.Factory.get(factoryId)!,
      context.Tick.get(lowerTickId),
      context.Tick.get(upperTickId),
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
      lowerTickId,
      lowerTick,
      upperTickId,
      upperTick,
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
      lowerTickId,
      lowerTick,
      upperTickId,
      upperTick,
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

      // reset tvl aggregates until new amounts calculated
      factory = {
        ...factory,
        txCount: factory.txCount + ONE_BI,
      };

      token0 = {
        ...token0,
        txCount: token0.txCount + ONE_BI,
      };

      // Pools liquidity tracks the currently active liquidity given pools current tick.
      // We only want to update it on mint if the new position includes the current tick.
      if (pool.tick && event.params.tickLower <= pool.tick && event.params.tickUpper > pool.tick) {
        pool = {
          ...pool,
          liquidity: pool.liquidity + event.params.amount,
        };
      }

      const totalValueLockedToken0 = pool.totalValueLockedToken0.plus(amount0);
      const totalValueLockedToken1 = pool.totalValueLockedToken1.plus(amount1);
      const totalValueLockedETH = totalValueLockedToken0
        .times(token0.derivedETH)
        .plus(totalValueLockedToken1.times(token1.derivedETH));

      pool = {
        ...pool,
        txCount: pool.txCount + ONE_BI,
        totalValueLockedToken0,
        totalValueLockedToken1,
        totalValueLockedETH,
        totalValueLockedUSD: totalValueLockedETH.times(bundle.ethPriceUSD),
      };

      // tick entities
      const lowerTickIdx = event.params.tickLower;
      const upperTickIdx = event.params.tickUpper;

      if (!lowerTick) {
        lowerTick = createTick(
          lowerTickId,
          lowerTickIdx,
          pool.id,
          event.block.timestamp,
          event.block.number,
          event.chainId
        );
      }

      if (!upperTick) {
        upperTick = createTick(
          upperTickId,
          upperTickIdx,
          pool.id,
          event.block.timestamp,
          event.block.number,
          event.chainId
        );
      }

      const amount = event.params.amount;
      if (lowerTick && upperTick) {
        lowerTick = {
          ...lowerTick,
          liquidityGross: lowerTick.liquidityGross + amount,
          liquidityNet: lowerTick.liquidityNet + amount,
        };

        upperTick = {
          ...upperTick,
          liquidityGross: upperTick.liquidityGross + amount,
          liquidityNet: upperTick.liquidityNet - amount,
        };

        context.Tick.set(lowerTick);
        context.Tick.set(upperTick);
      }

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

UniswapV3Pool.Swap.handlerWithLoader({
  loader: async ({ event, context }) => {
    const factoryAddress = getFactoryAddress(event.chainId, false);
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
          const stablecoinWrappedNativePoolId = getId(stablecoinWrappedNativePoolAddress, event.chainId);

          let stablecoinWrappedNativePool = await context.Pool.get(stablecoinWrappedNativePoolId);
          const wrappedNativeAddress = subgraphConfig.wrappedNativeAddress;
          const stablecoinAddresses = subgraphConfig.stablecoinAddresses;
          const minimumNativeLocked = subgraphConfig.minimumNativeLocked;
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
      // amounts - 0/1 are token deltas: can be positive or negative
      const amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals);
      const amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals);

      // need absolute amounts for volume
      let amount0Abs = amount0;
      if (amount0.lt(ZERO_BD)) {
        amount0Abs = amount0.times(BigDecimal("-1"));
      }
      let amount1Abs = amount1;
      if (amount1.lt(ZERO_BD)) {
        amount1Abs = amount1.times(BigDecimal("-1"));
      }

      const amount0ETH = amount0Abs.times(token0.derivedETH);
      const amount1ETH = amount1Abs.times(token1.derivedETH);
      const amount0USD = amount0ETH.times(bundle.ethPriceUSD);
      const amount1USD = amount1ETH.times(bundle.ethPriceUSD);

      // get amount that should be tracked only - div 2 because cant count both input and output as volume
      const amountTotalUSDTracked = getTrackedAmountUSD(
        amount0Abs,
        token0,
        amount1Abs,
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

      pool = {
        ...pool,
        txCount: pool.txCount + ONE_BI,
        volumeToken0: pool.volumeToken0.plus(amount0Abs),
        volumeToken1: pool.volumeToken1.plus(amount1Abs),
        volumeUSD: pool.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: pool.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
        liquidity: event.params.liquidity,
        tick: event.params.tick,
        sqrtPrice: event.params.sqrtPriceX96,
        totalValueLockedToken0: pool.totalValueLockedToken0.plus(amount0),
        totalValueLockedToken1: pool.totalValueLockedToken1.plus(amount1),
      };

      token0 = {
        ...token0,
        volume: token0.volume.plus(amount0Abs),
        volumeUSD: token0.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token0.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
        txCount: token0.txCount + ONE_BI,
      };

      token1 = {
        ...token1,
        volume: token1.volume.plus(amount1Abs),
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

      const prices = sqrtPriceX96ToTokenPrices(pool.sqrtPrice, token0, token1);
      const totalValueLockedETH = pool.totalValueLockedToken0
        .times(token0.derivedETH)
        .plus(pool.totalValueLockedToken1.times(token1.derivedETH));

      pool = {
        ...pool,
        token0Price: prices[0],
        token1Price: prices[1],
        totalValueLockedETH,
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
        volumeToken0: poolDayData.volumeToken0.plus(amount0Abs),
        volumeToken1: poolDayData.volumeToken1.plus(amount1Abs),
      };

      poolHourData = {
        ...poolHourData,
        volumeUSD: poolHourData.volumeUSD.plus(amountTotalUSDTracked),
        volumeToken0: poolHourData.volumeToken0.plus(amount0Abs),
        volumeToken1: poolHourData.volumeToken1.plus(amount1Abs),
      };

      token0DayData = {
        ...token0DayData,
        volume: token0DayData.volume.plus(amount0Abs),
        volumeUSD: token0DayData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token0DayData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      token0HourData = {
        ...token0HourData,
        volume: token0HourData.volume.plus(amount0Abs),
        volumeUSD: token0HourData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token0HourData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      token1DayData = {
        ...token1DayData,
        volume: token1DayData.volume.plus(amount1Abs),
        volumeUSD: token1DayData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token1DayData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      token1HourData = {
        ...token1HourData,
        volume: token1HourData.volume.plus(amount1Abs),
        volumeUSD: token1HourData.volumeUSD.plus(amountTotalUSDTracked),
        untrackedVolumeUSD: token1HourData.untrackedVolumeUSD.plus(amountTotalUSDUntracked),
      };

      // Save Changes

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
