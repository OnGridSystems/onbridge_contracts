// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Bridge Layer 2 contract
 * @dev This contract deployed on secondary network with Bridged token contract
 * - upon `finalizeInboundTransfer` call from oracle, it mints corresponding amount of tokens on Layer 2 network
 * - upon `outboundTransfer` call from token holder it withdraws and burns L2 the requested token
 * @author OnBridge IO
 **/

contract L1Bridge is AccessControl {
    // Original token on L1 network (Ethereum mainnet #1)
    IERC721 public l1Token;

    // L2 mintable + burnable token that acts as a twin of L1 asset
    IERC721 public l2Token;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    event DepositInitiated(
        address indexed l1Token,
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );
    event WithdrawalFinalized(
        address indexed l1Token,
        string indexed _l2Tx,
        address indexed _to,
        uint256 _amount
    );

    constructor(IERC721 _l1Token, IERC721 _l2Token) {
        require(address(_l1Token) != address(0), "ZERO_TOKEN");
        require(address(_l2Token) != address(0), "ZERO_TOKEN");
        l1Token = _l1Token;
        l2Token = _l2Token;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Initiates a deposit from L1 to L2; callable by any tokenholder.
     * The amount should be approved by the holder
     * @param _to L2 address of destination
     * @param _id Token id to bridge
     */
    function outboundTransfer(address _to, uint256 _id) external {
        l1Token.transferFrom(msg.sender, address(this), _id);
        emit DepositInitiated(address(l1Token), msg.sender, _to, _id);
    }

    /**
     * @notice Finalizes withdrawal initiated on L2. callable only by ORACLE_ROLE
     * @param _to L1 address of destination
     * @param _id Token id being deposited
     * @param _l2Tx Tx hash of `L2Bridge.outboundTransfer` on L2 side
     */
    function finalizeInboundTransfer(
        address _to,
        string memory _l2Tx,
        uint256 _id
    ) external onlyRole(ORACLE_ROLE) {
        require(_to != address(0), "NO_RECEIVER");
        l1Token.transferFrom(address(this), _to, _id);
        emit WithdrawalFinalized(address(l1Token), _l2Tx, _to, _id);
    }
}
