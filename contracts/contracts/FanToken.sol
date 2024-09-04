// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FanToken is ERC20 {
    constructor() ERC20("Fan Token", "FANT") {
        _mint(msg.sender, 1000);
    }

    function mint(uint256 amount, address recipient) external {
        _mint(recipient, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
