// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AttentionToken.sol";
import "./BondingCurveMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KarmaFiFactory is Ownable {
    address public feeDistributor;
    address public router;            // PancakeSwap V2 router (for graduation)
    uint256 public graduationReserve; // BNB reserve that graduates a market to PancakeSwap

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
    event GraduationConfigUpdated(address router, uint256 graduationReserve);

    constructor(
        address _feeDistributor,
        address _router,
        uint256 _graduationReserve,
        address _owner
    ) Ownable(_owner) {
        feeDistributor = _feeDistributor;
        router = _router;
        graduationReserve = _graduationReserve;
    }

    function setFeeDistributor(address _feeDistributor) external onlyOwner {
        feeDistributor = _feeDistributor;
        emit FeeDistributorUpdated(_feeDistributor);
    }

    // Update graduation config for FUTURE markets (already-deployed markets keep
    // the values they were created with).
    function setGraduationConfig(address _router, uint256 _graduationReserve) external onlyOwner {
        router = _router;
        graduationReserve = _graduationReserve;
        emit GraduationConfigUpdated(_router, _graduationReserve);
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

        // 2. Deploy BondingCurveMarket (with graduation config)
        BondingCurveMarket market = new BondingCurveMarket(
            tokenAddress,
            sourceHash,
            curator,
            feeDistributor,
            router,
            graduationReserve,
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
