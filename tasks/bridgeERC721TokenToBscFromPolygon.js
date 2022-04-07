const { task } = require("hardhat/config");

const {
  polygonBridge,
  bscBridge,
  bscChainId,
  tokenId,
} = require("../constants");

task("bridgeERC721TokenToBscFromPolygon", "outbound transfer from polygon chain").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const L2TokenInstance = await ethers.getContract("L2Token");
    const L2BridgeInstance = await ethers.getContract("L2Bridge");
    const { deployer } = await getNamedAccounts();

    console.log("approve token for bsc bridge");
    console.log(
      await (
        await L2TokenInstance.approve(polygonBridge, tokenId, {
          from: deployer,
        })
      ).wait()
    );

    console.log("outbound transfer from polygon chain");
    console.log(
      await (
        await L2BridgeInstance.outboundTransfer(
          deployer,
          tokenId,
          bscChainId,
          bscBridge,
          ethers.utils.parseEther("0.1"),
          {
            from: deployer,
            value: ethers.utils.parseEther("0.3"),
          }
        )
      ).wait()
    );
  }
);
