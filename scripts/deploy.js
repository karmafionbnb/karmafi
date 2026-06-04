const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy CreatorClaimVault
  const CreatorClaimVault = await hre.ethers.getContractFactory("CreatorClaimVault");
  const vault = await CreatorClaimVault.deploy(deployer.address);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("CreatorClaimVault deployed to:", vaultAddress);

  // 2. Deploy FeeDistributor
  // Mock platforms addresses set to deployer address for test setup
  const FeeDistributor = await hre.ethers.getContractFactory("FeeDistributor");
  const distributor = await FeeDistributor.deploy(
    vaultAddress,
    deployer.address, // Treasury wallet
    deployer.address, // Liquidity reserve
    deployer.address, // Safety fund
    deployer.address  // Owner
  );
  await distributor.waitForDeployment();
  const distributorAddress = await distributor.getAddress();
  console.log("FeeDistributor deployed to:", distributorAddress);

  // 3. Configure distributor on CreatorClaimVault
  await vault.setFeeDistributor(distributorAddress);
  console.log("Linked FeeDistributor to CreatorClaimVault");

  // 4. Deploy KarmaFiFactory
  const KarmaFiFactory = await hre.ethers.getContractFactory("KarmaFiFactory");
  const factory = await KarmaFiFactory.deploy(distributorAddress, deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("KarmaFiFactory deployed to:", factoryAddress);

  console.log("Deployment complete! Registry configuration summary:");
  console.log({
    CreatorClaimVault: vaultAddress,
    FeeDistributor: distributorAddress,
    KarmaFiFactory: factoryAddress
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
