import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('BountyEscrow', function () {
  let escrow: any;
  let owner: any;
  let hunter: any;
  let token: any;

  beforeEach(async function () {
    [owner, hunter] = await ethers.getSigners();

    const BountyEscrow = await ethers.getContractFactory('BountyEscrow');
    escrow = await BountyEscrow.deploy(owner.address);

    // Deploy a mock ERC20 token for testing
    const MockERC20 = await ethers.getContractFactory('MockERC20');
    token = await MockERC20.deploy('Test Token', 'TEST');
  });

  describe('Deployment', function () {
    it('Should set the correct admin', async function () {
      const ADMIN_ROLE = await escrow.DEFAULT_ADMIN_ROLE();
      expect(await escrow.hasRole(ADMIN_ROLE, owner.address)).to.equal(true);
    });
  });

  describe('Payouts', function () {
    it('Should create and execute ETH payout', async function () {
      // Deposit ETH
      await escrow.deposit({ value: ethers.parseEther('1.0') });

      // Create payout
      const tx = await escrow.createPayout(
        hunter.address,
        ethers.ZeroAddress,
        ethers.parseEther('0.5'),
        'report-123'
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === 'PayoutCreated');
      const payoutId = event.args.payoutId;

      // Execute payout
      await escrow.executePayout(payoutId);

      expect(await ethers.provider.getBalance(hunter.address)).to.be.greaterThan(0);
      expect(await escrow.totalPaid(hunter.address)).to.equal(ethers.parseEther('0.5'));
    });

    it('Should create and execute token payout', async function () {
      // Mint tokens
      await token.mint(owner.address, ethers.parseEther('1000'));
      await token.approve(escrow.target, ethers.parseEther('1000'));

      // Deposit tokens
      await escrow.depositToken(token.target, ethers.parseEther('100'));

      // Create payout
      const tx = await escrow.createPayout(
        hunter.address,
        token.target,
        ethers.parseEther('50'),
        'report-456'
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => log.eventName === 'PayoutCreated');
      const payoutId = event.args.payoutId;

      // Execute payout
      await escrow.executePayout(payoutId);

      expect(await token.balanceOf(hunter.address)).to.equal(ethers.parseEther('50'));
    });
  });
});

