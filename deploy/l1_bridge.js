module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const DeBridgeGate = "0x68D936Cb4723BdD38C488FD50514803f96789d2D";
  const L1Token = "0xA563fBF2285b05B17edBc42472452f9f6d1aDb84";
  const L2Token = "0xA563fBF2285b05B17edBc42472452f9f6d1aDb84";
  const L2Bridge = "0x82e2EAfd19caD56fb42a14f68D6cdD60d0878f09";

  console.log("deploying L1Bridge");

  await deploy("L1Bridge", {
    from: deployer,
    log: true,
    args: [L1Token, DeBridgeGate, L2Token, L2Bridge],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["L1Bridge"];
// module.exports.dependencies = ["L1Token", "L2Token"]
