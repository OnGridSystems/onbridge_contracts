const { task } = require("hardhat/config");

const { L1BridgeAddress, L1ChainId } = require("../constants")

task("addControllingAddressL2", "add controlling address on l2 chain").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const L2BridgeInstance = await ethers.getContract("L2Bridge");
    const { deployer } = await getNamedAccounts();
    
    console.log("add controlling address on l2 chain");
    console.log(
      await (
        await L2BridgeInstance.addControllingAddress(
          L1BridgeAddress,
          L1ChainId,
          {
            from: deployer,
          }
        )
      ).wait()
    );
  }
);
