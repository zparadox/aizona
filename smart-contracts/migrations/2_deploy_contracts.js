const AIZToken = artifacts.require("AIZToken");
const AIZStaking = artifacts.require("AIZStaking");
const AIZFaucet = artifacts.require("AIZFaucet");

module.exports = async function(deployer, network, accounts) {
  // Deploy AIZToken
  await deployer.deploy(AIZToken);
  const token = await AIZToken.deployed();

  // Deploy AIZStaking
  await deployer.deploy(AIZStaking, token.address);

  // Deploy AIZFaucet
  const faucetAmount = web3.utils.toWei("10", "ether");
  await deployer.deploy(AIZFaucet, token.address, faucetAmount);

  // Transfer tokens to faucet
  const faucet = await AIZFaucet.deployed();
  await token.transfer(faucet.address, web3.utils.toWei("1000", "ether"));
};