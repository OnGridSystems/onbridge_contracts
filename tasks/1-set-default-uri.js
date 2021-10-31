const { task } = require("hardhat/config");

task("1-set-default-uri", "set default uri").setAction(
  async (taskArgs, hre) => {
    const ethers = hre.ethers;

    const { deployer } = await getNamedAccounts();

    const chainId = await hre.getChainId();
    const l1TokenInstance = await ethers.getContract("L1Token");
    console.log(l1TokenInstance.address);

    if (chainId === "31337" || chainId === "1337" || chainId === "4") {
      console.log("setDefaultUri");
      await (
        await l1TokenInstance.grantRole("MINTER_ROLE", {
          from: deployer,
        })
      ).wait();
    }
  }
);
