// import
// main function
// calling of main function

const { verify } = require("../utils/verfy");
const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const chainId = network.config.chainId;
require("dotenv").config();

// const ethUsdPriceFeedAddress =networkConfig[chainId]['ethUsdPriceFeed']

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let ethUsdPriceFeedAddress;

  console.log(`${network.name}`);
  if (developmentChains.includes(network.name)) {
   
    ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    console.log(`${chainId}`);

    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  console.log(`${ethUsdPriceFeedAddress}`);

  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API) {
    // verifya

    await verify(fundMe.address, args);
  }

  log("-----------========------");
};

module.exports.tags = ["all","fundme"];
