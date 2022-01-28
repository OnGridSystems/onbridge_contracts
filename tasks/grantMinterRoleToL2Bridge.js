const { task } = require("hardhat/config");

task("grantMinterRoleToL2Bridge", "grant minter role to l2 bridge").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const { deployer } = await getNamedAccounts();
    const { L2BridgeAddress } = require("../constants")

    const l2TokenInstance = await ethers.getContract("L2Token");
    const MINTER_ROLE = await l2TokenInstance.MINTER_ROLE();

    console.log("grant minter role to l2 bridge")
    console.log(
      await (
        await l2TokenInstance.grantRole(
          MINTER_ROLE,
          L2BridgeAddress,
          {
            from: deployer,
          }
        )
      ).wait()
    );
  }
);
