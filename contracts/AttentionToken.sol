// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
