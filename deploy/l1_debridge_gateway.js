module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  console.log("deploying DeBridgeGate");

  await deploy("DeBridgeGateMock", {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["DeBridgeGate"];
