const { task } = require("hardhat/config");

const { L1BridgeAddress, L2BridgeAddress, L2ChainId, tokenId } = require("../constants")

task("bridgeERC721TokenToL2", "outbound transfer from l1 chain").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const L1TokenInstance = await ethers.getContract("L1Token");
    const L1BridgeInstance = await ethers.getContract("L1Bridge");
    const { deployer } = await getNamedAccounts();

    console.log("approve token for l1 bridge")
    console.log(
        await (
          await L1TokenInstance.approve(
            L1BridgeAddress,
            tokenId,
            {
              from: deployer,
            }
          )
        ).wait()
      );

    console.log("outbound transfer from l1 chain");
    console.log(
      await (
        await L1BridgeInstance.outboundTransfer(
          deployer,
          tokenId,
          L2ChainId,
          L2BridgeAddress,
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
