import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    },
  },
  networks: {
    optimismSepolia: {
      url: "https://sepolia.optimism.io",
      accounts: [process.env.PRIVATE_KEY as string],
    },
    galadrielDevnet: {
      url: "https://devnet.galadriel.com",
      accounts: [process.env.PRIVATE_KEY as string],
    },
    rootstockTestnet: {
      url: `https://rpc.testnet.rootstock.io/${process.env.ROOTSTOCK_RPC_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    morphHoleskyTestnet: {
      url: `https://rpc-quicknode-holesky.morphl2.io`,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    chilizSpicyTestnet: {
      url: `https://spicy-rpc.chiliz.com/`,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    hederaTestnet: {
      url: `https://pool.arkhia.io/hedera/testnet/json-rpc/v1/${process.env.HEDERA_RPC_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
      optimismSepolia: "empty",
    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com",
        },
      },
    ],
  },
};

export default config;
