module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const { bscToken, ethToken, DeBridgeGate } = require("../constants");

  console.log("deploying ethBridge");

  await deploy("L2Bridge", {
    from: deployer,
    log: true,
    args: [bscToken, ethToken, DeBridgeGate],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["ethBridge"];
