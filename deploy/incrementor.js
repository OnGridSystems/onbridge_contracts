module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const { DeBridgeGate } = require("../constants")
  
    await deploy("Incrementor", {
      from: deployer,
      log: true,
      args: [DeBridgeGate],
      skipIfAlreadyDeployed: true,
    });
  };
  
module.exports.tags = ["Incrementor"];
  