const { ethers } = require("hardhat");
const { TOKENS } = require("../src/constants");

async function main() {
  const PRICE_FEED_ADDRESS = TOKENS[0].feedAddress;

  const PriceMonitor = await ethers.getContractFactory("PriceMonitor");
  const priceMonitor = await PriceMonitor.deploy(PRICE_FEED_ADDRESS, 0);

  await priceMonitor.waitForDeployment();

  console.log("Deployed at:", priceMonitor.target ?? priceMonitor.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
