module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const L1Token = await ethers.getContract("L1Token");
  const DeBridgeGate = await ethers.getContract("DeBridgeGateMock");

  // const L2Token = await ethers.getContract("L2Token")
  const L2Token = "0x31649ac584eBcBfD465b49304eB27574B2111F0B";
  const L2Bridge = "0x463b31B32417f122d25cbAF84Ff263723c11de64";

  console.log("deploying L1Bridge");

  await deploy("L1Bridge", {
    from: deployer,
    log: true,
    args: [L1Token.address, DeBridgeGate.address, L2Token, L2Bridge],
    skipIfAlreadyDeployed: true,
  });
};

module.exports.tags = ["L1Bridge"];
// module.exports.dependencies = ["L1Token", "L2Token"]
