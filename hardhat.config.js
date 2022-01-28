require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require('@openzeppelin/hardhat-upgrades');

require("./tasks/addControllingAddressL2.js");
require("./tasks/addControllingAddressL1.js");
require("./tasks/bridgeERC721TokenToL2.js");
require("./tasks/bridgeERC721TokenToL1.js");
require("./tasks/grantMinterRoleToL1Bridge.js");
require("./tasks/grantMinterRoleToL2Bridge.js");
require("./tasks/grantOracleRoleL2.js");
require("./tasks/grantOracleRoleL1.js");
require("./tasks/setContractAddressOnChainIdL2.js");
require("./tasks/setContractAddressOnChainIdL1.js");

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
      gasPrice: 10000000000,
      gas: 2100000,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    kovan: {
      url: "https://kovan.poa.network",
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      gasPrice: 10000000000,
    }
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
