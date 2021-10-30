const { expect } = require("chai")
const {
    constants,
  } = require('@openzeppelin/test-helpers');

describe("L2Bridge", function () {
  before(async function () {
    const accounts = await ethers.getSigners()
    this.owner = accounts[0]
    this.account1 = accounts[1]
    // code on L1 is not callable directly, so we take just random address
    this.l1Token = accounts[2]
    this.oracle = accounts[3]
    this.holder = accounts[4]
    
    this.L2TokenArtifact = await ethers.getContractFactory("L2Token");
    this.L2BridgeArtifact = await ethers.getContractFactory("L2Bridge");
})

it("revert then trying finalizeInboundTransfer to zero address", async function () {
  await expect(this.L2BridgeArtifact.deploy(constants.ZERO_ADDRESS, this.token.address)).to.be.revertedWith("ZERO_TOKEN");
})

it("revert then trying finalizeInboundTransfer to zero address", async function () {
  await expect(this.L2BridgeArtifact.deploy(this.l1Token.address, constants.ZERO_ADDRESS)).to.be.revertedWith("ZERO_TOKEN");
})

beforeEach(async function () {
    this.token = await this.L2TokenArtifact.deploy()
    this.bridge = await this.L2BridgeArtifact.deploy(this.l1Token.address, this.token.address)
    const MINTER_ROLE = await this.token.MINTER_ROLE()
    await this.token.grantRole(MINTER_ROLE, this.bridge.address)
    const ORACLE_ROLE = await this.bridge.ORACLE_ROLE()
    await this.bridge.grantRole(ORACLE_ROLE, this.oracle.address)
  })

  it("should be deployed", async function () {
    expect(await this.bridge.deployed(), true)
    expect(await this.token.deployed(), true)
  })

  it("l1 token has proper name and symbol", async function () {
    expect(await this.token.name()).to.equal("L2Token")
    expect(await this.token.symbol()).to.equal("")
  })

  it("revert then trying finalizeInboundTransfer to zero address", async function () {
    const l1Tx = "0x117ddadadc7b8d342cf48513fef06a2cba15dfb9c488dc51aefc998abcefb52b"
      await expect(this.bridge
          .connect(this.oracle)
          .finalizeInboundTransfer(constants.ZERO_ADDRESS, l1Tx, "1")).to.be.revertedWith(
              "Token cannot be the zero address"
          )
  })

  describe("oracle calls finalizeInboundTransfer", function () {
    const l1Tx = "0x117ddadadc7b8d342cf48513fef06a2cba15dfb9c488dc51aefc998abcefb52b"
    beforeEach(async function () {
      await this.bridge
        .connect(this.oracle)
        .finalizeInboundTransfer(this.holder.address, l1Tx, "1")
    })

    it("l2token supply increased", async function () {
      expect(await this.token.totalSupply()).to.equal("1")
    })

    it("l2token balance of holder increased", async function () {
      expect(await this.token.balanceOf(this.holder.address)).to.equal("1")
    })

    describe("token goes back to L1 (holder calls outboundTransfer)", function () {
      beforeEach(async function () {
        await this.token.connect(this.holder).approve(this.bridge.address, "1")
        await this.bridge.connect(this.holder).outboundTransfer(this.holder.address, "1")
      })

      it("l2token supply decreased", async function () {
        expect(await this.token.totalSupply()).to.equal("0")
      })

      it("l2token balance of holder decreased", async function () {
        expect(await this.token.balanceOf(this.holder.address)).to.equal("0")
      })
    })
  })
})