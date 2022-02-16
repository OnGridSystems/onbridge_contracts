module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const { bscToken, DeBridgeGate } = require("../constants");

  console.log("deploying L1Bridge");

  await deploy("L1Bridge", {
    from: deployer,
    log: true,
    args: [bscToken, DeBridgeGate],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["bscBridge"];
