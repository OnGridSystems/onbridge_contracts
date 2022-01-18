const { task } = require("hardhat/config");

task("3-grant-l1-oracle-role", "grant oracle role for l1 network").setAction(async (taskArgs, hre) => {
  const ethers = hre.ethers;

  const { deployer } = await getNamedAccounts();

  const l1BridgeInstance = await ethers.getContract("L1Bridge");
  console.log(l1BridgeInstance)
  const oracleRole = await l1BridgeInstance.ORACLE_ROLE();

  await (
    await l1BridgeInstance.grantRole(
      oracleRole,
      "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      {
        from: deployer,
      }
    )
  ).wait();
});
