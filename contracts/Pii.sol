// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Pii {
    struct Document {
        string name;
        string cid;
    }

    mapping(address => Document[]) private documents;

    function insertDocument(string memory name, string memory cid) public {
        documents[msg.sender].push(Document(name, cid));
    }

    function getDocuments() public view returns (Document[] memory) {
        return documents[msg.sender];
    }

    function getDocumentByName(address user, string memory name) public view returns (string memory) {
        Document[] memory userDocuments = documents[user];
        
        for (uint i = 0; i < userDocuments.length; i++) {
            if (keccak256(abi.encodePacked(userDocuments[i].name)) == keccak256(abi.encodePacked(name))) {
                return userDocuments[i].cid;
            }
        }
        return "";
    }
}
