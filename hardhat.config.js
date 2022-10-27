require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
// require("./task/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */

const GORL_RPC_URL = process.env.GORL_RPC_URL;
const GORL_PRIVATE_KEY = process.env.GORL_PRIVATE_KEY;
const ETHERSCAN_KEY = process.env.ETHERSCAN_API;
const LOCAL_RPC_URL = process.env.LOCAL_RPC_URL;
const COINMARKETCAP_KEY = process.env.COINMARETCAP_KEY;
module.exports = {
  //default hardhat
  defaultNetwork: "hardhat",

  networks: {
    gorl: {
      url: GORL_RPC_URL,
      accounts: [GORL_PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    local: { url: LOCAL_RPC_URL, chainId: 31337 },
  },
  // solidity: "0.8.17",
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },

  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_KEY,
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
