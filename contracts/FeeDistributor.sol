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

        // M-01: distribution is best-effort and MUST NOT revert — otherwise a
        // recipient (e.g. a curator contract) that rejects BNB would brick every
        // trade. A failed transfer simply leaves that share in this contract,
        // recoverable by the owner via rescue().

        // Deposit creator share to the vault (low-level so a vault revert can't
        // brick trading either).
        if (creatorShare > 0 && creatorClaimVault != address(0)) {
            (bool ok, ) = creatorClaimVault.call{value: creatorShare}(
                abi.encodeWithSignature("depositCreatorRewards(bytes32)", sourceHash)
            );
            if (!ok) { /* share retained for rescue */ }
        }

        if (curatorShare > 0 && curator != address(0)) {
            (bool ok, ) = payable(curator).call{value: curatorShare}("");
            if (!ok) { /* retained */ }
        }
        if (treasuryShare > 0 && platformTreasury != address(0)) {
            (bool ok, ) = payable(platformTreasury).call{value: treasuryShare}("");
            if (!ok) { /* retained */ }
        }
        if (liquidityShare > 0 && liquidityReserve != address(0)) {
            (bool ok, ) = payable(liquidityReserve).call{value: liquidityShare}("");
            if (!ok) { /* retained */ }
        }
        if (safetyShare > 0 && safetyFund != address(0)) {
            (bool ok, ) = payable(safetyFund).call{value: safetyShare}("");
            if (!ok) { /* retained */ }
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

    // L-03: recover any BNB left in the contract (failed transfers / stray sends).
    function rescue(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "FeeDistributor: zero address");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "FeeDistributor: rescue failed");
    }

    receive() external payable {}
}
