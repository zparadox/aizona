// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ContributionReward is Ownable, ReentrancyGuard {
    IERC20 public immutable rewardToken;
    
    struct Contribution {
        uint256 amount;
        uint256 timestamp;
        bool rewarded;
    }

    mapping(address => Contribution[]) public contributions;
    mapping(address => uint256) public totalRewards;

    uint256 public rewardRate;
    uint256 public minContributionAmount;
    uint256 public maxContributionAmount;
    uint256 public cooldownPeriod;

    event ContributionAdded(address indexed contributor, uint256 amount, uint256 timestamp);
    event RewardClaimed(address indexed contributor, uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    event ContributionLimitsUpdated(uint256 newMin, uint256 newMax);
    event CooldownPeriodUpdated(uint256 newPeriod);

    constructor(address initialOwner, IERC20 _rewardToken) {
        _transferOwnership(initialOwner);
        rewardToken = _rewardToken;
    }

    function addContribution(uint256 _amount) external nonReentrant {
        require(_amount >= minContributionAmount && _amount <= maxContributionAmount, "Contribution amount out of range");
        require(contributions[msg.sender].length == 0 || 
                block.timestamp - contributions[msg.sender][contributions[msg.sender].length - 1].timestamp >= cooldownPeriod, 
                "Cooldown period not elapsed");

        contributions[msg.sender].push(Contribution({
            amount: _amount,
            timestamp: block.timestamp,
            rewarded: false
        }));

        emit ContributionAdded(msg.sender, _amount, block.timestamp);
    }

    function claimRewards() external nonReentrant {
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards to claim");

        for (uint256 i = 0; i < contributions[msg.sender].length; i++) {
            if (!contributions[msg.sender][i].rewarded) {
                contributions[msg.sender][i].rewarded = true;
            }
        }

        totalRewards[msg.sender] += reward;
        require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    function calculateRewards(address _contributor) public view returns (uint256) {
        uint256 reward = 0;
        for (uint256 i = 0; i < contributions[_contributor].length; i++) {
            if (!contributions[_contributor][i].rewarded) {
                reward += (contributions[_contributor][i].amount * rewardRate) / 100;
            }
        }
        return reward;
    }

    function setRewardRate(uint256 _newRate) external onlyOwner {
        rewardRate = _newRate;
        emit RewardRateUpdated(_newRate);
    }

    function setContributionLimits(uint256 _newMin, uint256 _newMax) external onlyOwner {
        require(_newMin < _newMax, "Min must be less than max");
        minContributionAmount = _newMin;
        maxContributionAmount = _newMax;
        emit ContributionLimitsUpdated(_newMin, _newMax);
    }

    function setCooldownPeriod(uint256 _newPeriod) external onlyOwner {
        cooldownPeriod = _newPeriod;
        emit CooldownPeriodUpdated(_newPeriod);
    }

    function getContributionsCount(address _contributor) external view returns (uint256) {
        return contributions[_contributor].length;
    }

    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(rewardToken.transfer(owner(), _amount), "Token withdrawal failed");
    }
}