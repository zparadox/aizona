const AIZToken = artifacts.require("AIZToken");
const AIZFaucet = artifacts.require("AIZFaucet");
const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract("AIZFaucet", function (accounts) {
  const [owner, user1, user2] = accounts;
  const initialSupply = new BN('1000000000000000000000000000'); // 1 billion tokens
  const faucetAmount = new BN('10000000000000000000'); // 10 tokens

  beforeEach(async function () {
    this.token = await AIZToken.new({ from: owner });
    this.faucet = await AIZFaucet.new(this.token.address, faucetAmount, { from: owner });
    
    // Transfer tokens to the faucet
    await this.token.transfer(this.faucet.address, faucetAmount.mul(new BN('1000')), { from: owner });
  });

  describe("requesting tokens", function () {
    it("allows users to request tokens", async function () {
      const initialBalance = await this.token.balanceOf(user1);
      await this.faucet.requestTokens({ from: user1 });
      const finalBalance = await this.token.balanceOf(user1);
      
      expect(finalBalance).to.be.bignumber.equal(initialBalance.add(faucetAmount));
    });

    it("emits a TokensRequested event", async function () {
      const receipt = await this.faucet.requestTokens({ from: user1 });
      expectEvent(receipt, 'TokensRequested', {
        recipient: user1,
        amount: faucetAmount,
      });
    });

    it("reverts when requesting tokens too frequently", async function () {
      await this.faucet.requestTokens({ from: user1 });
      await expectRevert(
        this.faucet.requestTokens({ from: user1 }),
        "Wait 24h before requesting again"
      );
    });

    it("allows requesting tokens after 24 hours", async function () {
      await this.faucet.requestTokens({ from: user1 });
      await time.increase(time.duration.days(1));
      await this.faucet.requestTokens({ from: user1 });
      
      const balance = await this.token.balanceOf(user1);
      expect(balance).to.be.bignumber.equal(faucetAmount.mul(new BN('2')));
    });
  });

  describe("faucet management", function () {
    it("allows owner to change faucet amount", async function () {
      const newAmount = new BN('20000000000000000000'); // 20 tokens
      await this.faucet.setFaucetAmount(newAmount, { from: owner });
      expect(await this.faucet.amount()).to.be.bignumber.equal(newAmount);
    });

    it("reverts when non-owner tries to change faucet amount", async function () {
      const newAmount = new BN('20000000000000000000'); // 20 tokens
      await expectRevert(
        this.faucet.setFaucetAmount(newAmount, { from: user1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("allows owner to withdraw tokens from faucet", async function () {
      const withdrawAmount = faucetAmount.mul(new BN('100'));
      const initialBalance = await this.token.balanceOf(owner);
      await this.faucet.withdrawTokens(withdrawAmount, { from: owner });
      const finalBalance = await this.token.balanceOf(owner);
      
      expect(finalBalance).to.be.bignumber.equal(initialBalance.add(withdrawAmount));
    });

    it("reverts when withdrawing more tokens than available in faucet", async function () {
      const faucetBalance = await this.token.balanceOf(this.faucet.address);
      await expectRevert(
        this.faucet.withdrawTokens(faucetBalance.add(new BN('1')), { from: owner }),
        "Insufficient balance in faucet"
      );
    });
  });
});