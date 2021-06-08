const Migrations = artifacts.require("Migrations");
const ClothingNFT = artifacts.require("ClothingNFT");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ClothingNFT);
};
