const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
  shouldBehaveLikeERC721Enumerable,
} = require("./behaviors/ERC721.behavior");

const L2TokenMock = artifacts.require("L2TokenMock");

contract("L2Token : ERC721", function (accounts) {
  const name = "Grizzly";
  const symbol = "GRZL";

  beforeEach(async function () {
    this.token = await L2TokenMock.new();
  });

  shouldBehaveLikeERC721("ERC721", ...accounts);
  shouldBehaveLikeERC721Metadata("ERC721", name, symbol, ...accounts);
  shouldBehaveLikeERC721Enumerable("ERC721", ...accounts);
});
