// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IAttentionToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function totalSupply() external view returns (uint256);
}

interface IFeeDistributor {
    function distributeFees(bytes32 sourceHash, address curator) external payable;
}

interface IPancakeRouter02 {
    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity);
}

contract BondingCurveMarket is Ownable, ReentrancyGuard {
    address public tokenAddress;
    address public curatorWallet;
    bytes32 public sourceHash;
    address public feeDistributor;

    // PancakeSwap V2 graduation
    address public router;
    uint256 public graduationReserve; // BNB reserve that triggers migration
    bool public graduated;
    address public pancakePair;
    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;

    uint256 public constant INITIAL_PRICE = 1 gwei;
    uint256 public constant PRICE_MULTIPLIER = 1 gwei;
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
    event Graduated(address indexed token, uint256 bnbLiquidity, uint256 tokenLiquidity);

    modifier whenNotPaused() {
        require(!paused, "BondingCurveMarket: Contract is paused");
        _;
    }

    modifier whenNotGraduated() {
        require(!graduated, "BondingCurveMarket: graduated to PancakeSwap");
        _;
    }

    constructor(
        address _tokenAddress,
        bytes32 _sourceHash,
        address _curatorWallet,
        address _feeDistributor,
        address _router,
        uint256 _graduationReserve,
        address _owner
    ) Ownable(_owner) {
        tokenAddress = _tokenAddress;
        sourceHash = _sourceHash;
        curatorWallet = _curatorWallet;
        feeDistributor = _feeDistributor;
        router = _router;
        graduationReserve = _graduationReserve;
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

    function buy(uint256 tokenAmount, uint256 minTokensOut) external payable whenNotPaused whenNotGraduated nonReentrant {
        require(tokenAmount > 0, "BondingCurveMarket: Token amount must be greater than zero");
        require(tokenAmount >= minTokensOut, "BondingCurveMarket: Slippage limit exceeded");

        uint256 supply = IAttentionToken(tokenAddress).totalSupply();
        uint256 cost = getBuyQuote(supply, tokenAmount);
        uint256 fee = (cost * FEE_BASIS_POINTS) / 10000;
        uint256 totalCost = cost + fee;

        require(msg.value >= totalCost, "BondingCurveMarket: Insufficient BNB sent");

        IAttentionToken(tokenAddress).mint(msg.sender, tokenAmount);

        if (fee > 0 && feeDistributor != address(0)) {
            IFeeDistributor(feeDistributor).distributeFees{value: fee}(sourceHash, curatorWallet);
        }

        uint256 excess = msg.value - totalCost;
        if (excess > 0) {
            (bool success, ) = msg.sender.call{value: excess}("");
            require(success, "BondingCurveMarket: Excess refund failed");
        }

        uint256 newSupply = supply + tokenAmount;
        uint256 currentPrice = INITIAL_PRICE + (PRICE_MULTIPLIER * newSupply) / 1e18;

        emit TokenTraded(msg.sender, true, cost, tokenAmount, currentPrice, newSupply);

        // Migrate to PancakeSwap once the reserve threshold is reached.
        if (graduationReserve > 0 && router != address(0) && address(this).balance >= graduationReserve) {
            _graduate();
        }
    }

    function sell(uint256 tokenAmount, uint256 minBNBOut) external whenNotPaused whenNotGraduated nonReentrant {
        require(tokenAmount > 0, "BondingCurveMarket: Token amount must be greater than zero");

        uint256 supply = IAttentionToken(tokenAddress).totalSupply();
        require(supply >= tokenAmount, "BondingCurveMarket: Insufficient supply to sell");

        uint256 refund = getSellQuote(supply, tokenAmount);
        uint256 fee = (refund * FEE_BASIS_POINTS) / 10000;
        uint256 netRefund = refund - fee;

        require(netRefund >= minBNBOut, "BondingCurveMarket: Slippage limit exceeded");

        IAttentionToken(tokenAddress).burn(msg.sender, tokenAmount);

        if (fee > 0 && feeDistributor != address(0)) {
            IFeeDistributor(feeDistributor).distributeFees{value: fee}(sourceHash, curatorWallet);
        }

        if (netRefund > 0) {
            (bool success, ) = msg.sender.call{value: netRefund}("");
            require(success, "BondingCurveMarket: Refund payment failed");
        }

        uint256 newSupply = supply - tokenAmount;
        uint256 currentPrice = INITIAL_PRICE + (PRICE_MULTIPLIER * newSupply) / 1e18;

        emit TokenTraded(msg.sender, false, netRefund, tokenAmount, currentPrice, newSupply);
    }

    // Move the entire BNB reserve + a matching amount of freshly-minted tokens
    // into a PancakeSwap V2 pool, at the current curve price, and burn the LP so
    // liquidity is permanently locked. After this, trading happens on PancakeSwap.
    function _graduate() internal {
        graduated = true;

        uint256 bnbForLp = address(this).balance;
        uint256 supply = IAttentionToken(tokenAddress).totalSupply();
        uint256 priceWei = INITIAL_PRICE + (PRICE_MULTIPLIER * supply) / 1e18;
        uint256 tokensForLp = (bnbForLp * 1e18) / priceWei;

        IAttentionToken(tokenAddress).mint(address(this), tokensForLp);
        IAttentionToken(tokenAddress).approve(router, tokensForLp);

        IPancakeRouter02(router).addLiquidityETH{value: bnbForLp}(
            tokenAddress,
            tokensForLp,
            0,
            0,
            DEAD, // LP tokens burned -> liquidity locked forever
            block.timestamp + 600
        );

        emit Graduated(tokenAddress, bnbForLp, tokensForLp);
    }

    receive() external payable {}
}
