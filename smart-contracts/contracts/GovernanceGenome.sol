// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GovernanceGenome is Ownable {
    struct GovernanceParameters {
        uint256 proposalThreshold;
        uint256 quorumPercentage;
        uint256 votingPeriod;
        uint256 executionDelay;
        uint256 votingWeight;
    }

    GovernanceParameters public params;

    event GovernanceParametersUpdated(
        uint256 proposalThreshold,
        uint256 quorumPercentage,
        uint256 votingPeriod,
        uint256 executionDelay,
        uint256 votingWeight
    );

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
        // Constructor logic here
    }

    function updateGovernanceParameters(
        uint256 _proposalThreshold,
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        uint256 _executionDelay,
        uint256 _votingWeight
    ) external onlyOwner {
        require(_quorumPercentage <= 100, "Quorum percentage must be <= 100");
        params = GovernanceParameters(
            _proposalThreshold,
            _quorumPercentage,
            _votingPeriod,
            _executionDelay,
            _votingWeight
        );
        emit GovernanceParametersUpdated(
            _proposalThreshold,
            _quorumPercentage,
            _votingPeriod,
            _executionDelay,
            _votingWeight
        );
    }

    function getGovernanceParameters() external view returns (GovernanceParameters memory) {
        return params;
    }

    function calculateVotingPower(uint256 tokenBalance) external view returns (uint256) {
        return (tokenBalance * params.votingWeight) / 100;
    }

    function isProposalValid(uint256 proposerBalance) external view returns (bool) {
        return proposerBalance >= params.proposalThreshold;
    }

    function hasReachedQuorum(uint256 totalVotes, uint256 totalSupply) external view returns (bool) {
        return (totalVotes * 100) >= (totalSupply * params.quorumPercentage);
    }

    function getExecutionTime(uint256 proposalEndTime) external view returns (uint256) {
        return proposalEndTime + params.executionDelay;
    }
}