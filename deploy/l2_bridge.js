module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const L1Token = "0x3630285008496F1A65652C07ED47adbab915965C";
  const L2Token = "0x8e7839B0ac8cbf18aBd424BC4a7594E177e90BfF";

  console.log("deploying L2Bridge");

  await deploy("L2Bridge", {
    from: deployer,
    log: true,
    args: [L1Token, L2Token],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["L2Bridge"];
// module.exports.dependencies = ["L1Token", "L2Token"]
