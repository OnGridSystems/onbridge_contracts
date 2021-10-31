module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(deployer);
  await deploy("L1Token", {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true,
  });

  console.log("\nSet default uri\n");
  await execute(
    "L1Token",
    { from: deployer, log: true },
    "setDefaultUri",
    "https://api.onbridge.io/token_images/"
  );

  console.log("\nMint 20 tokens to l1holder\n");
  for (var token = 0; token < 20; token++) {
    await execute(
      "L1Token",
      { from: deployer, log: true },
      "mint",
      deployer,
      token
    );
  }

  console.log("\nl1holder balance === 20");
  const L1Token = await ethers.getContract("L1Token");
  balance = await L1Token.balanceOf(deployer);
  if (balance.toNumber() === 20) {
    console.log("true \n");
  }
};

module.exports.tags = ["L1Token"];
