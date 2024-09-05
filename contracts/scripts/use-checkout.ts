import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'use-checkout'");

  const network = hre.network.name;

  // Define contracts
  const checkout = await ethers.getContractAt(
    "Checkout",
    CONTRACTS[network].checkout as `0x${string}`
  );

  const data = await checkout.getPaymentToken();
  console.log({ data });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
