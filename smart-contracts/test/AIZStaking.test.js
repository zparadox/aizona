const AIZToken = artifacts.require("AIZToken");
const AIZStaking = artifacts.require("AIZStaking");
const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract("AIZStaking", function (accounts) {
  const [owner, staker1, staker2] = accounts;
  const initialSupply = new BN('1000000000000000000000000000'); // 1 billion tokens
  const stakeAmount = new BN('1000000000000000000000'); // 1000 tokens

  beforeEach(async function () {
    this.token = await AIZToken.new({ from: owner });
    this.staking = await AIZStaking.new(this.token.address, { from: owner });
    
    // Transfer some tokens to stakers
    await this.token.transfer(staker1, stakeAmount.mul(new BN('10')), { from: owner });
    await this.token.transfer(staker2, stakeAmount.mul(new BN('10')), { from: owner });
    
    // Approve staking contract to spend tokens
    await this.token.approve(this.staking.address, stakeAmount.mul(new BN('10')), { from: staker1 });
    await this.token.approve(this.staking.address, stakeAmount.mul(new BN('10')), { from: staker2 });
  });

  describe("staking", function () {
    it("allows users to stake tokens", async function () {
      const receipt = await this.staking.stake(stakeAmount, { from: staker1 });
      expectEvent(receipt, 'Staked', {
        user: staker1,
        amount: stakeAmount,
      });

      const stakedBalance = await this.staking.stakedBalance(staker1);
      expect(stakedBalance).to.be.bignumber.equal(stakeAmount);
    });

    it("updates staking time when staking", async function () {
      await this.staking.stake(stakeAmount, { from: staker1 });
      const stakingTime = await this.staking.stakingTime(staker1);
      expect(stakingTime).to.be.bignumber.not.equal('0');
    });

    it("reverts when staking 0 tokens", async function () {
      await expectRevert(
        this.staking.stake('0', { from: staker1 }),
        "Cannot stake 0 tokens"
      );
    });
  });

  describe("withdrawing", function () {
    beforeEach(async function () {
      await this.staking.stake(stakeAmount, { from: staker1 });
    });

    it("allows users to withdraw staked tokens", async function () {
      const receipt = await this.staking.withdraw({ from: staker1 });
      expectEvent(receipt, 'Withdrawn', {
        user: staker1,
        amount: stakeAmount,
      });

      const stakedBalance = await this.staking.stakedBalance(staker1);
      expect(stakedBalance).to.be.bignumber.equal('0');
    });

    it("reverts when withdrawing with no staked tokens", async function () {
      await expectRevert(
        this.staking.withdraw({ from: staker2 }),
        "No tokens staked"
      );
    });
  });

  describe("rewards", function () {
    beforeEach(async function () {
      await this.staking.stake(stakeAmount, { from: staker1 });
    });

    it("calculates rewards correctly", async function () {
      await time.increase(time.duration.days(1));
      
      const reward = await this.staking.calculateReward(staker1);
      expect(reward).to.be.bignumber.not.equal('0');
    });

    it("allows users to claim rewards", async function () {
      await time.increase(time.duration.days(1));
      
      const initialBalance = await this.token.balanceOf(staker1);
      await this.staking.claimReward({ from: staker1 });
      const finalBalance = await this.token.balanceOf(staker1);
      
      expect(finalBalance).to.be.bignumber.gt(initialBalance);
    });
  });
});