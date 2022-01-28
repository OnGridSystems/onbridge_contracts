const { task } = require("hardhat/config");

task("grantMinterRoleToL1Bridge", "grant minter role to l1 bridge").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const { deployer } = await getNamedAccounts();
    const { L1BridgeAddress } = require("../constants")

    const l1TokenInstance = await ethers.getContract("L1Token");
    const MINTER_ROLE = await l1TokenInstance.MINTER_ROLE();

    console.log("grant minter role to l1 bridge")
    console.log(
      await (
        await l1TokenInstance.grantRole(
          MINTER_ROLE,
          L1BridgeAddress,
          {
            from: deployer,
          }
        )
      ).wait()
    );
  }
);
