module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const { bscToken, polygonToken, DeBridgeGate } = require("../constants");

  console.log("deploying polygonBridge");

  await deploy("L2Bridge", {
    from: deployer,
    log: true,
    args: [bscToken, polygonToken, DeBridgeGate],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["polygonBridge"];
