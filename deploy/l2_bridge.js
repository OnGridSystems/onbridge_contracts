module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  // const L1Token = await ethers.getContract("L1Token")
  const L1Token = "0x97ea372254e8bF2Da32fD2756934d798C12bef54";
  // const L2Token = await ethers.getContract("L2Token")
  const L2Token = "0x49d25DD6a5BC2993c1A4762F826065940909Ee5F";

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
