const { task } = require("hardhat/config");

const { ethBridge, polygonBridge, ethChainId, polygonChainId } = require("../constants");

task(
  "setContractAddressOnChainIdBsc",
  "set contract address on chainId for bsc bridge"
).setAction(async (_, hre) => {
  const ethers = hre.ethers;
  const L1BridgeInstance = await ethers.getContract("L1Bridge");
  const { deployer } = await getNamedAccounts();

  console.log("set contract address on chainId for bsc bridge");
  console.log(
    await (
      await L1BridgeInstance.setContractAddressOnChainId(
        ethBridge,
        ethChainId,
        {
          from: deployer,
        }
      )
    ).wait()
  );
  console.log(
    await (
      await L1BridgeInstance.setContractAddressOnChainId(
        polygonBridge,
        polygonChainId,
        {
          from: deployer,
        }
      )
    ).wait()
  );
});
