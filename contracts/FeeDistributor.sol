// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

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
