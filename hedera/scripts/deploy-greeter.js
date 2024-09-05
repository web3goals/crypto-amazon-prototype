import fs from "node:fs/promises";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory } from "@ethersproject/contracts";
import dotenv from "dotenv";

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
  const abi = await fs.readFile("./contracts_Greeter_sol_Greeter.abi", {
    encoding: "utf8",
  });
  const evmBytecode = await fs.readFile("./contracts_Greeter_sol_Greeter.bin", {
    encoding: "utf8",
  });
  const contractFactory = new ContractFactory(abi, evmBytecode, accountWallet);
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait();
  const contractAddress = contract.address;
  const contractExplorerUrl = `https://hashscan.io/testnet/address/${contractAddress}`;

  // Write data to smart contract
  const contractWriteTxRequest = await contract.functions.introduce("bguiz");
  const contractWriteTxReceipt = await contractWriteTxRequest.wait();
  const contractWriteTxHash = contractWriteTxReceipt.transactionHash;
  const contractWriteTxExplorerUrl = `https://hashscan.io/testnet/transaction/${contractWriteTxHash}`;

  // Read data from smart contract
  const [contractQueryResult] = await await contract.functions.greet();

  // Output results
  console.log(`accountId: ${accountId}`);
  console.log(`accountAddress: ${accountAddress}`);
  console.log(`accountExplorerUrl: ${accountExplorerUrl}`);
  console.log(`contractAddress: ${contractAddress}`);
  console.log(`contractExplorerUrl: ${contractExplorerUrl}`);
  console.log(`contractWriteTxHash: ${contractWriteTxHash}`);
  console.log(`contractWriteTxExplorerUrl: ${contractWriteTxExplorerUrl}`);
  console.log(`contractQueryResult: ${contractQueryResult}`);

  return {
    accountId,
    accountAddress,
    accountExplorerUrl,
    contractAddress,
    contractExplorerUrl,
    contractWriteTxHash,
    contractWriteTxExplorerUrl,
    contractQueryResult,
  };
}

main();

export default main;
