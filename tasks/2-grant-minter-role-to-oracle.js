const { task } = require("hardhat/config");

task("2-grant-minter-role-to-oracle", "grant minter role to oracle").setAction(
  async (taskArgs, hre) => {
    const ethers = hre.ethers;
    const { deployer } = await getNamedAccounts();

    const l2BridgeInstance = await ethers.getContract("L2Bridge");
    const ORACLE_ROLE = await l2BridgeInstance.ORACLE_ROLE();

    await (
      await l2BridgeInstance.grantRole(
        ORACLE_ROLE,
        "0x68D936Cb4723BdD38C488FD50514803f96789d2D",
        {
          from: deployer,
        }
      )
    ).wait();
  }
);
