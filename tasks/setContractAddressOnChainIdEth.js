const { task } = require("hardhat/config");

const { bscBridge, bscChainId } = require("../constants");

task(
  "setContractAddressOnChainIdEth",
  "set contract address on chainId for eth bridge"
).setAction(async (_, hre) => {
  const ethers = hre.ethers;
  const L2BridgeInstance = await ethers.getContract("L2Bridge");
  const { deployer } = await getNamedAccounts();

  console.log("set contract address on chainId for eth bridge");
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
