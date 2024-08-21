// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIZFaucet {
    IERC20 public token;
    uint256 public amount;
    mapping(address => uint256) public lastAccessTime;

    constructor(IERC20 _token, uint256 _amount) {
        token = _token;
        amount = _amount;
    }

    function requestTokens() external {
        require(block.timestamp - lastAccessTime[msg.sender] >= 1 days, "Wait 24h before requesting again");
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance in faucet");
        
        lastAccessTime[msg.sender] = block.timestamp;
        token.transfer(msg.sender, amount);
    }
}