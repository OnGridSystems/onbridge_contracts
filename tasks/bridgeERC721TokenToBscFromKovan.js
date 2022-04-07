const { task } = require("hardhat/config");

const {
  ethBridge,
  bscBridge,
  bscChainId,
  tokenId,
} = require("../constants");

task("bridgeERC721TokenToBscFromKovan", "outbound transfer from eth chain").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const L2TokenInstance = await ethers.getContract("L2Token");
    const L2BridgeInstance = await ethers.getContract("L2Bridge");
    const { deployer } = await getNamedAccounts();

    console.log("approve token for bsc bridge");
    console.log(
      await (
        await L2TokenInstance.approve(ethBridge, tokenId, {
          from: deployer,
        })
      ).wait()
    );

    console.log("outbound transfer from eth chain");
    console.log(
      await (
        await L2BridgeInstance.outboundTransfer(
          deployer,
          tokenId,
          bscChainId,
          bscBridge,
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
