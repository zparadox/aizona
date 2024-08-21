// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TokenGenome {
    struct TokenAttributes {
        uint256 totalSupply;
        uint256 initialDistribution;
        uint256 inflationRate;
        uint256 stakingRewards;
        uint256 burnMechanism;
        uint256 transactionFees;
    }

    TokenAttributes public attributes;
    address public owner;

    event AttributesUpdated(TokenAttributes newAttributes);

    constructor(
        uint256 _totalSupply,
        uint256 _initialDistribution,
        uint256 _inflationRate,
        uint256 _stakingRewards,
        uint256 _burnMechanism,
        uint256 _transactionFees
    ) {
        owner = msg.sender;
        attributes = TokenAttributes(
            _totalSupply,
            _initialDistribution,
            _inflationRate,
            _stakingRewards,
            _burnMechanism,
            _transactionFees
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function updateAttributes(
        uint256 _totalSupply,
        uint256 _initialDistribution,
        uint256 _inflationRate,
        uint256 _stakingRewards,
        uint256 _burnMechanism,
        uint256 _transactionFees
    ) external onlyOwner {
        attributes = TokenAttributes(
            _totalSupply,
            _initialDistribution,
            _inflationRate,
            _stakingRewards,
            _burnMechanism,
            _transactionFees
        );
        emit AttributesUpdated(attributes);
    }

    function getAttributes() external view returns (TokenAttributes memory) {
        return attributes;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }
}