// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// KarmaFi — combined deploy file for Remix. Paste into one .sol file.
// OpenZeppelin imports auto-resolve from npm in Remix.

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// ====================== AttentionToken ======================


contract AttentionToken is ERC20, Ownable {
    string public metadataURI;
    address public bondingCurve;
    bool public bondingCurveSet;

    modifier onlyBondingCurve() {
        require(msg.sender == bondingCurve, "AttentionToken: only bonding curve can mint/burn");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        string memory _metadataURI,
        address _owner
    ) ERC20(name, symbol) Ownable(_owner) {
        metadataURI = _metadataURI;
    }

    function setBondingCurve(address _bondingCurve) external onlyOwner {
        require(!bondingCurveSet, "AttentionToken: bonding curve already set");
        bondingCurve = _bondingCurve;
        bondingCurveSet = true;
    }

    function mint(address to, uint256 amount) external onlyBondingCurve {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyBondingCurve {
        _burn(from, amount);
    }
}

// ====================== BondingCurveMarket ======================


interface IAttentionToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function currentSupply() external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

interface IFeeDistributor {
    function distributeFees(bytes32 sourceHash, address curator) external payable;
}

contract BondingCurveMarket is Ownable, ReentrancyGuard {
    address public tokenAddress;
    address public curatorWallet;
    bytes32 public sourceHash;
    address public feeDistributor;
    
    uint256 public constant INITIAL_PRICE = 1 gwei; // 1 Gwei
    uint256 public constant PRICE_MULTIPLIER = 1 gwei; // 1 Gwei increase per token
    uint256 public constant FEE_BASIS_POINTS = 100; // 1% fee

    bool public paused;

    event TokenTraded(
        address indexed trader,
        bool indexed isBuy,
        uint256 bnbAmount,
        uint256 tokenAmount,
        uint256 currentPrice,
        uint256 currentSupply
    );
    event MarketPaused(bool paused);

    modifier whenNotPaused() {
        require(!paused, "BondingCurveMarket: Contract is paused");
        _;
    }

    constructor(
        address _tokenAddress,
        bytes32 _sourceHash,
        address _curatorWallet,
        address _feeDistributor,
        address _owner
    ) Ownable(_owner) {
        tokenAddress = _tokenAddress;
        sourceHash = _sourceHash;
        curatorWallet = _curatorWallet;
        feeDistributor = _feeDistributor;
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit MarketPaused(_paused);
    }

    function getBuyQuote(uint256 currentSupply, uint256 tokenAmount) public pure returns (uint256) {
        uint256 averagePrice = INITIAL_PRICE + (PRICE_MULTIPLIER * (currentSupply + tokenAmount / 2)) / 1e18;
        return (tokenAmount * averagePrice) / 1e18;
    }

    function getSellQuote(uint256 currentSupply, uint256 tokenAmount) public pure returns (uint256) {
        require(currentSupply >= tokenAmount, "BondingCurveMarket: Insufficient supply");
        uint256 averagePrice = INITIAL_PRICE + (PRICE_MULTIPLIER * (currentSupply - tokenAmount / 2)) / 1e18;
        return (tokenAmount * averagePrice) / 1e18;
    }

    function buy(uint256 tokenAmount, uint256 minTokensOut) external payable whenNotPaused nonReentrant {
        require(tokenAmount > 0, "BondingCurveMarket: Token amount must be greater than zero");
        require(tokenAmount >= minTokensOut, "BondingCurveMarket: Slippage limit exceeded");

        uint256 supply = IAttentionToken(tokenAddress).totalSupply();
        uint256 cost = getBuyQuote(supply, tokenAmount);
        uint256 fee = (cost * FEE_BASIS_POINTS) / 10000;
        uint256 totalCost = cost + fee;

        require(msg.value >= totalCost, "BondingCurveMarket: Insufficient BNB sent");

        // Mint tokens to user
        IAttentionToken(tokenAddress).mint(msg.sender, tokenAmount);

        // Distribute fee
        if (fee > 0 && feeDistributor != address(0)) {
            IFeeDistributor(feeDistributor).distributeFees{value: fee}(sourceHash, curatorWallet);
        }

        // Return excess BNB
        uint256 excess = msg.value - totalCost;
        if (excess > 0) {
            (bool success, ) = msg.sender.call{value: excess}("");
            require(success, "BondingCurveMarket: Excess refund failed");
        }

        uint256 newSupply = supply + tokenAmount;
        uint256 currentPrice = INITIAL_PRICE + (PRICE_MULTIPLIER * newSupply) / 1e18;

        emit TokenTraded(msg.sender, true, cost, tokenAmount, currentPrice, newSupply);
    }

    function sell(uint256 tokenAmount, uint256 minBNBOut) external whenNotPaused nonReentrant {
        require(tokenAmount > 0, "BondingCurveMarket: Token amount must be greater than zero");

        uint256 supply = IAttentionToken(tokenAddress).totalSupply();
        require(supply >= tokenAmount, "BondingCurveMarket: Insufficient supply to sell");

        uint256 refund = getSellQuote(supply, tokenAmount);
        uint256 fee = (refund * FEE_BASIS_POINTS) / 10000;
        uint256 netRefund = refund - fee;

        require(netRefund >= minBNBOut, "BondingCurveMarket: Slippage limit exceeded");

        // Burn tokens from user
        IAttentionToken(tokenAddress).burn(msg.sender, tokenAmount);

        // Distribute fee
        if (fee > 0 && feeDistributor != address(0)) {
            IFeeDistributor(feeDistributor).distributeFees{value: fee}(sourceHash, curatorWallet);
        }

        // Pay refund to user
        if (netRefund > 0) {
            (bool success, ) = msg.sender.call{value: netRefund}("");
            require(success, "BondingCurveMarket: Refund payment failed");
        }

        uint256 newSupply = supply - tokenAmount;
        uint256 currentPrice = INITIAL_PRICE + (PRICE_MULTIPLIER * newSupply) / 1e18;

        emit TokenTraded(msg.sender, false, netRefund, tokenAmount, currentPrice, newSupply);
    }

    receive() external payable {}
}

// ====================== CreatorClaimVault ======================


contract CreatorClaimVault is Ownable {
    address public feeDistributor;
    
    mapping(bytes32 => uint256) public pendingRewards;
    mapping(bytes32 => bool) public claimed;
    mapping(bytes32 => address) public claimedBy;
    mapping(bytes32 => string) public claimedByRedditUsername;

    event RewardsDeposited(bytes32 indexed sourceHash, uint256 amount);
    event RewardsClaimed(bytes32 indexed sourceHash, address indexed recipient, string redditUsername, uint256 amount);

    modifier onlyFeeDistributor() {
        require(msg.sender == feeDistributor, "CreatorClaimVault: Only fee distributor");
        _;
    }

    constructor(address _owner) Ownable(_owner) {}

    function setFeeDistributor(address _feeDistributor) external onlyOwner {
        feeDistributor = _feeDistributor;
    }

    function depositCreatorRewards(bytes32 sourceHash) external payable onlyFeeDistributor {
        // Must never revert: this is called on every trade's fee split. Rewards
        // keep accruing even after a prior claim so trading never deadlocks.
        pendingRewards[sourceHash] += msg.value;
        emit RewardsDeposited(sourceHash, msg.value);
    }

    function claimCreatorRewards(
        bytes32 sourceHash,
        address payable recipient,
        string calldata redditUsername
    ) external onlyOwner {
        // Allow repeat claims of newly-accrued rewards; `claimed` tracks whether
        // a recipient has ever been verified for this post.
        uint256 amount = pendingRewards[sourceHash];
        require(amount > 0, "CreatorClaimVault: No rewards pending");

        claimed[sourceHash] = true;
        claimedBy[sourceHash] = recipient;
        claimedByRedditUsername[sourceHash] = redditUsername;
        pendingRewards[sourceHash] = 0;

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "CreatorClaimVault: Payment failed");

        emit RewardsClaimed(sourceHash, recipient, redditUsername, amount);
    }
}

