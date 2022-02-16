const { task } = require("hardhat/config");

task("grantMinterRoleToPolygonBridge", "grant minter role to polygon bridge").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const { deployer } = await getNamedAccounts();
    const { polygonBridge } = require("../constants");

    const l2TokenInstance = await ethers.getContract("L2Token");
    const MINTER_ROLE = await l2TokenInstance.MINTER_ROLE();

    console.log("grant minter role to polygon bridge");
    console.log(
      await (
        await l2TokenInstance.grantRole(MINTER_ROLE, polygonBridge, {
          from: deployer,
        })
      ).wait()
    );
  }
);
