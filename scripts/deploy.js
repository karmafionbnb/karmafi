const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Deploys the KarmaFi contract suite to the configured network.
// Fee-recipient wallets are read from env so mainnet routes real fees to real
// addresses; each falls back to the deployer if unset (fine for testnet).
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const net = hre.network.name;
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Network: ${net}`);
  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "BNB");

  const treasury = process.env.TREASURY_WALLET || deployer.address;
  const liquidity = process.env.LIQUIDITY_WALLET || deployer.address;
  const safety = process.env.SAFETY_WALLET || deployer.address;

  // 1. CreatorClaimVault
  const CreatorClaimVault = await hre.ethers.getContractFactory("CreatorClaimVault");
  const vault = await CreatorClaimVault.deploy(deployer.address);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("CreatorClaimVault:", vaultAddress);

  // 2. FeeDistributor
  const FeeDistributor = await hre.ethers.getContractFactory("FeeDistributor");
  const distributor = await FeeDistributor.deploy(
    vaultAddress,
    treasury,
    liquidity,
    safety,
    deployer.address // owner
  );
  await distributor.waitForDeployment();
  const distributorAddress = await distributor.getAddress();
  console.log("FeeDistributor:", distributorAddress);

  // 3. Link distributor to the vault
  const linkTx = await vault.setFeeDistributor(distributorAddress);
  await linkTx.wait();
  console.log("Linked FeeDistributor -> CreatorClaimVault");

  // 4. KarmaFiFactory
  const KarmaFiFactory = await hre.ethers.getContractFactory("KarmaFiFactory");
  const factory = await KarmaFiFactory.deploy(distributorAddress, deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("KarmaFiFactory:", factoryAddress);

  const deployment = {
    network: net,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    treasury,
    liquidity,
    safety,
    contracts: {
      CreatorClaimVault: vaultAddress,
      FeeDistributor: distributorAddress,
      KarmaFiFactory: factoryAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  // Persist so the frontend / API can read the live addresses.
  const outDir = path.join(__dirname, "..", "src", "lib", "web3");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, `deployment.${net}.json`),
    JSON.stringify(deployment, null, 2)
  );

  console.log("\nDeployment complete. Saved to src/lib/web3/deployment." + net + ".json");
  console.log(deployment.contracts);
  console.log("\nNext: add these to your env as NEXT_PUBLIC_FACTORY_ADDRESS etc., and verify with:");
  console.log(`  npx hardhat verify --network ${net} ${factoryAddress} ${distributorAddress} ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
