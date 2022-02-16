const { task } = require("hardhat/config");

task("grantMinterRoleToEthBridge", "grant minter role to eth bridge").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const { deployer } = await getNamedAccounts();
    const { ethBridge } = require("../constants");

    const l2TokenInstance = await ethers.getContract("L2Token");
    const MINTER_ROLE = await l2TokenInstance.MINTER_ROLE();

    console.log("grant minter role to eth bridge");
    console.log(
      await (
        await l2TokenInstance.grantRole(MINTER_ROLE, ethBridge, {
          from: deployer,
        })
      ).wait()
    );
  }
);
