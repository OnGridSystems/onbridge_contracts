module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

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

  console.log("\nMint 10 tokens to l1holder\n");
  for (var token = 0; token < 10; token++) {
    await execute(
      "L1Token",
      { from: deployer, log: true },
      "mint",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      token
    );
  }
};

module.exports.tags = ["L1Token"];
