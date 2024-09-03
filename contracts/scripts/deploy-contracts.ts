import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  const network = hre.network.name;

  if (
    !CONTRACTS[network].storefront &&
    CONTRACTS[network].chainlinkFunctions &&
    CONTRACTS[network].signProtocol
  ) {
    const contractFactory = await ethers.getContractFactory("Storefront");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].chainlinkFunctions.router
    );
    await contract.waitForDeployment();
    await contract.setData(
      CONTRACTS[network].chainlinkFunctions.donId,
      CONTRACTS[network].chainlinkFunctions.subscriptionId,
      CONTRACTS[network].chainlinkFunctions.source,
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

  if (
    !CONTRACTS[network].checkout &&
    CONTRACTS[network].chainlinkDataFeed &&
    CONTRACTS[network].usdt
  ) {
    const contractFactory = await ethers.getContractFactory("Checkout");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].chainlinkDataFeed.address,
      CONTRACTS[network].chainlinkDataFeed.customAnswer,
      CONTRACTS[network].usdt
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'Checkout' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].chatGpt && CONTRACTS[network].galadrielOracle) {
    const contractFactory = await ethers.getContractFactory("ChatGpt");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].galadrielOracle,
      ""
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'ChatGpt' deployed to: ${await contract.getAddress()}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
