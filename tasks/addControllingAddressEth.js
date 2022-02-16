const { task } = require("hardhat/config");

const { bscBridge, bscChainId } = require("../constants");

task(
  "addControllingAddressEth",
  "add controlling address on eth chain"
).setAction(async (_, hre) => {
  const ethers = hre.ethers;
  const L2BridgeInstance = await ethers.getContract("L2Bridge");
  const { deployer } = await getNamedAccounts();

  console.log("add controlling address on eth chain");

  console.log(
    await (
      await L2BridgeInstance.addControllingAddress(bscBridge, bscChainId, {
        from: deployer,
      })
    ).wait()
  );
});
