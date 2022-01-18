require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

require("./tasks/1-set-default-uri.js");
require("./tasks/2-grant-l1-minter-role.js");
require("./tasks/2-grant-l2-minter-role.js");
require("./tasks/3-grant-l1-oracle-role.js");
require("./tasks/3-grant-l2-oracle-role.js");

const accounts = {
  mnemonic: `${process.env.MNEMONIC}`,
};

module.exports = {
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      hardfork: "london",
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_RINKEBY_API_KEY}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 8000000000,
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 10000000000,
    },
    ganache_eth: {
      url: "http://127.0.0.1:8545",
      accounts,
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    ganache_bsc: {
      url: "http://127.0.0.1:8546",
      accounts,
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
