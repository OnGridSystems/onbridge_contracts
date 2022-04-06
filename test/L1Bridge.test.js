const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");

describe("L1Bridge", function () {
  before(async function () {
    const accounts = await ethers.getSigners();
    this.deployer = accounts[0];
    this.account1 = accounts[1];
    // code on L1 is not callable directly, so we take just random address
    this.l2Token = accounts[2];
    this.oracle = accounts[3];
    this.l1holder = accounts[4];
    this.minterAdmin = accounts[5];
    this.l2bridge = accounts[6];

    this.L1TokenArtifact = await ethers.getContractFactory("L1Token");
    this.L1BridgeArtifact = await ethers.getContractFactory("L1Bridge");
    this.DeBridgeGateArtifact = await ethers.getContractFactory(
      "DeBridgeGateMock"
    );
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    await expect(
      this.L1BridgeArtifact.deploy(
        constants.ZERO_ADDRESS,
        this.account1.address
      )
    ).to.be.revertedWith("ZERO_TOKEN");
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    await expect(
      this.L1BridgeArtifact.deploy(
        this.account1.address,
        constants.ZERO_ADDRESS
      )
    ).to.be.revertedWith("ZERO_DEBRIDGEGATE");
  });

  beforeEach(async function () {
    this.l2ChainId = 97;

    this.l1token = await this.L1TokenArtifact.deploy();
    this.l1debridgeGate = await this.DeBridgeGateArtifact.deploy();
    this.l1bridge = await this.L1BridgeArtifact.deploy(
      this.l1token.address,
      this.l1debridgeGate.address
    );

    await this.l1token.grantRole(
      await this.l1token.DEFAULT_ADMIN_ROLE(),
      this.deployer.address
    );
    await this.l1bridge.grantRole(
      await this.l1bridge.DEFAULT_ADMIN_ROLE(),
      this.deployer.address
    );
    await this.l1token.grantRole(
      await this.l1token.DEFAULT_ADMIN_ROLE(),
      this.minterAdmin.address
    );
  });

  it("should be deployed", async function () {
    expect(await this.l1bridge.deployed(), true);
    expect(await this.l1token.deployed(), true);
  });

  it("l1 token has proper name and symbol", async function () {
    expect(await this.l1token.name()).to.equal("Grizzly");
    expect(await this.l1token.symbol()).to.equal("GRZL");
  });

  it("bridge has zero balance", async function () {
    expect(await this.l1token.balanceOf(this.l1bridge.address)).to.equal("0");
  });

  describe("after token deposited(first holder)", function () {
    beforeEach(async function () {
      await this.l1token
        .connect(this.minterAdmin)
        .mint(this.l1holder.address);
    });

    it("token balance moved from holder to bridge", async function () {
      expect(await this.l1token.balanceOf(this.l1holder.address)).to.equal("1");
    });

    describe("add controlling address to l1bridge", function () {
      beforeEach(async function () {
        await this.l1bridge
          .connect(this.deployer)
          .setContractAddressOnChainId(this.l2bridge.address, this.l2ChainId);

        await this.l1bridge
          .connect(this.deployer)
          .addControllingAddress(this.l2bridge.address, this.l2ChainId);
      });

      describe("approving token id 0 to l1 bridge and outboundTransfer to l2 bridge", function () {
        beforeEach(async function () {
          await this.l1token
            .connect(this.l1holder)
            .approve(this.l1bridge.address, 0);
        });

        it("token id 0 can be outbounded to l2 bridge", async function () {
          await this.l1bridge
            .connect(this.l1holder)
            .outboundTransfer(
              this.l1holder.address,
              0,
              this.l2ChainId,
              this.l2bridge.address,
              ethers.utils.parseEther("0.01"),
              { value: ethers.utils.parseEther("0.03") }
            );
        });

        describe("outboundTransfer token id 0 to l2 bridge", function () {
          beforeEach(async function () {
            this.outboundTransferTx = await this.l1bridge
              .connect(this.l1holder)
              .outboundTransfer(
                this.l1holder.address,
                0,
                this.l2ChainId,
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
            const data = this.l1bridge.interface.encodeFunctionData(
              "finalizeInboundTransfer",
              [this.l1holder.address, "", 0]
            );
            await expect(this.outboundTransferTx).to.emit(
              this.l1debridgeGate,
              "Sent"
            );
            await expect(this.outboundTransferTx)
              .to.emit(this.l1debridgeGate, "Log")
              .withArgs([executionFee, flags, fallbackAddress, data]);
          });

          it("l1bridge is ownerOf token id 0", async function () {
            expect(await this.l1token.ownerOf(0)).to.equal(
              this.l1bridge.address
            );
            expect(
              await this.l1token.balanceOf(this.l1bridge.address)
            ).to.equal("1");
          });
        });
      });
    });
  });
});
