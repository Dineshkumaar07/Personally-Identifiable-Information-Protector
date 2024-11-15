const DocumentManager = artifacts.require("DocumentStorage");
module.exports = function(deployer){
    deployer.deploy(DocumentManager)
}