// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AttentionToken.sol";
import "./BondingCurveMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
