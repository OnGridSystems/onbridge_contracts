module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const { L1Token, L2Token, DeBridgeGate } = require("../constants");

  console.log("deploying L1Bridge");

  await deploy("L1Bridge", {
    from: deployer,
    log: true,
    args: [L1Token, L2Token, DeBridgeGate],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["L1Bridge"];
