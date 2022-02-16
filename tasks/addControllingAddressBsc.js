const { task } = require("hardhat/config");

const { ethBridge, polygonBridge, ethChainId, polygonChainId } = require("../constants");

task(
  "addControllingAddressBsc",
  "add controlling address on bsc chain"
).setAction(async (_, hre) => {
  const ethers = hre.ethers;
  const L1BridgeInstance = await ethers.getContract("L1Bridge");
  const { deployer } = await getNamedAccounts();

  console.log("add controlling address on bsc chain");

  console.log(
    await (
      await L1BridgeInstance.addControllingAddress(ethBridge, ethChainId, {
        from: deployer,
      })
    ).wait()
  );
  console.log(
    await (
      await L1BridgeInstance.addControllingAddress(polygonBridge, polygonChainId, {
        from: deployer,
      })
    ).wait()
  );
});
