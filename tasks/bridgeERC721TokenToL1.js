const { task } = require("hardhat/config");

const { L1BridgeAddress, L2BridgeAddress, L1ChainId, tokenId } = require("../constants")

task("bridgeERC721TokenToL1", "outbound transfer from l2 chain").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const L2TokenInstance = await ethers.getContract("L2Token");
    const L2BridgeInstance = await ethers.getContract("L2Bridge");
    const { deployer } = await getNamedAccounts();

    console.log("approve token for l2 bridge")
    console.log(
        await (
          await L2TokenInstance.approve(
            L2BridgeAddress,
            tokenId,
            {
              from: deployer,
            }
          )
        ).wait()
      );

    console.log("outbound transfer from l2 chain");
    console.log(
      await (
        await L2BridgeInstance.outboundTransfer(
          deployer,
          tokenId,
          L1ChainId,
          L1BridgeAddress,
          ethers.utils.parseEther("0.01"),
          {
            from: deployer,
            value: ethers.utils.parseEther("0.03")
          }
        )
      ).wait()
    );
  }
);
