import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'use-chat-gpt'");

  const network = hre.network.name;

  // Define contracts
  const chatGpt = await ethers.getContractAt(
    "ChatGpt",
    CONTRACTS[network].chatGpt as `0x${string}`
  );

  //   await chatGpt.startChat("Hello, who are you?");

  //   const data = await chatGpt.getMessageHistory(0);
  //   console.log(data[1]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
