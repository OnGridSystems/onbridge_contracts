require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("solidity-coverage");

require("./tasks/addControllingAddressBsc.js");
require("./tasks/addControllingAddressEth.js");
require("./tasks/addControllingAddressPolygon.js");
require("./tasks/bridgeERC721TokenToBscFromPolygon.js");
require("./tasks/bridgeERC721TokenToBscFromKovan.js");
require("./tasks/bridgeERC721TokenToEth.js");
require("./tasks/bridgeERC721TokenToPolygon.js");
require("./tasks/grantMinterRoleToEthBridge.js");
require("./tasks/grantMinterRoleToPolygonBridge.js");
require("./tasks/setContractAddressOnChainIdBsc.js");
require("./tasks/setContractAddressOnChainIdEth.js");
require("./tasks/setContractAddressOnChainIdPolygon.js");


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
      url: "https://data-seed-prebsc-2-s2.binance.org:8545/",
      accounts,
      chainId: 97,
      gasPrice: 10000000000,
      gas: 2100000,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_KOVAN_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      gasPrice: 10000000000,
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts,
      chainId: 80001,
      live: true,
      saveDeployments: true,
      gas: 2100000,
      gasPrice: 80000000000,
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
