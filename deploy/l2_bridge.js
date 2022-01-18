module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const L1Token = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const L2Token = await ethers.getContract("L2Token");

  console.log("deploying L2Bridge");

  await deploy("L2Bridge", {
    from: deployer,
    log: true,
    args: [L1Token, L2Token.address],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["L2Bridge"];
