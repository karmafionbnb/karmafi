// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

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
        require(!claimed[sourceHash], "CreatorClaimVault: Already claimed");
        pendingRewards[sourceHash] += msg.value;
        emit RewardsDeposited(sourceHash, msg.value);
    }

    function claimCreatorRewards(
        bytes32 sourceHash,
        address payable recipient,
        string calldata redditUsername
    ) external onlyOwner {
        require(!claimed[sourceHash], "CreatorClaimVault: Already claimed");
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
