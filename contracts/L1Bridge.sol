// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./BridgeAppBase.sol";
import "./forkedInterfaces/IDeBridgeGate.sol";

/**
 * @title Bridge Layer 1 contract
 * @dev This contract gets deployed on main network and receives and locks tokens to bridge them on L2
 * - upon `finalizeInboundTransfer` called by oracle, and releases corresponding amount of tokens back to holder
 * - upon `outboundTransfer` called by token holder to deposit token to L2
 * @author OnBridge IO
 **/

contract L1Bridge is BridgeAppBase {
    using Flags for uint256;

    // Original token on L1 network (Ethereum mainnet #1)
    IERC721 public l1Token;

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

    constructor(
        IERC721 _l1Token,
        IERC721 _l2Token,
        IDeBridgeGate _deBridgeGate
    ) {
        require(address(_l1Token) != address(0), "ZERO_TOKEN");
        require(address(_l2Token) != address(0), "ZERO_TOKEN");
        l1Token = _l1Token;
        l2Token = _l2Token;
        deBridgeGate = _deBridgeGate;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Initiates a deposit from L1 to L2; callable by any tokenholder.
     * The token should be approved by the holder
     * @param _to L2 address of destination
     * @param _id Token id that will be bridged
     */
    function outboundTransfer(
        address _to,
        uint256 _id,
        uint256 _chainIdTo,
        address _fallback,
        uint256 _executionFee
    ) external payable whenNotPaused {

        address contractAddressTo = chainIdToContractAddress[_chainIdTo];
        if (contractAddressTo == address(0)) {
            revert ChainToIsNotSupported();
        }

        l1Token.transferFrom(msg.sender, address(this), _id);
        emit DepositInitiated(address(l1Token), msg.sender, _to, _id);

        IDeBridgeGate.SubmissionAutoParamsTo memory autoParams;
        autoParams.flags = autoParams.flags.setFlag(Flags.REVERT_IF_EXTERNAL_FAIL, true);
        autoParams.flags = autoParams.flags.setFlag(Flags.PROXY_WITH_SENDER, true);
        autoParams.executionFee = _executionFee;
        autoParams.fallbackAddress = abi.encodePacked(_fallback);
        autoParams.data = abi.encodeWithSignature(
            "finalizeInboundTransfer(address,string,uint256)",
            _to,
            "",
            _id
        );

        deBridgeGate.send{value: msg.value}(
            address(0),
            msg.value,
            _chainIdTo,
            abi.encodePacked(contractAddressTo),
            "",
            false,
            0,
            abi.encode(autoParams)
        );
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
    ) external onlyControllingAddress whenNotPaused {
        require(_to != address(0), "NO_RECEIVER");

        l1Token.transferFrom(address(this), _to, _id);
        emit WithdrawalFinalized(address(l1Token), _l2Tx, _to, _id);
    }
}
