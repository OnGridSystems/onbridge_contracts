const { task } = require("hardhat/config");

task("3-grant-l2-oracle-role", "grant oracle role for l2 network").setAction(async (taskArgs, hre) => {
  const ethers = hre.ethers;

  const { deployer } = await getNamedAccounts();

  const l2BridgeInstance = await ethers.getContract("L2Bridge");
  console.log(l2BridgeInstance)
  const oracleRole = await l2BridgeInstance.ORACLE_ROLE();

  await (
    await l2BridgeInstance.grantRole(
      oracleRole,
      "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      {
        from: deployer,
      }
    )
  ).wait();
});
