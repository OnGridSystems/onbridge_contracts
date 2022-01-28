const { task } = require("hardhat/config");

task("grantOracleRoleL1", "grant oracle role from l1 bridge").setAction(
  async (_, hre) => {
    const ethers = hre.ethers;
    const { deployer } = await getNamedAccounts();
    const { DeBridgeGate } = require("../constants")

    const l1BridgeInstance = await ethers.getContract("L1Bridge");
    const ORACLE_ROLE = await l1BridgeInstance.ORACLE_ROLE();

    console.log("grant oracle role from l1 bridge")
    console.log(
      await (
        await l1BridgeInstance.grantRole(
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
