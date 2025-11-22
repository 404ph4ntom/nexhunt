import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  const BountyEscrow = await ethers.getContractFactory('BountyEscrow');
  const escrow = await BountyEscrow.deploy(deployer.address);

  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log('BountyEscrow deployed to:', address);

  // Grant PAYOUT_ROLE to additional addresses if needed
  // const PAYOUT_ROLE = await escrow.PAYOUT_ROLE();
  // await escrow.grantRole(PAYOUT_ROLE, '0x...');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

