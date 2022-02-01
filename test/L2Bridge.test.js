const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");

describe("L2Bridge", function () {
  before(async function () {
    const accounts = await ethers.getSigners();
    this.deployer = accounts[0];
    this.account1 = accounts[1];
    // code on L1 is not callable directly, so we take just random address
    this.l1Token = accounts[2];
    this.oracle = accounts[3];
    this.l2holder = accounts[4];
    this.minterAdmin = accounts[5];
    this.l1bridge = accounts[6];

    this.L2TokenArtifact = await ethers.getContractFactory("L2Token");
    this.L2BridgeArtifact = await ethers.getContractFactory("L2Bridge");
    this.DeBridgeGateArtifact = await ethers.getContractFactory(
      "DeBridgeGateMock"
    );
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    await expect(
      this.L2BridgeArtifact.deploy(
        constants.ZERO_ADDRESS,
        this.account1.address,
        this.account1.address
      )
    ).to.be.revertedWith("ZERO_TOKEN");
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    await expect(
      this.L2BridgeArtifact.deploy(
        this.account1.address,
        constants.ZERO_ADDRESS,
        this.account1.address
      )
    ).to.be.revertedWith("ZERO_TOKEN");
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    await expect(
      this.L2BridgeArtifact.deploy(
        this.account1.address,
        this.account1.address,
        constants.ZERO_ADDRESS
      )
    ).to.be.revertedWith("ZERO_DEBRIDGEGATE");
  });

  beforeEach(async function () {
    this.l1ChainId = 42;

    this.l2token = await this.L2TokenArtifact.deploy();
    this.l2debridgeGate = await this.DeBridgeGateArtifact.deploy();
    this.l2bridge = await this.L2BridgeArtifact.deploy(
      this.l2token.address,
      this.l1Token.address,
      this.l2debridgeGate.address
    );

    await this.l2token.grantRole(
      await this.l2token.DEFAULT_ADMIN_ROLE(),
      this.deployer.address
    );
    await this.l2bridge.grantRole(
      await this.l2bridge.DEFAULT_ADMIN_ROLE(),
      this.deployer.address
    );
    await this.l2token.grantRole(
      await this.l2token.MINTER_ROLE(),
      this.minterAdmin.address
    );
    await this.l2token.grantRole(
      await this.l2token.DEFAULT_ADMIN_ROLE(),
      this.minterAdmin.address
    );
  });

  it("should be deployed", async function () {
    expect(await this.l2bridge.deployed(), true);
    expect(await this.l2token.deployed(), true);
  });

  it("l1 token has proper name and symbol", async function () {
    expect(await this.l2token.name()).to.equal("Grizzly");
    expect(await this.l2token.symbol()).to.equal("GRZL");
  });

  describe("add controlling address to l2bridge", function () {
    beforeEach(async function () {
      // TODO replase token income test branch
      await this.l2token
        .connect(this.minterAdmin)
        .mint(this.l2holder.address, 100);

      await this.l2bridge
        .connect(this.deployer)
        .setContractAddressOnChainId(this.l1bridge.address, this.l1ChainId);

      await this.l2bridge
        .connect(this.deployer)
        .addControllingAddress(this.l1bridge.address, this.l1ChainId);
    });

    describe("approving 100 token to l2 bridge and outboundTransfer to l2 bridge", function () {
      beforeEach(async function () {
        await this.l2token
          .connect(this.l2holder)
          .approve(this.l2bridge.address, 100);
      });

      it("100 token can be outbounded to l2 bridge", async function () {
        await this.l2bridge
          .connect(this.l2holder)
          .outboundTransfer(
            this.l2holder.address,
            100,
            this.l1ChainId,
            this.l1bridge.address,
            ethers.utils.parseEther("0.01"),
            { value: ethers.utils.parseEther("0.03") }
          );
      });

      describe("outboundTransfer 100 token to l2 bridge", function () {
        beforeEach(async function () {
          this.outboundTransferTx = await this.l2bridge
            .connect(this.l2holder)
            .outboundTransfer(
              this.l2holder.address,
              100,
              this.l1ChainId,
              this.l2bridge.address,
              ethers.utils.parseEther("0.01"),
              { value: ethers.utils.parseEther("0.03") }
            );
        });

        it("check events of outboundTransferTx transacted deBridgeGate", async function () {
          const PROXY_WITH_SENDER_POSITION = 2;
          const REVERT_IF_EXTERNAL_FAIL_POSITION = 1;
          const executionFee = ethers.utils.parseEther("0.01");
          const flags =
            2 ** REVERT_IF_EXTERNAL_FAIL_POSITION +
            2 ** PROXY_WITH_SENDER_POSITION;
          const fallbackAddress = this.l2bridge.address.toLowerCase();
          //todo: use l2 bridge interface to be consistent
          const data = this.l2bridge.interface.encodeFunctionData(
            "finalizeInboundTransfer",
            [this.l2holder.address, "", 100]
          );
          await expect(this.outboundTransferTx).to.emit(
            this.l2debridgeGate,
            "Sent"
          );
          await expect(this.outboundTransferTx)
            .to.emit(this.l2debridgeGate, "Log")
            .withArgs([executionFee, flags, fallbackAddress, data]);
        });

        it("l2bridge is ownerOf 100 token", async function () {
          expect(await this.l2token.ownerOf(100)).to.equal(
            this.l2bridge.address
          );
          expect(await this.l2token.balanceOf(this.l2bridge.address)).to.equal(
            "1"
          );
        });
      });
    });
  });
});
