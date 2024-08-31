import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  const network = hre.network.name;

  if (
    !CONTRACTS[network].storefront &&
    CONTRACTS[network].chainlink &&
    CONTRACTS[network].signProtocol
  ) {
    const contractFactory = await ethers.getContractFactory("Storefront");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].chainlink.router
    );
    await contract.waitForDeployment();
    await contract.setData(
      CONTRACTS[network].chainlink.donId,
      CONTRACTS[network].chainlink.subscriptionId,
      CONTRACTS[network].chainlink.source,
      CONTRACTS[network].signProtocol.address,
      CONTRACTS[network].signProtocol.schemaId
    );
    console.log(
      `Contract 'Storefront' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].usdt) {
    const contractFactory = await ethers.getContractFactory("USDToken");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'USDToken' deployed to: ${await contract.getAddress()}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
