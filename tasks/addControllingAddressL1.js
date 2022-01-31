const { task } = require("hardhat/config");

const { L2BridgeAddress, L2ChainId } = require("../constants");

task(
  "addControllingAddressL1",
  "add controlling address on l1 chain"
).setAction(async (_, hre) => {
  const ethers = hre.ethers;
  const L1BridgeInstance = await ethers.getContract("L1Bridge");
  const { deployer } = await getNamedAccounts();

  console.log("add controlling address on l1 chain");

  console.log(
    await (
      await L1BridgeInstance.addControllingAddress(L2BridgeAddress, L2ChainId, {
        from: deployer,
      })
    ).wait()
  );
});
