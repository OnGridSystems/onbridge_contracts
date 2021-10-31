const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");

describe("L2Bridge", function () {
  before(async function () {
    const accounts = await ethers.getSigners();
    this.owner = accounts[0];
    this.account1 = accounts[1];
    // code on L1 is not callable directly, so we take just random address
    this.l1Token = accounts[2];
    this.oracle = accounts[3];
    this.l2holder = accounts[4];
    this.minterAdmin = accounts[5];

    this.L2TokenArtifact = await ethers.getContractFactory("L2Token");
    this.L2BridgeArtifact = await ethers.getContractFactory("L2Bridge");
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    await expect(
      this.L2BridgeArtifact.deploy(constants.ZERO_ADDRESS, this.l2token.address)
    ).to.be.revertedWith("ZERO_TOKEN");
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    await expect(
      this.L2BridgeArtifact.deploy(this.l1Token.address, constants.ZERO_ADDRESS)
    ).to.be.revertedWith("ZERO_TOKEN");
  });

  beforeEach(async function () {
    this.l2token = await this.L2TokenArtifact.deploy();
    this.l2bridge = await this.L2BridgeArtifact.deploy(
      this.l1Token.address,
      this.l2token.address
    );
    const MINTER_ROLE = await this.l2token.MINTER_ROLE();
    await this.l2token.grantRole(MINTER_ROLE, this.minterAdmin.address);
    await this.l2token.grantRole(MINTER_ROLE, this.l2bridge.address);
    const ORACLE_ROLE = await this.l2bridge.ORACLE_ROLE();
    await this.l2bridge.grantRole(ORACLE_ROLE, this.oracle.address);
  });

  it("should be deployed", async function () {
    expect(await this.l2bridge.deployed(), true);
    expect(await this.l2token.deployed(), true);
  });

  it("l1 token has proper name and symbol", async function () {
    expect(await this.l2token.name()).to.equal("L2Token");
    expect(await this.l2token.symbol()).to.equal("");
  });

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    const l1Tx =
      "0x117ddadadc7b8d342cf48513fef06a2cba15dfb9c488dc51aefc998abcefb52b";
    await expect(
      this.l2bridge
        .connect(this.oracle)
        .finalizeInboundTransfer(constants.ZERO_ADDRESS, l1Tx, "1")
    ).to.be.revertedWith("Token cannot be the zero address");
  });

  describe("oracle calls finalizeInboundTransfer", function () {
    const l1Tx =
      "0x117ddadadc7b8d342cf48513fef06a2cba15dfb9c488dc51aefc998abcefb52b";
    beforeEach(async function () {
      await this.l2bridge
        .connect(this.oracle)
        .finalizeInboundTransfer(this.l2holder.address, l1Tx, "100");
    });

    it("l2token supply increased", async function () {
      expect(await this.l2token.totalSupply()).to.equal("1");
    });

    it("l2token balance of holder increased", async function () {
      expect(await this.l2token.balanceOf(this.l2holder.address)).to.equal("1");
    });

    it("l2holder is 100 token owner", async function () {
      await expect(
        this.l2token.connect(this.minterAdmin).mint(this.l2holder.address, 100)
      ).to.be.revertedWith("ERC721: token already minted");
      expect(await this.l2token.ownerOf(100)).to.equal(this.l2holder.address);
    });

    describe("oracle calls finalizeInboundTransfer", function () {
      const l1Tx =
        "0x117ddadadc7b8d342cf48513fef06a2cba15dfb9c488dc51aefc998abcefb52b";
      beforeEach(async function () {
        await this.l2bridge
          .connect(this.oracle)
          .finalizeInboundTransfer(this.l2holder.address, l1Tx, "200");
      });

      it("l2bridge can`t burn a token that the l2holder does not own", async function () {
        await expect(
          this.l2bridge
            .connect(this.l2holder)
            .outboundTransfer(this.l2holder.address, "200")
        ).to.be.revertedWith(
          "ERC721: transfer caller is not owner nor approved"
        );
      });
    });

    describe("token goes back to L1 (holder calls outboundTransfer)", function () {
      beforeEach(async function () {
        await this.l2token
          .connect(this.l2holder)
          .approve(this.l2bridge.address, "100");
        await this.l2bridge
          .connect(this.l2holder)
          .outboundTransfer(this.l2holder.address, "100");
      });

      it("l2token supply decreased", async function () {
        expect(await this.l2token.totalSupply()).to.equal("0");
      });

      it("l2token balance of holder decreased", async function () {
        expect(await this.l2token.balanceOf(this.l2holder.address)).to.equal(
          "0"
        );
      });
    });
  });
});
