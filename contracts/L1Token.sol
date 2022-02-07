// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title L2Token
 * @author OnBridge IO team
 **/
contract L1Token is ERC721Enumerable, AccessControl {
    using Strings for uint256;

    // If tokenId doesn't match any configured batch, defaultURI parameters are used.
    string public defaultUri;

    constructor() ERC721("Grizzly", "GRZL") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev IPFS address that stores JSON with token attributes
     * @param tokenId id of the token
     * @return string with ipfs address to json with token attribute
     * or URI for default token if token doesn`t exist
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "URI query for nonexistent token");
        tokenId %= 16;
        return
            string(
                abi.encodePacked(defaultUri, "/", tokenId.toString(), ".json")
            );
    }

    /**
     * @dev Mints a specific to the given address
     * @param to the receiver
     */
    function mint(address to) public {
        uint256 mintIndex = totalSupply();
        _safeMint(to, mintIndex);
    }

    /**
     * @dev Set defaultUri
     */
    function setDefaultUri(string memory uri)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        defaultUri = uri;
    }
}
