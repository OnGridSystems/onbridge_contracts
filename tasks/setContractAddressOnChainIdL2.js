const { task } = require("hardhat/config");

const { L1BridgeAddress, L1ChainId } = require("../constants");

task(
  "setContractAddressOnChainIdL2",
  "set contract address on chainId for l2 bridge"
).setAction(async (_, hre) => {
  const ethers = hre.ethers;
  const L2BridgeInstance = await ethers.getContract("L2Bridge");
  const { deployer } = await getNamedAccounts();

  console.log("set contract address on chainId for l2 bridge");
  console.log(
    await (
      await L2BridgeInstance.setContractAddressOnChainId(
        L1BridgeAddress,
        L1ChainId,
        {
          from: deployer,
        }
      )
    ).wait()
  );
});
