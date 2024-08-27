import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  const network = hre.network.name;

  if (
    !CONTRACTS[network].storefront &&
    CONTRACTS[network].signProtocol &&
    CONTRACTS[network].signProtocolSchemaId
  ) {
    const contractFactory = await ethers.getContractFactory("Storefront");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].signProtocol,
      CONTRACTS[network].signProtocolSchemaId
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'Storefront' deployed to: ${await contract.getAddress()}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
