// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

contract Storefront is Ownable, FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    struct ChainlinkRequestData {
        string asin;
        address seller;
    }

    event RequestSent(bytes32 requestId, ChainlinkRequestData requestData);
    event RequestFulfilled(bytes32 requestId, bytes response, bytes err);
    event AttestationMade(uint64 attestationId, Attestation attestation);
    event ProductListed(string asin, address seller, uint256 price);

    bytes32 private _chainlinkDonId;
    uint64 private _chainlinkSubscriptionId;
    uint32 private _chainlinkGasLimit = 300000; // Chainlink does not support a higher value
    string private _chainlinkSource;
    mapping(bytes32 requestId => ChainlinkRequestData requestData) _chainlinkRequests;
    ISP private _signProtocol;
    uint64 private _signProtocolSchemaId;
    mapping(string asin => address seller) _verifiedSellers;

    constructor(
        address chainlinkRouter
    ) Ownable(msg.sender) FunctionsClient(chainlinkRouter) {}

    /// ***************************
    /// ***** OWNER FUNCTIONS *****
    /// ***************************

    function setData(
        bytes32 chainlinkDonId,
        uint64 chainlinkSubscriptionId,
        string memory chainlinkSource,
        address signProtocol,
        uint64 signProtocolSchemaId
    ) external onlyOwner {
        _chainlinkDonId = chainlinkDonId;
        _chainlinkSubscriptionId = chainlinkSubscriptionId;
        _chainlinkSource = chainlinkSource;
        _signProtocol = ISP(signProtocol);
        _signProtocolSchemaId = signProtocolSchemaId;
    }

    function setChainlinkSource(
        string memory chainlinkSource
    ) external onlyOwner {
        _chainlinkSource = chainlinkSource;
    }

    function listProductWithoutVerification(
        string memory asin,
        address seller,
        uint256 price
    ) external onlyOwner {
        _makeAttestastion(asin, seller, price);
    }

    /// ***************************
    /// ***** USER FUNCTIONS ******
    /// ***************************

    function verifyProduct(
        string memory asin,
        string memory sellerAmazonToken
    ) external {
        // Define args
        string[] memory args = new string[](2);
        args[0] = asin;
        args[1] = sellerAmazonToken;
        // Define request
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(_chainlinkSource);
        req.setArgs(args);
        // Send request
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            _chainlinkSubscriptionId,
            _chainlinkGasLimit,
            _chainlinkDonId
        );
        // Save request
        ChainlinkRequestData memory requestData = ChainlinkRequestData(
            asin,
            msg.sender
        );
        _chainlinkRequests[requestId] = requestData;
        emit RequestSent(requestId, requestData);
    }

    function listProduct(string memory asin, uint256 price) external {
        require(
            _verifiedSellers[asin] == msg.sender,
            "You are not verified seller for this product"
        );
        _makeAttestastion(asin, msg.sender, price);
        emit ProductListed(asin, msg.sender, price);
    }

    /// ***************************
    /// ***** VIEW FUNCTIONS ******
    /// ***************************

    function getChainlinkData()
        external
        view
        returns (bytes32, uint64, uint32, string memory)
    {
        return (
            _chainlinkDonId,
            _chainlinkSubscriptionId,
            _chainlinkGasLimit,
            _chainlinkSource
        );
    }

    function getSignProtocolData() external view returns (address, uint64) {
        return (address(_signProtocol), _signProtocolSchemaId);
    }

    function getChainlinkRequestData(
        bytes32 requestId
    ) external view returns (ChainlinkRequestData memory) {
        return _chainlinkRequests[requestId];
    }

    function getVerifiedSeller(
        string memory asin
    ) external view returns (address) {
        return _verifiedSellers[asin];
    }

    /// *******************************
    /// ***** INTERNAL FUNCTIONS ******
    /// *******************************

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        // Emit event
        emit RequestFulfilled(requestId, response, err);
        // Save seller if he is verified
        if (keccak256(bytes(response)) == keccak256(bytes("is_seller"))) {
            ChainlinkRequestData memory requestData = _chainlinkRequests[
                requestId
            ];
            _verifiedSellers[requestData.asin] = requestData.seller;
        }
    }

    function _makeAttestastion(
        string memory asin,
        address seller,
        uint256 price
    ) private {
        // Define recipients
        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(seller);
        // Define attestation
        Attestation memory attestation = Attestation({
            schemaId: _signProtocolSchemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: abi.encode(asin, seller, price)
        });
        // Make attestation
        uint64 attestationId = _signProtocol.attest(attestation, "", "", "");
        emit AttestationMade(attestationId, attestation);
    }
}
