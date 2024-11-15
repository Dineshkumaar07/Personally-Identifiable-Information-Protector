// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentStorage {
    
    struct Document {
        uint256 uniqueId;
        string name;               
        string cid;                 
        address uploader;           
        address[] permissions;      
    }

    mapping(address => Document[]) private userDocuments;
    
    mapping(uint256 => Document) private documentsById;

    uint256 private currentId;

    event DocumentUploaded(address indexed uploader, uint256 uniqueId, string name, string cid);

    constructor() {
        currentId = 1; 
    }

    function uploadDocument(string memory _name, string memory _cid) public {
        address[] memory permissions = new address[](1);    
        permissions[0] = msg.sender;  

        Document memory newDocument = Document({
            uniqueId: currentId,
            name: _name,
            cid: _cid,
            uploader: msg.sender,
            permissions: permissions  
        });
    
        userDocuments[msg.sender].push(newDocument);
        documentsById[currentId] = newDocument;

        emit DocumentUploaded(msg.sender, currentId, _name, _cid);

        currentId++;
    }

    function getDocumentsByUser() public view returns (Document[] memory) {
        return userDocuments[msg.sender];
    }

    function getCidByUniqueId(uint256 _uniqueId) public view returns (string memory) {
        Document storage doc = documentsById[_uniqueId];
        
        require(doc.uniqueId != 0, "Document not found with the given uniqueId.");
        return doc.cid;
    }

    function hasPermission(uint256 _uniqueId, address _user) public view returns (bool) {
        Document storage doc = documentsById[_uniqueId];

        require(doc.uniqueId != 0, "Document not found with the given uniqueId.");
        
        for (uint256 j = 0; j < doc.permissions.length; j++) {
            if (doc.permissions[j] == _user) {
                return true;
            }
        }
        return false;
    }

    function grantPermission(uint256 _uniqueId, address _user) public {
        Document storage doc = documentsById[_uniqueId];

        require(doc.uploader == msg.sender, "Only the owner can grant permission.");
        require(!hasPermission(_uniqueId, _user), "User already has permission.");
        
        doc.permissions.push(_user); 
    }

    function revokePermission(uint256 _uniqueId, address _user) public {
        Document storage doc = documentsById[_uniqueId];

        require(doc.uploader == msg.sender, "Only the owner can revoke permission.");
        require(hasPermission(_uniqueId, _user), "User does not have permission.");
        
        for (uint256 j = 0; j < doc.permissions.length; j++) {
            if (doc.permissions[j] == _user) {
                doc.permissions[j] = doc.permissions[doc.permissions.length - 1]; 
                doc.permissions.pop(); 
                return;
            }
        }
    }

    function getPermissions(uint256 _uniqueId) public view returns (address[] memory) {
        Document storage doc = documentsById[_uniqueId];

        require(doc.uniqueId != 0, "Document not found with the given uniqueId.");
        
        return doc.permissions;
    }
}
