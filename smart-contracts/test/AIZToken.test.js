const AIZToken = artifacts.require("AIZToken");
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract("AIZToken", function (accounts) {
  const [owner, recipient, spender] = accounts;
  const initialSupply = new BN('1000000000000000000000000000'); // 1 billion tokens

  beforeEach(async function () {
    this.token = await AIZToken.new({ from: owner });
  });

  describe("token attributes", function () {
    it("has the correct name", async function () {
      expect(await this.token.name()).to.equal("AI Zona Token");
    });

    it("has the correct symbol", async function () {
      expect(await this.token.symbol()).to.equal("AIZ");
    });

    it("has 18 decimals", async function () {
      expect(await this.token.decimals()).to.be.bignumber.equal('18');
    });

    it("has the correct initial supply", async function () {
      const totalSupply = await this.token.totalSupply();
      expect(totalSupply).to.be.bignumber.equal(initialSupply);
    });

    it("assigns the initial total supply to the owner", async function () {
      const ownerBalance = await this.token.balanceOf(owner);
      expect(ownerBalance).to.be.bignumber.equal(initialSupply);
    });
  });

  describe("token transfers", function () {
    it("allows token transfer", async function () {
      const amount = new BN('1000');
      const initialOwnerBalance = await this.token.balanceOf(owner);
      
      const receipt = await this.token.transfer(recipient, amount, { from: owner });
      expectEvent(receipt, 'Transfer', {
        from: owner,
        to: recipient,
        value: amount,
      });

      const finalOwnerBalance = await this.token.balanceOf(owner);
      expect(finalOwnerBalance).to.be.bignumber.equal(initialOwnerBalance.sub(amount));
      
      const recipientBalance = await this.token.balanceOf(recipient);
      expect(recipientBalance).to.be.bignumber.equal(amount);
    });

    it("reverts when transferring tokens to the zero address", async function () {
      await expectRevert(
        this.token.transfer(constants.ZERO_ADDRESS, new BN('1000'), { from: owner }),
        'ERC20: transfer to the zero address'
      );
    });

    it("reverts when transferring more tokens than available balance", async function () {
      const balance = await this.token.balanceOf(owner);
      await expectRevert(
        this.token.transfer(recipient, balance.add(new BN('1')), { from: owner }),
        'ERC20: transfer amount exceeds balance'
      );
    });
  });

  describe("token burning", function () {
    it("allows token burning", async function () {
      const amount = new BN('1000');
      const initialBalance = await this.token.balanceOf(owner);
      const initialSupply = await this.token.totalSupply();

      const receipt = await this.token.burn(amount, { from: owner });
      expectEvent(receipt, 'Transfer', {
        from: owner,
        to: constants.ZERO_ADDRESS,
        value: amount,
      });

      const finalBalance = await this.token.balanceOf(owner);
      expect(finalBalance).to.be.bignumber.equal(initialBalance.sub(amount));

      const finalSupply = await this.token.totalSupply();
      expect(finalSupply).to.be.bignumber.equal(initialSupply.sub(amount));
    });

    it("reverts when burning more tokens than available balance", async function () {
      const balance = await this.token.balanceOf(owner);
      await expectRevert(
        this.token.burn(balance.add(new BN('1')), { from: owner }),
        'ERC20: burn amount exceeds balance'
      );
    });
  });

  describe("pausing functionality", function () {
    it("allows pausing and unpausing", async function () {
      const pauseReceipt = await this.token.pause({ from: owner });
      expectEvent(pauseReceipt, 'Paused', { account: owner });
      expect(await this.token.paused()).to.equal(true);

      await expectRevert(
        this.token.transfer(recipient, new BN('1000'), { from: owner }),
        'Pausable: paused'
      );

      const unpauseReceipt = await this.token.unpause({ from: owner });
      expectEvent(unpauseReceipt, 'Unpaused', { account: owner });
      expect(await this.token.paused()).to.equal(false);

      await this.token.transfer(recipient, new BN('1000'), { from: owner });
      expect(await this.token.balanceOf(recipient)).to.be.bignumber.equal(new BN('1000'));
    });

    it("only allows the owner to pause and unpause", async function () {
      await expectRevert(
        this.token.pause({ from: recipient }),
        'Ownable: caller is not the owner'
      );

      await this.token.pause({ from: owner });

      await expectRevert(
        this.token.unpause({ from: recipient }),
        'Ownable: caller is not the owner'
      );
    });
  });

  describe("approve and transferFrom functionality", function () {
    const amount = new BN('1000');

    beforeEach(async function () {
      await this.token.approve(spender, amount, { from: owner });
    });

    it("allows approved spender to transfer tokens", async function () {
      const receipt = await this.token.transferFrom(owner, recipient, amount, { from: spender });
      expectEvent(receipt, 'Transfer', {
        from: owner,
        to: recipient,
        value: amount,
      });

      const recipientBalance = await this.token.balanceOf(recipient);
      expect(recipientBalance).to.be.bignumber.equal(amount);

      const spenderAllowance = await this.token.allowance(owner, spender);
      expect(spenderAllowance).to.be.bignumber.equal('0');
    });

    it("reverts when transferring more than approved amount", async function () {
      await expectRevert(
        this.token.transferFrom(owner, recipient, amount.add(new BN('1')), { from: spender }),
        'ERC20: insufficient allowance'
      );
    });
  });
});