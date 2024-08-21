const AIZToken = artifacts.require("AIZToken");
const AIZStaking = artifacts.require("AIZStaking");
const AIZFaucet = artifacts.require("AIZFaucet");

const BN = web3.utils.BN;
const totalSupply = new BN("1000000000000000000000000000"); // 1 billion tokens

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    // Deploy AIZToken
    const token = await AIZToken.new({ from: deployer });
    console.log("AIZ Token deployed at:", token.address);

    // Set up initial distribution
    const devPool = new BN(totalSupply).mul(new BN(30)).div(new BN(100));
    const userIncentives = new BN(totalSupply).mul(new BN(20)).div(new BN(100));
    const teamAndAdvisors = new BN(totalSupply).mul(new BN(20)).div(new BN(100));
    const marketing = new BN(totalSupply).mul(new BN(15)).div(new BN(100));
    const liquidity = new BN(totalSupply).mul(new BN(10)).div(new BN(100));
    const futureDev = new BN(totalSupply).mul(new BN(5)).div(new BN(100));

    // Transfer tokens to different pools (replace with actual addresses)
    await token.transfer(accounts[1], devPool, { from: deployer });
    await token.transfer(accounts[2], userIncentives, { from: deployer });
    await token.transfer(accounts[3], teamAndAdvisors, { from: deployer });
    await token.transfer(accounts[4], marketing, { from: deployer });
    await token.transfer(accounts[5], liquidity, { from: deployer });
    await token.transfer(accounts[6], futureDev, { from: deployer });

    // Deploy AIZStaking
    const staking = await AIZStaking.new(token.address, { from: deployer });
    console.log("AIZ Staking deployed at:", staking.address);

    // Deploy AIZFaucet
    const faucetAmount = web3.utils.toWei("10", "ether"); // 10 AIZ tokens
    const faucet = await AIZFaucet.new(token.address, faucetAmount, { from: deployer });
    console.log("AIZ Faucet deployed at:", faucet.address);

    // Transfer some tokens to the faucet
    await token.transfer(faucet.address, web3.utils.toWei("1000", "ether"), { from: deployer });

    console.log("Initial distribution completed");
    callback();
  } catch (error) {
    console.error(error);
    callback(error);
  }
};