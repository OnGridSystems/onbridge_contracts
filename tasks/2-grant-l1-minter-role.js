const { task } = require("hardhat/config");

task("2-grant-l1-minter-role", "grant minter role for l1 network").setAction(async (taskArgs, hre) => {
  const ethers = hre.ethers;

  const { deployer } = await getNamedAccounts();

  const l1TokenInstance = await ethers.getContract("L1Token");
  const minterRole = await l1TokenInstance.MINTER_ROLE();

  await (
    await l1TokenInstance.grantRole(
      minterRole,
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      {
        from: deployer,
      }
    )
  ).wait();
});
