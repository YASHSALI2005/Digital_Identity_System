// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Identity {
    struct Certificate {
        string hash;
        string name;
        address issuer;
        uint256 timestamp;
    }

    // Mapping from user address -> array of their certificates
    mapping(address => Certificate[]) private userCertificates;

    event CertificateAdded(address indexed user, string hash, string name, address issuer);

    // Add a document hash to a user's profile
    function addCertificate(string memory _hash, string memory _name) public {
        Certificate memory newCert = Certificate({
            hash: _hash,
            name: _name,
            issuer: msg.sender,
            timestamp: block.timestamp
        });

        userCertificates[msg.sender].push(newCert);
        emit CertificateAdded(msg.sender, _hash, _name, msg.sender);
    }

    // Retrieve all certificates for a user
    function getCertificates(address _user) public view returns (Certificate[] memory) {
        return userCertificates[_user];
    }

    // Verify if a hash exists for a given user
    function verifyCertificate(address _user, string memory _hash) public view returns (bool) {
        Certificate[] memory certs = userCertificates[_user];
        for (uint i = 0; i < certs.length; i++) {
            if (keccak256(abi.encodePacked(certs[i].hash)) == keccak256(abi.encodePacked(_hash))) {
                return true;
            }
        }
        return false;
    }
}
