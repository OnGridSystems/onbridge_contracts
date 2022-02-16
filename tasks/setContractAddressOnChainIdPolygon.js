const { task } = require("hardhat/config");

const { bscBridge, bscChainId } = require("../constants");

task(
  "setContractAddressOnChainIdPolygon",
  "set contract address on chainId for polygon bridge"
).setAction(async (_, hre) => {
  const ethers = hre.ethers;
  const L2BridgeInstance = await ethers.getContract("L2Bridge");
  const { deployer } = await getNamedAccounts();

  console.log("set contract address on chainId for polygon bridge");
  console.log(
    await (
      await L2BridgeInstance.setContractAddressOnChainId(
        bscBridge,
        bscChainId,
        {
          from: deployer,
        }
      )
    ).wait()
  );
});
