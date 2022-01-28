const { task } = require("hardhat/config");

const { L2BridgeAddress, L2ChainId } = require("../constants")

task("setContractAddressOnChainIdL1", "set contract address on chainId for l1 bridge").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const L1BridgeInstance = await ethers.getContract("L1Bridge");
    const { deployer } = await getNamedAccounts();

    console.log("set contract address on chainId for l1 bridge");
    console.log(
      await (
        await L1BridgeInstance.setContractAddressOnChainId(
          L2BridgeAddress,
          L2ChainId,
          {
            from: deployer,
          }
        )
      ).wait()
    );
  }
);
