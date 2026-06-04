const { expect } = require("chai");
const { ethers } = require("hardhat");

const ZeroAddress = "0x0000000000000000000000000000000000000000";

describe("KarmaFi Protocol", function () {
  let owner;
  let curator;
  let trader;
  let creatorRecipient;
  let platformTreasury;
  let liquidityReserve;
  let safetyFund;

  let creatorClaimVault;
  let feeDistributor;
  let factory;

  beforeEach(async function () {
    [
      owner,
      curator,
      trader,
      creatorRecipient,
      platformTreasury,
      liquidityReserve,
      safetyFund,
    ] = await ethers.getSigners();

    // 1. Deploy CreatorClaimVault
    const CreatorClaimVault = await ethers.getContractFactory("CreatorClaimVault");
    creatorClaimVault = await CreatorClaimVault.deploy(owner.address);

    // 2. Deploy FeeDistributor
    const FeeDistributor = await ethers.getContractFactory("FeeDistributor");
    feeDistributor = await FeeDistributor.deploy(
      await creatorClaimVault.getAddress(),
      platformTreasury.address,
      liquidityReserve.address,
      safetyFund.address,
      owner.address
    );

    // 3. Configure FeeDistributor on CreatorClaimVault
    await creatorClaimVault.setFeeDistributor(await feeDistributor.getAddress());

    // 4. Deploy KarmaFiFactory
    const KarmaFiFactory = await ethers.getContractFactory("KarmaFiFactory");
    factory = await KarmaFiFactory.deploy(await feeDistributor.getAddress(), owner.address);
  });

  it("Should execute complete market lifecycle: deploy, buy, sell, distribute fees, claim rewards, prevent duplicates", async function () {
    const sourceHash = ethers.keccak256(ethers.toUtf8Bytes("https://reddit.com/r/pics/comments/12345/awesome_photo/"));
    const metadataURI = "ipfs://QmMockMetadataHash";
    const tokenName = "Awesome Photo Token";
    const tokenSymbol = "AWESOME";

    // 1. Create Market
    const tx = await factory.createMarket(
      sourceHash,
      metadataURI,
      tokenName,
      tokenSymbol,
      curator.address
    );
    const receipt = await tx.wait();

    // Find MarketCreated event
    const event = receipt.logs
      .map((log) => {
        try {
          return factory.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((parsedLog) => parsedLog && parsedLog.name === "MarketCreated");

    expect(event).to.not.be.null;
    const tokenAddress = event.args.tokenAddress;
    const marketAddress = event.args.marketAddress;

    expect(tokenAddress).to.not.equal(ZeroAddress);
    expect(marketAddress).to.not.equal(ZeroAddress);

    // Get contracts instance
    const token = await ethers.getContractAt("AttentionToken", tokenAddress);
    const market = await ethers.getContractAt("BondingCurveMarket", marketAddress);

    expect(await token.name()).to.equal(tokenName);
    expect(await token.symbol()).to.equal(tokenSymbol);
    expect(await token.bondingCurve()).to.equal(marketAddress);

    // 2. Prevent duplicate market creation
    await expect(
      factory.createMarket(
        sourceHash,
        metadataURI,
        tokenName,
        tokenSymbol,
        curator.address
      )
    ).to.be.revertedWith("KarmaFiFactory: Market already exists for this post");

    // 3. Get Buy Quote and Trade
    const tokenAmount = ethers.parseEther("1000"); // 1000 tokens
    const buyQuote = await market.getBuyQuote(0, tokenAmount);
    const fee = (buyQuote * 100n) / 10000n; // 1% fee
    const totalCost = buyQuote + fee;

    // Perform buy trade
    const curatorInitialBalance = await ethers.provider.getBalance(curator.address);
    const treasuryInitialBalance = await ethers.provider.getBalance(platformTreasury.address);
    
    await market.connect(trader).buy(tokenAmount, tokenAmount, { value: totalCost });

    // Verify trader received tokens
    expect(await token.balanceOf(trader.address)).to.equal(tokenAmount);

    // Verify fees were routed correctly:
    // Creator Vault receives 30% of fee
    const creatorVaultBalance = await ethers.provider.getBalance(await creatorClaimVault.getAddress());
    expect(creatorVaultBalance).to.equal((fee * 30n) / 100n);

    // Curator receives 25% of fee
    const curatorFinalBalance = await ethers.provider.getBalance(curator.address);
    expect(curatorFinalBalance - curatorInitialBalance).to.equal((fee * 25n) / 100n);

    // Treasury receives 25% of fee
    const treasuryFinalBalance = await ethers.provider.getBalance(platformTreasury.address);
    expect(treasuryFinalBalance - treasuryInitialBalance).to.equal((fee * 25n) / 100n);

    // 4. Perform Sell Trade
    const sellQuote = await market.getSellQuote(tokenAmount, tokenAmount);
    const sellFee = (sellQuote * 100n) / 10000n;
    const netRefund = sellQuote - sellFee;

    // Approve tokens first
    await token.connect(trader).approve(marketAddress, tokenAmount);

    const traderInitialBalance = await ethers.provider.getBalance(trader.address);
    
    // Execute sell
    await market.connect(trader).sell(tokenAmount, netRefund);

    // Verify trader burned tokens
    expect(await token.balanceOf(trader.address)).to.equal(0);
    const traderFinalBalance = await ethers.provider.getBalance(trader.address);
    // Net refund should increase trader's balance (less gas)
    expect(traderFinalBalance).to.be.gt(traderInitialBalance);

    // 5. Creator Claims Rewards from Vault
    const pendingRewards = await creatorClaimVault.pendingRewards(sourceHash);
    expect(pendingRewards).to.be.gt(0);

    const recipientInitialBalance = await ethers.provider.getBalance(creatorRecipient.address);
    
    // Claim rewards
    await creatorClaimVault.claimCreatorRewards(sourceHash, creatorRecipient.address, "u/redditCurator");

    // Verify rewards are marked claimed
    expect(await creatorClaimVault.claimed(sourceHash)).to.be.true;
    expect(await creatorClaimVault.claimedBy(sourceHash)).to.equal(creatorRecipient.address);
    expect(await creatorClaimVault.claimedByRedditUsername(sourceHash)).to.equal("u/redditCurator");
    expect(await creatorClaimVault.pendingRewards(sourceHash)).to.equal(0);

    // Verify recipient received rewards
    const recipientFinalBalance = await ethers.provider.getBalance(creatorRecipient.address);
    expect(recipientFinalBalance - recipientInitialBalance).to.equal(pendingRewards);
  });
});