// ====================== FeeDistributor ======================


interface ICreatorClaimVault {
    function depositCreatorRewards(bytes32 sourceHash) external payable;
}

contract FeeDistributor is Ownable {
    address public creatorClaimVault;
    address public platformTreasury;
    address public liquidityReserve;
    address public safetyFund;

    event FeesDistributed(
        bytes32 indexed sourceHash,
        address indexed curator,
        uint256 totalAmount,
        uint256 creatorShare,
        uint256 curatorShare,
        uint256 treasuryShare,
        uint256 liquidityShare,
        uint256 safetyShare
    );

    constructor(
        address _creatorClaimVault,
        address _platformTreasury,
        address _liquidityReserve,
        address _safetyFund,
        address _owner
    ) Ownable(_owner) {
        creatorClaimVault = _creatorClaimVault;
        platformTreasury = _platformTreasury;
        liquidityReserve = _liquidityReserve;
        safetyFund = _safetyFund;
    }

    function setAddresses(
        address _creatorClaimVault,
        address _platformTreasury,
        address _liquidityReserve,
        address _safetyFund
    ) external onlyOwner {
        creatorClaimVault = _creatorClaimVault;
        platformTreasury = _platformTreasury;
        liquidityReserve = _liquidityReserve;
        safetyFund = _safetyFund;
    }

    function distributeFees(bytes32 sourceHash, address curator) external payable {
        uint256 amount = msg.value;
        require(amount > 0, "FeeDistributor: Amount must be greater than zero");

        uint256 creatorShare = (amount * 30) / 100;
        uint256 curatorShare = (amount * 25) / 100;
        uint256 treasuryShare = (amount * 25) / 100;
        uint256 liquidityShare = (amount * 15) / 100;
        // Remaining is safety share to prevent rounding dust loss
        uint256 safetyShare = amount - (creatorShare + curatorShare + treasuryShare + liquidityShare);

        // Deposit creator share to the vault
        if (creatorShare > 0 && creatorClaimVault != address(0)) {
            ICreatorClaimVault(creatorClaimVault).depositCreatorRewards{value: creatorShare}(sourceHash);
        }

        // Send curator share
        if (curatorShare > 0 && curator != address(0)) {
            (bool success, ) = payable(curator).call{value: curatorShare}("");
            require(success, "FeeDistributor: Curator payment failed");
        }

        // Send treasury share
        if (treasuryShare > 0 && platformTreasury != address(0)) {
            (bool success, ) = payable(platformTreasury).call{value: treasuryShare}("");
            require(success, "FeeDistributor: Treasury payment failed");
        }

        // Send liquidity share
        if (liquidityShare > 0 && liquidityReserve != address(0)) {
            (bool success, ) = payable(liquidityReserve).call{value: liquidityShare}("");
            require(success, "FeeDistributor: Liquidity payment failed");
        }

        // Send safety/moderation share
        if (safetyShare > 0 && safetyFund != address(0)) {
            (bool success, ) = payable(safetyFund).call{value: safetyShare}("");
            require(success, "FeeDistributor: Safety payment failed");
        }

        emit FeesDistributed(
            sourceHash,
            curator,
            amount,
            creatorShare,
            curatorShare,
            treasuryShare,
            liquidityShare,
            safetyShare
        );
    }

    receive() external payable {}
}

