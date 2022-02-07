const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("L1Token", function () {
  before(async function () {
    const accounts = await ethers.getSigners();
    this.provider = ethers.getDefaultProvider();
    this.deployer = accounts[0];
    this.other = accounts[1];
    this.grantedAdmin = accounts[2];
    this.L1TokenArtifact = await ethers.getContractFactory("L1Token");
  });

  beforeEach(async function () {
    this.l1token = await this.L1TokenArtifact.deploy();
  });

  it("setDefaultUri reverts if called by wrong role", async function () {
    await expect(
      this.l1token
        .connect(this.provider)
        .setDefaultUri("ipfs://ipfs/defaultUri")
    ).to.be.reverted;
  });

  it("tokenURI reverts if requested URI query for nonexistent token", async function () {
    await expect(this.l1token.connect(this.provider).tokenURI(1)).to.be
      .reverted;
  });

  describe("grant admin role", function () {
    beforeEach(async function () {
      await this.l1token.grantRole(
        await this.l1token.DEFAULT_ADMIN_ROLE(),
        this.grantedAdmin.address
      );
    });

    it("tokenURI reverts if requested URI query for nonexistent token", async function () {
      await expect(this.l1token.connect(this.provider).tokenURI(1)).to.be
        .reverted;
    });

    it("totalSupply equal 0", async function () {
      expect(
        await this.l1token.connect(this.grantedAdmin).totalSupply()
      ).to.be.equal(0);
    });

    describe("mint first token", function () {
      beforeEach(async function () {
        await this.l1token.connect(this.grantedAdmin).mint(this.other.address);
      });

      it("zero token has tokenURI '/0.json' after its mint", async function () {
        expect(
          await this.l1token.connect(this.grantedAdmin).tokenURI(0)
        ).to.be.equal("/0.json");
      });

      describe("set default uri", function () {
        beforeEach(async function () {
          await this.l1token.setDefaultUri("URI");
        });

        it("zero token has tokenURI 'URI/0.json' after its mint", async function () {
          expect(
            await this.l1token.connect(this.grantedAdmin).tokenURI(0)
          ).to.be.equal("URI/0.json");
          await expect(
            this.l1token.connect(this.grantedAdmin).tokenURI(1)
          ).to.be.revertedWith("URI query for nonexistent token");
        });
      });
    });
  });

  describe("with granted DEFAULT_ADMIN_ROLE", function () {
    beforeEach(async function () {
      await this.l1token.grantRole(
        await this.l1token.DEFAULT_ADMIN_ROLE(),
        this.grantedAdmin.address
      );
    });

    it("setDefaultUri succeeds and fails after revocation", async function () {
      await this.l1token
        .connect(this.grantedAdmin)
        .setDefaultUri("ipfs://ipfs/newURI");
      await this.l1token.revokeRole(
        await this.l1token.DEFAULT_ADMIN_ROLE(),
        this.grantedAdmin.address
      );
      await expect(
        this.l1token
          .connect(this.grantedAdmin)
          .setDefaultUri("ipfs://ipfs/newestURI")
      ).to.be.reverted;
    });
  });
});
