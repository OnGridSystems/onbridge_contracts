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
    "https://gateway.pinata.cloud/ipfs/QmUFbUk5jzb6saByCcWinsJfy9ahziLf8V41LUMhCQDcJN"
  );
};

module.exports.tags = ["polygonToken"];
