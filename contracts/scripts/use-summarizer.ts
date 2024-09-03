import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'use-summarizer'");

  const network = hre.network.name;

  // Define contracts
  const summarizer = await ethers.getContractAt(
    "Summarizer",
    CONTRACTS[network].summarizer as `0x${string}`
  );

  // await summarizer.createSummary(
  //   "XYZ",
  //   "1. Good product. USB-C charger. Easy to set up and use. Works great. 2. This wallet while I can see it needing to be replaced every few years for the battery potentially but certainly the buttons sake depending on usage. I think the peace of mind provided for $40 cost is well worth it if you deal in any substantial amount of crypto. While it doesn't offer everything it offers a lot compared to something like a ledger where you have all sorts of wallets but only 6 at a time. 3. Had this for a few months now. I keep it in my wallet and has been working good."
  // );

  // const data = await summarizer.getMessageHistory(1);
  // const data = await summarizer.getSummary("XYZ_3");
  // console.log(data);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
