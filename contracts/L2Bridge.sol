// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


/**
 * @dev Extension of {ERC721} that allows to mint and destroy token
 */
interface IERC721Bridged is IERC721 {
    function mint(address to, uint256 id) external;
    function burn(uint256 id) external;
}


/**
 * @title Bridge Layer 2 contract
 * @dev This contract deployed on secondary network with Bridged token contract
 * - upon `finalizeInboundTransfer` call from oracle, it mints corresponding amount of tokens on Layer 2 network
 * - upon `outboundTransfer` call from token holder it withdraws and burns L2 the requested token
 * @author OnBridge IO
 **/

contract L2Bridge is AccessControl {

    // Original token on L1 network (Ethereum mainnet #1)
    IERC721 public l1Token;

    // L2 mintable + burnable token that acts as a twin of L1 asset
    IERC721Bridged public l2Token;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    event WithdrawalInitiated(
        address l1Token,
        address indexed _from,
        address indexed _to,
        uint256 _id
    );

    event DepositFinalized(
        address indexed l1Token,
        string indexed _l1Tx,
        address indexed _to,
        uint256 _id
    );

    constructor(IERC721 _l1Token, IERC721Bridged _l2Token) {
        require(address(_l1Token) != address(0), "ZERO_TOKEN");
        require(address(_l2Token) != address(0), "ZERO_TOKEN");
        l1Token = _l1Token;
        l2Token = _l2Token;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Finalizes a deposit from L1 to L2; callable only by ORACLE_ROLE
     * @param _to L2 address of destination
     * @param _id Token id being deposited
     * @param _l1Tx Tx hash of `L1Bridge.outboundTransfer` on L1 side
     */
    function finalizeInboundTransfer(
        address _to,
        string memory _l1Tx,
        uint256 _id
    ) external onlyRole(ORACLE_ROLE) {
        require(_to != address(0), "Token cannot be the zero address");

        l2Token.mint(_to, _id);
        emit DepositFinalized(address(l1Token), _l1Tx, _to, _id);
    }

    /**
     * @notice Initiates a withdrawal from L2 to L1; callable by any tokenholder.
     * @param _to L1 address of destination
     * @param _id Token id being withdrawn
     */
    function outboundTransfer(address _to, uint256 _id) external {
        l2Token.transferFrom(msg.sender, address(this), _id);
        l2Token.burn(_id);
        emit WithdrawalInitiated(address(l1Token), msg.sender, _to, _id);
    }
}