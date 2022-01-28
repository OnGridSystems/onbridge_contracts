const { task } = require("hardhat/config");

task("grantOracleRoleL2", "grant oracle role from l2 bridge").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const { deployer } = await getNamedAccounts();
    const { DeBridgeGate } = require("../constants")

    const l2BridgeInstance = await ethers.getContract("L2Bridge");
    const ORACLE_ROLE = await l2BridgeInstance.ORACLE_ROLE();

    console.log("grant oracle role from l2 bridge")
    console.log(
      await (
        await l2BridgeInstance.grantRole(
          ORACLE_ROLE,
          DeBridgeGate,
          {
            from: deployer,
          }
        )
      ).wait()
    );
  }
);
