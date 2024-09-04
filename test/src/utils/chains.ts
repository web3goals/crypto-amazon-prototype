import { BigDecimal } from "generated";
import { STATIC_TOKEN_DEFINITIONS, StaticTokenDefinition } from "./staticTokenDefinition";
import { BASE_MAINNET_ID, ETH_MAINNET_ID } from "./constants";
import { Address } from ".";

export enum ChainId {
  ARBITRUM_ONE = 42161,
  AVALANCHE = 43114,
  BASE = 8453,
  BLAST_MAINNET = 81457,
  BSC = 56,
  CELO = 42220,
  MAINNET = 1,
  MATIC = 137,
}

// Note: All token and pool addresses should be lowercased!
export type SubgraphConfig = {
  // deployment address
  // e.g. https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments
  factoryV2Address: string;

  // deployment address
  // e.g. https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments
  factoryV3Address: string;

  // the address of a pool where one token is a stablecoin and the other is a
  // token that tracks the price of the native token use this to calculate the
  // price of the native token, so prefer a pool with highest liquidity
  stablecoinWrappedNativePoolAddress: string;

  // true is stablecoin is token0, false if stablecoin is token1
  stablecoinIsToken0: boolean;

  // the address of a token that tracks the price of the native token, most of
  // the time, this is a wrapped asset but could also be the native token itself
  // for some chains
  wrappedNativeAddress: string;

  // the mimimum liquidity in a pool needed for it to be used to help calculate
  // token prices. for new chains, this should be initialized to ~4000 USD
  minimumNativeLocked: BigDecimal;

  // list of stablecoin addresses
  stablecoinAddresses: string[];

  // a token must be in a pool with one of these tokens in order to derive a
  // price (in addition to passing the minimumEthLocked check). This is also
  // used to determine whether volume is tracked or not.
  whitelistTokens: string[];

  // token overrides are used to override RPC calls for the symbol, name, and
  // decimals for tokens. for new chains this is typically empty.
  tokenOverrides: StaticTokenDefinition[];

  // skip the creation of these pools in handlePoolCreated. for new chains this is typically empty.
  poolsToSkip: string[];

  // initialize this list of pools and token addresses on factory creation. for new chains this is typically empty.
  poolMappings: Array<`0x${string}`[]>;

  // tokens to skip
  tokensToSkip: Address[];
};

export function getChainConfig(chainId: number): SubgraphConfig {
  // subgraph does not support case switch with strings, hence this if else block
  if (chainId == BASE_MAINNET_ID) {
    return {
      factoryV2Address: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
      factoryV3Address: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
      stablecoinWrappedNativePoolAddress: "0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C", // WETH-USDC V2
      stablecoinIsToken0: true,
      wrappedNativeAddress: "0x4200000000000000000000000000000000000006", // WETH
      minimumNativeLocked: BigDecimal("5"),
      stablecoinAddresses: [
        "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // DAI
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
        "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      ],
      whitelistTokens: [
        "0x4200000000000000000000000000000000000006", // WETH
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
        "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452", // wstETH
      ],
      tokenOverrides: STATIC_TOKEN_DEFINITIONS[BASE_MAINNET_ID],
      poolsToSkip: [],
      poolMappings: [],
      tokensToSkip: ["0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1"],
    };
  } else if (chainId == ETH_MAINNET_ID) {
    return {
      factoryV2Address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      factoryV3Address: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      stablecoinWrappedNativePoolAddress: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc", // USDC-WETH V2
      stablecoinIsToken0: false,
      wrappedNativeAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
      minimumNativeLocked: BigDecimal("20"),
      stablecoinAddresses: [
        "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
        "0x0000000000085d4780b73119b644ae5ecd22b376", // TUSD
        "0x956f47f50a910163d8bf957cf5846d573e7f87ca", // FEI
      ],
      whitelistTokens: [
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
        "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
        "0x0000000000085d4780b73119b644ae5ecd22b376", // TUSD
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
        "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643", // cDAI
        "0x39aa39c021dfbae8fac545936693ac917d5e7563", // cUSDC
        "0x86fadb80d8d2cff3c3680819e4da99c10232ba0f", // EBASE
        "0x57ab1ec28d129707052df4df418d58a2d46d5f51", // sUSD
        "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", // MKR
        "0xc00e94cb662c3520282e6f5717214004a7f26888", // COMP
        "0x514910771af9ca656af840dff83e8264ecf986ca", // LINK
        "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", // SNX
        "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e", // YFI
        "0x111111111117dc0aa78b770fa6a738034120c302", // 1INCH
        "0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8", // yCurv
        "0x956f47f50a910163d8bf957cf5846d573e7f87ca", // FEI
        "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // MATIC
        "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9", // AAVE
        "0xfe2e637202056d30016725477c5da089ab0a043a", // sETH2
      ],
      tokenOverrides: STATIC_TOKEN_DEFINITIONS[ETH_MAINNET_ID],
      poolsToSkip: ["0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248", "0x70258aa9830c2c84d855df1d61e12c256f6448b4"],
      poolMappings: [],
      tokensToSkip: ["0xC36442b4a4522E871399CD717aBDD847Ab11FE88", "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5"],
    };
  } else {
    throw new Error("Unsupported Network");
  }
}
