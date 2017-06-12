var usingProperty = artifacts.require("./usingProperty.sol");
var Congress = artifacts.require("./Congress.sol");
var Matchmaking = artifacts.require("./Matchmaking.sol");

module.exports = function(deployer) {
  return deployer.deploy(Congress).then(function () {
      return deployer.deploy(Matchmaking);
  }).then(function(){
      return deployer.deploy(usingProperty, Congress.address);
  });
};
