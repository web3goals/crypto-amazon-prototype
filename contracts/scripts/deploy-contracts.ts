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

  if (!CONTRACTS[network].fanToken) {
    const contractFactory = await ethers.getContractFactory("FanToken");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'FanToken' deployed to: ${await contract.getAddress()}`
    );
  }

  if (
    !CONTRACTS[network].checkout &&
    CONTRACTS[network].chainlinkDataFeed &&
    CONTRACTS[network].usdt &&
    CONTRACTS[network].usdt != ethers.ZeroAddress
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

  if (
    !CONTRACTS[network].checkout &&
    CONTRACTS[network].chainlinkDataFeed &&
    CONTRACTS[network].fanToken &&
    CONTRACTS[network].fanToken != ethers.ZeroAddress
  ) {
    const contractFactory = await ethers.getContractFactory("Checkout");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].chainlinkDataFeed.address,
      CONTRACTS[network].chainlinkDataFeed.customAnswer,
      CONTRACTS[network].fanToken
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'Checkout' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].chatGpt && CONTRACTS[network].galadriel) {
    const contractFactory = await ethers.getContractFactory("ChatGpt");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].galadriel.oracle,
      ""
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'ChatGpt' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].summarizer && CONTRACTS[network].galadriel) {
    const contractFactory = await ethers.getContractFactory("Summarizer");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].galadriel.oracle,
      CONTRACTS[network].galadriel.prompt
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'Summarizer' deployed to: ${await contract.getAddress()}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
