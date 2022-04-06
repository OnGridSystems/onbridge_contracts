// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./BridgeAppBase.sol";
import "./forkedInterfaces/IDeBridgeGate.sol";

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

contract L2Bridge is BridgeAppBase {
    using Flags for uint256;

    // Original token on L2network (Ethereum mainnet #1)
    IERC721Bridged public l2Token;

    event WithdrawalInitiated(
        address l2Token,
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

    constructor(
        IERC721Bridged _l2Token,
        IDeBridgeGate _deBridgeGate
    ) {
        require(address(_l2Token) != address(0), "ZERO_TOKEN");
        require(address(_deBridgeGate) != address(0), "ZERO_DEBRIDGEGATE");
        l2Token = _l2Token;
        deBridgeGate = _deBridgeGate;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Finalizes a deposit from L1 to L2
     * @param _to L2 address of destination
     * @param _id Token id being deposited
     * @param _l1Tx Tx hash of `L1Bridge.outboundTransfer` on L1 side
     */
    function finalizeInboundTransfer(
        address _to,
        string memory _l1Tx,
        uint256 _id
    ) external onlyControllingAddress whenNotPaused {
        require(_to != address(0), "Token cannot be the zero address");

        l2Token.mint(_to, _id);
        emit DepositFinalized(address(l2Token), _l1Tx, _to, _id);
    }

    /**
     * @notice Initiates a withdrawal from L2 to L1; callable by any tokenholder.
     * @param _to L1 address of destination
     * @param _id Token id being withdrawn
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

        l2Token.transferFrom(msg.sender, address(this), _id);
        l2Token.burn(_id);
        emit WithdrawalInitiated(address(l2Token), msg.sender, _to, _id);

        IDeBridgeGate.SubmissionAutoParamsTo memory autoParams;
        autoParams.flags = autoParams.flags.setFlag(
            Flags.REVERT_IF_EXTERNAL_FAIL,
            true
        );
        autoParams.flags = autoParams.flags.setFlag(
            Flags.PROXY_WITH_SENDER,
            true
        );
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
}
