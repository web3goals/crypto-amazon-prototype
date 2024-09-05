import { ContractFactory } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import { data } from "./data";

async function main() {
  // Ensure required environment variables are available
  dotenv.config();
  if (
    !process.env.ACCOUNT_ID ||
    !process.env.ACCOUNT_PRIVATE_KEY ||
    !process.env.RPC_URL
  ) {
    throw new Error("Please set required keys in .env file.");
  }
  const rpcUrl = process.env.RPC_URL;
  const accountId = process.env.ACCOUNT_ID;
  const accountKey = process.env.ACCOUNT_PRIVATE_KEY;

  // Initialise account
  const rpcProvider = new JsonRpcProvider(rpcUrl);
  const accountWallet = new Wallet(accountKey, rpcProvider);
  const accountAddress = accountWallet.address;
  const accountExplorerUrl = `https://hashscan.io/testnet/address/${accountAddress}`;

  // Deploy smart contract
  const abi = await fs.readFile(
    "./______Users_kiv1n_Workspace_web3goals_crypto-amazon-prototype_hedera_contracts_Checkout_sol_Checkout.abi",
    {
      encoding: "utf8",
    }
  );
  const evmBytecode = await fs.readFile(
    "./______Users_kiv1n_Workspace_web3goals_crypto-amazon-prototype_hedera_contracts_Checkout_sol_Checkout.bin",
    {
      encoding: "utf8",
    }
  );

  const contractFactory = new ContractFactory(abi, evmBytecode, accountWallet);
  const contract = await contractFactory.deploy(
    "0x0000000000000000000000000000000000000000",
    "100000000",
    data.usdtEvmAddress
  );
  await contract.deployTransaction.wait();
  const contractAddress = contract.address;
  const contractExplorerUrl = `https://hashscan.io/testnet/address/${contractAddress}`;

  // Output results
  console.log(`accountId: ${accountId}`);
  console.log(`accountAddress: ${accountAddress}`);
  console.log(`accountExplorerUrl: ${accountExplorerUrl}`);
  console.log(`contractAddress: ${contractAddress}`);
  console.log(`contractExplorerUrl: ${contractExplorerUrl}`);

  return {
    accountId,
    accountAddress,
    accountExplorerUrl,
    contractAddress,
    contractExplorerUrl,
  };
}

main();

export default main;
