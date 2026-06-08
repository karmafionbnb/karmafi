// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IMigrationManager {
    function migrateToDex(address tokenAddress) external payable returns (address poolAddress);
    function isEligibleForMigration(address tokenAddress) external view returns (bool);
}

contract MigrationManager is IMigrationManager, Ownable {
    mapping(address => bool) public migrated;
    mapping(address => address) public tokenPools;

    event Migrated(address indexed token, address indexed pool, uint256 bnbAmount, uint256 tokenAmount);

    constructor(address _owner) Ownable(_owner) {}

    function isEligibleForMigration(address /*tokenAddress*/) external pure override returns (bool) {
        // Placeholder check: for MVP, returns true for simulation purposes
        return true;
    }

    function migrateToDex(address tokenAddress) external payable override onlyOwner returns (address poolAddress) {
        require(!migrated[tokenAddress], "MigrationManager: already migrated");
        
        migrated[tokenAddress] = true;
        // Mock pool address
        poolAddress = address(uint160(uint256(keccak256(abi.encodePacked(tokenAddress, block.timestamp)))));
        tokenPools[tokenAddress] = poolAddress;

        emit Migrated(tokenAddress, poolAddress, msg.value, msg.value * 1000);
        return poolAddress;
    }

    // L-02: allow the owner to recover BNB held by this contract.
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "MigrationManager: zero address");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "MigrationManager: withdraw failed");
    }

    receive() external payable {}
}
