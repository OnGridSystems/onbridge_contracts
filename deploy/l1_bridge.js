module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const L1Token = await ethers.getContract("L1Token");
  const L2Token = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  console.log("deploying L1Bridge");

  await deploy("L1Bridge", {
    from: deployer,
    log: true,
    args: [L1Token.address, L2Token],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["L1Bridge"];
