module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("L2Token", {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true,
  });

  console.log("Set default uri");
  await execute(
    "L2Token",
    { from: deployer, log: true },
    "setDefaultUri",
    "https://imgur.com/gallery/"
  );
};

module.exports.tags = ["L2Token"];
