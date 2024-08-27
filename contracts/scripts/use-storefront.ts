import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'use-storefront'");

  const network = hre.network.name;

  // Define deployer
  const [deployer] = await ethers.getSigners();

  // Define contracts
  const storefront = await ethers.getContractAt(
    "Storefront",
    CONTRACTS[network].storefront as `0x${string}`
  );

  await storefront.listProductWithoutVerification(
    "B0CN6GTNJ1",
    deployer.address,
    ethers.parseEther("420")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
