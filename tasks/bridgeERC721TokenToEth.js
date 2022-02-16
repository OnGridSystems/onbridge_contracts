const { task } = require("hardhat/config");

const {
  bscBridge,
  ethBridge,
  ethChainId,
  tokenId,
} = require("../constants");

task("bridgeERC721TokenToEth", "outbound transfer from bsc chain").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const L1TokenInstance = await ethers.getContract("L1Token");
    const L1BridgeInstance = await ethers.getContract("L1Bridge");
    const { deployer } = await getNamedAccounts();

    console.log("approve token for bsc bridge");
    console.log(
      await (
        await L1TokenInstance.approve(bscBridge, tokenId, {
          from: deployer,
        })
      ).wait()
    );

    console.log("outbound transfer from bsc chain");
    console.log(
      await (
        await L1BridgeInstance.outboundTransfer(
          deployer,
          tokenId,
          ethChainId,
          ethBridge,
          ethers.utils.parseEther("0.01"),
          {
            from: deployer,
            value: ethers.utils.parseEther("0.03"),
          }
        )
      ).wait()
    );
  }
);
