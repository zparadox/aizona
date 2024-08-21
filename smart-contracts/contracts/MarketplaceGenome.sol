// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarketplaceGenome is Ownable {
    struct MarketplaceParameters {
        uint256 listingFee;
        uint256 transactionFee;
        uint256 disputeResolutionTime;
        uint256 minEscrowTime;
        uint256 maxEscrowTime;
    }

    MarketplaceParameters public params;
    IERC20 public aizToken;

    event MarketplaceParametersUpdated(
        uint256 listingFee,
        uint256 transactionFee,
        uint256 disputeResolutionTime,
        uint256 minEscrowTime,
        uint256 maxEscrowTime
    );

    event TokenAddressUpdated(address newTokenAddress);

    constructor(
        address initialOwner,
        uint256 _listingFee,
        uint256 _transactionFee,
        uint256 _disputeResolutionTime,
        uint256 _minEscrowTime,
        uint256 _maxEscrowTime,
        address _aizTokenAddress
    ) {
        _transferOwnership(initialOwner);
        require(_transactionFee <= 1000, "Transaction fee must be <= 10%");
        require(_minEscrowTime < _maxEscrowTime, "Min escrow time must be less than max escrow time");
        
        params = MarketplaceParameters(
            _listingFee,
            _transactionFee,
            _disputeResolutionTime,
            _minEscrowTime,
            _maxEscrowTime
        );
        aizToken = IERC20(_aizTokenAddress);
    }

    function updateMarketplaceParameters(
        uint256 _listingFee,
        uint256 _transactionFee,
        uint256 _disputeResolutionTime,
        uint256 _minEscrowTime,
        uint256 _maxEscrowTime
    ) external onlyOwner {
        require(_transactionFee <= 1000, "Transaction fee must be <= 10%");
        require(_minEscrowTime < _maxEscrowTime, "Min escrow time must be less than max escrow time");
        
        params = MarketplaceParameters(
            _listingFee,
            _transactionFee,
            _disputeResolutionTime,
            _minEscrowTime,
            _maxEscrowTime
        );
        emit MarketplaceParametersUpdated(
            _listingFee,
            _transactionFee,
            _disputeResolutionTime,
            _minEscrowTime,
            _maxEscrowTime
        );
    }

    function updateTokenAddress(address _newTokenAddress) external onlyOwner {
        require(_newTokenAddress != address(0), "Invalid token address");
        aizToken = IERC20(_newTokenAddress);
        emit TokenAddressUpdated(_newTokenAddress);
    }

    function getMarketplaceParameters() external view returns (MarketplaceParameters memory) {
        return params;
    }

    function calculateListingFee() external view returns (uint256) {
        return params.listingFee;
    }

    function calculateTransactionFee(uint256 amount) external view returns (uint256) {
        return (amount * params.transactionFee) / 10000;
    }

    function isEscrowTimeValid(uint256 escrowTime) external view returns (bool) {
        return escrowTime >= params.minEscrowTime && escrowTime <= params.maxEscrowTime;
    }

    function getDisputeResolutionDeadline(uint256 transactionTime) external view returns (uint256) {
        return transactionTime + params.disputeResolutionTime;
    }

    function withdrawFees(uint256 amount) external onlyOwner {
        require(aizToken.transfer(owner(), amount), "Fee withdrawal failed");
    }
}