// SPDX-License-Identifier: GPLv3

pragma solidity ^0.8.9;

/**
 * @title DeBridgeGateMock
 * see https://docs.debridge.finance/
 */
contract DeBridgeGateMock {

    uint256 public nonce;

    struct FeeParams {
        uint256 receivedAmount;
        uint256 fixFee;
        uint256 transferFee;
        bool useAssetFee;
        bool isNativeToken;
    }

    struct SubmissionAutoParamsTo {
        uint256 executionFee;
        uint256 flags;
        bytes fallbackAddress;
        bytes data;
    }

    event Sent(
        bytes32 submissionId,
        bytes32 indexed debridgeId,
        uint256 amount,
        bytes receiver,
        uint256 nonce,
        uint256 indexed chainIdTo,
        uint32 referralCode,
        FeeParams feeParams,
        bytes autoParams,
        address nativeSender
        // bool isNativeToken //added to feeParams
    ); // emited once the native tokens are locked to be sent to the other chain

    /// @dev Locks asset on the chain and enables withdraw on the other chain.
    /// @param _tokenAddress Asset identifier.
    /// @param _amount Amount to be transfered (note: the fee can be applyed).
    /// @param _chainIdTo Chain id of the target chain.
    /// @param _receiver Receiver address.
    /// @param _permit deadline + signature for approving the spender by signature.
    /// @param _useAssetFee use assets fee for pay protocol fix (work only for specials token)
    /// @param _referralCode Referral code
    /// @param _autoParams Auto params for external call in target network
    function send(
        address _tokenAddress,
        uint256 _amount,
        uint256 _chainIdTo,
        bytes memory _receiver,
        bytes memory _permit,
        bool _useAssetFee,
        uint32 _referralCode,
        bytes calldata _autoParams
    ) external payable {
        bytes32 debridgeId;
        FeeParams memory feeParams;
        uint256 amountAfterFee;
        SubmissionAutoParamsTo memory autoParams;
        bytes32 submissionId;
        //todo: it could be useful to decode resulting autoParams here
        //to assert in tests
        //autoParams = abi.decode(_autoParams, (SubmissionAutoParamsTo));

        emit Sent(
            submissionId,
            debridgeId,
            amountAfterFee,
            _receiver,
            nonce,
            _chainIdTo,
            _referralCode,
            feeParams,
            _autoParams,
            msg.sender
        );
        nonce++;
    }
}
