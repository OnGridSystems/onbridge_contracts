// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./mocks/DeBridgeGateMock.sol";

/**
 * @title Bridge Layer 1 contract
 * @dev This contract gets deployed on main network and receives and locks tokens to bridge them on L2
 * - upon `finalizeInboundTransfer` called by oracle, and releases corresponding amount of tokens back to holder
 * - upon `outboundTransfer` called by token holder to deposit token to L2
 * @author OnBridge IO
 **/

contract L1Bridge is AccessControl {
    // Original token on L1 network (Ethereum mainnet #1)
    IERC721 public l1Token;

    DeBridgeGateMock public l1DeBridgeGate;
    address public l2bridge;

    // L2 mintable + burnable token that acts as a twin of L1 asset
    // For informational purposes only
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

    constructor(IERC721 _l1Token, DeBridgeGateMock _l1DeBridgeGate, IERC721 _l2Token, address _l2bridge) {
        require(address(_l1Token) != address(0), "ZERO_TOKEN");
        require(address(_l2Token) != address(0), "ZERO_TOKEN");
        l1Token = _l1Token;
        l1DeBridgeGate = _l1DeBridgeGate;
        l2Token = _l2Token;
        l2bridge = _l2bridge;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Initiates a deposit from L1 to L2; callable by any tokenholder.
     * The token should be approved by the holder
     * @param _to L2 address of destination
     * @param _id Token id that will be bridged
     */
    function outboundTransfer(address _to, uint256 _id) external payable {
        l1Token.transferFrom(msg.sender, address(this), _id);
        uint256 chainIdTo = 97;
        bytes memory permit = "";
        uint32 referralCode = 0;
        //todo: autoParams should be calculated during contract execution
        //based on executionFee, flags, fallbackAddress, and external call data
        bytes memory autoParams;
        l1DeBridgeGate.send{value: msg.value}(address(0), msg.value, chainIdTo, abi.encodePacked(l2bridge), permit, false, referralCode, autoParams);
        emit DepositInitiated(address(l1Token), msg.sender, _to, _id);
    }

    /**
     * @notice Finalizes withdrawal initiated on L2. callable only by ORACLE_ROLE
     * @param _to L1 address of destination
     * @param _id Token id being withdrawn
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
