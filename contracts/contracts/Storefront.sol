// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

contract Storefront is Ownable {
    event AttestationMade(uint64 attestationId);

    ISP private _signProtocol;
    uint64 private _signProtocolSchemaId;

    constructor(
        address signProtocol,
        uint64 signProtocolSchemaId
    ) Ownable(msg.sender) {
        _signProtocol = ISP(signProtocol);
        _signProtocolSchemaId = signProtocolSchemaId;
    }

    // TODO: Implement
    function listProduct() external {
        // Verify seller and product using API and Chainlink
    }

    function listProductWithoutVerification(
        string memory asin,
        address seller,
        uint256 price
    ) external onlyOwner {
        _makeAttestastion(asin, seller, price);
    }

    function getSignProtocol() external view returns (address) {
        return address(_signProtocol);
    }

    function getSignProtocolSchemaId() external view returns (uint64) {
        return _signProtocolSchemaId;
    }

    function _makeAttestastion(
        string memory asin,
        address seller,
        uint256 price
    ) private {
        // Define recipients
        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(msg.sender);
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
        emit AttestationMade(attestationId);
    }
}
