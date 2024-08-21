// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationGenome is Ownable {
    struct ReputationParameters {
        uint256 initialReputation;
        uint256 maxReputation;
        uint256 minReputation;
        uint256 positiveActionImpact;
        uint256 negativeActionImpact;
        uint256 decayRate;
        uint256 decayPeriod;
    }

    ReputationParameters public params;
    mapping(address => uint256) public reputationScores;
    mapping(address => uint256) public lastUpdateTime;

    event ReputationParametersUpdated(
        uint256 initialReputation,
        uint256 maxReputation,
        uint256 minReputation,
        uint256 positiveActionImpact,
        uint256 negativeActionImpact,
        uint256 decayRate,
        uint256 decayPeriod
    );
    event ReputationUpdated(address indexed user, uint256 newScore);

    constructor(
        address initialOwner,
        uint256 _initialReputation,
        uint256 _maxReputation,
        uint256 _minReputation,
        uint256 _positiveActionImpact,
        uint256 _negativeActionImpact,
        uint256 _decayRate,
        uint256 _decayPeriod
    ) {
        _transferOwnership(initialOwner);
        require(_minReputation < _initialReputation && _initialReputation < _maxReputation, "Invalid reputation range");
        params = ReputationParameters(
            _initialReputation,
            _maxReputation,
            _minReputation,
            _positiveActionImpact,
            _negativeActionImpact,
            _decayRate,
            _decayPeriod
        );
    }

    function updateReputationParameters(
        uint256 _initialReputation,
        uint256 _maxReputation,
        uint256 _minReputation,
        uint256 _positiveActionImpact,
        uint256 _negativeActionImpact,
        uint256 _decayRate,
        uint256 _decayPeriod
    ) external onlyOwner {
        require(_minReputation < _initialReputation && _initialReputation < _maxReputation, "Invalid reputation range");
        params = ReputationParameters(
            _initialReputation,
            _maxReputation,
            _minReputation,
            _positiveActionImpact,
            _negativeActionImpact,
            _decayRate,
            _decayPeriod
        );
        emit ReputationParametersUpdated(
            _initialReputation,
            _maxReputation,
            _minReputation,
            _positiveActionImpact,
            _negativeActionImpact,
            _decayRate,
            _decayPeriod
        );
    }

    function getReputationParameters() external view returns (ReputationParameters memory) {
        return params;
    }

    function getReputation(address user) public view returns (uint256) {
        if (reputationScores[user] == 0) {
            return params.initialReputation;
        }
        uint256 timePassed = block.timestamp - lastUpdateTime[user];
        uint256 decayPeriods = timePassed / params.decayPeriod;
        uint256 decayedScore = reputationScores[user] - (decayPeriods * params.decayRate);
        return decayedScore > params.minReputation ? decayedScore : params.minReputation;
    }

    function updateReputation(address user, bool isPositive) external onlyOwner {
        uint256 currentReputation = getReputation(user);
        uint256 newReputation;
        if (isPositive) {
            newReputation = currentReputation + params.positiveActionImpact;
            newReputation = newReputation > params.maxReputation ? params.maxReputation : newReputation;
        } else {
            newReputation = currentReputation > params.negativeActionImpact ? 
                currentReputation - params.negativeActionImpact : params.minReputation;
        }
        reputationScores[user] = newReputation;
        lastUpdateTime[user] = block.timestamp;
        emit ReputationUpdated(user, newReputation);
    }

    function initializeReputation(address user) external onlyOwner {
        require(reputationScores[user] == 0, "Reputation already initialized");
        reputationScores[user] = params.initialReputation;
        lastUpdateTime[user] = block.timestamp;
        emit ReputationUpdated(user, params.initialReputation);
    }

    function isReputableUser(address user, uint256 threshold) external view returns (bool) {
        return getReputation(user) >= threshold;
    }
}