// ====================== KarmaFiFactory ======================


contract KarmaFiFactory is Ownable {
    address public feeDistributor;
    
    mapping(bytes32 => address) public getMarketByHash;
    mapping(address => address) public getMarketByToken;
    address[] public allMarkets;

    event MarketCreated(
        bytes32 indexed sourceHash,
        address indexed tokenAddress,
        address indexed marketAddress,
        address curator,
        string name,
        string symbol
    );
    event FeeDistributorUpdated(address newFeeDistributor);

    constructor(address _feeDistributor, address _owner) Ownable(_owner) {
        feeDistributor = _feeDistributor;
    }

    function setFeeDistributor(address _feeDistributor) external onlyOwner {
        feeDistributor = _feeDistributor;
        emit FeeDistributorUpdated(_feeDistributor);
    }

    function allMarketsLength() external view returns (uint256) {
        return allMarkets.length;
    }

    function createMarket(
        bytes32 sourceHash,
        string calldata metadataURI,
        string calldata name,
        string calldata symbol,
        address curator
    ) external returns (address tokenAddress, address marketAddress) {
        require(getMarketByHash[sourceHash] == address(0), "KarmaFiFactory: Market already exists for this post");
        require(feeDistributor != address(0), "KarmaFiFactory: Fee distributor not set");

        // 1. Deploy AttentionToken (Initial owner is the factory itself, temporarily)
        AttentionToken token = new AttentionToken(name, symbol, metadataURI, address(this));
        tokenAddress = address(token);

        // 2. Deploy BondingCurveMarket
        BondingCurveMarket market = new BondingCurveMarket(
            tokenAddress,
            sourceHash,
            curator,
            feeDistributor,
            owner()
        );
        marketAddress = address(market);

        // 3. Link them: transfer token control to the bonding curve market
        token.setBondingCurve(marketAddress);
        token.transferOwnership(owner()); // Set owner of the token contract to the platform owner

        // 4. Update registry
        getMarketByHash[sourceHash] = marketAddress;
        getMarketByToken[tokenAddress] = marketAddress;
        allMarkets.push(marketAddress);

        emit MarketCreated(sourceHash, tokenAddress, marketAddress, curator, name, symbol);
    }
}

