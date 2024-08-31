import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Checkout", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne, userTwo] = await ethers.getSigners();
    // Deploy contracts
    const usdTokenContractFactory = await ethers.getContractFactory("USDToken");
    const usdTokenContract = await usdTokenContractFactory.deploy();
    const checkoutContractFactory = await ethers.getContractFactory("Checkout");
    const checkoutContract = await checkoutContractFactory.deploy(
      ethers.ZeroAddress,
      usdTokenContract
    );
    // Mint USD tokens
    await usdTokenContract.mint(ethers.parseEther("100"), userOne.address);
    await usdTokenContract.mint(ethers.parseEther("100"), userTwo.address);
    return {
      deployer,
      userOne,
      userTwo,
      usdTokenContract,
      checkoutContract,
    };
  }

  it("Should process buying", async function () {
    const {
      userOne: seller,
      userTwo: buyer,
      usdTokenContract,
      checkoutContract,
    } = await loadFixture(initFixture);
    // Approve transfer
    await usdTokenContract
      .connect(buyer)
      .approve(checkoutContract, ethers.MaxUint256);
    // Buy product
    await expect(
      checkoutContract
        .connect(buyer)
        .buyProduct(
          "XYZ",
          seller.address,
          "Alice",
          "NY",
          ethers.parseEther("42.42")
        )
    ).to.changeTokenBalances(
      usdTokenContract,
      [buyer, checkoutContract],
      [ethers.parseEther("-42.42"), ethers.parseEther("42.42")]
    );
    // Check sales
    expect(await checkoutContract.getSales("XYZ")).to.have.length(1);
    // Withdraw balance
    await expect(
      checkoutContract.connect(seller).withdrawBalance()
    ).to.changeTokenBalances(
      usdTokenContract,
      [seller, checkoutContract],
      [ethers.parseEther("42.42"), ethers.parseEther("-42.42")]
    );
    expect(await checkoutContract.getBalance(seller.address)).to.be.equal(0);
  });

  it.only("Should use custom data feed answer", async function () {
    const { deployer, checkoutContract } = await loadFixture(initFixture);
    // Check before setting
    expect(await checkoutContract.getChainlinkDataFeedAnswer()).to.be.equal(0);
    // Check after setting
    await checkoutContract.setCustomChainlinkDataFeedAnswer("100007522");
    expect(await checkoutContract.getChainlinkDataFeedAnswer()).to.be.equal(
      "100007522"
    );
  });
});
