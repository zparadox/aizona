// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecurityGenome is Ownable, Pausable, ReentrancyGuard {
    struct SecurityParameters {
        uint256 maxTransactionAmount;
        uint256 dailyTransactionLimit;
        uint256 suspiciousActivityThreshold;
        uint256 cooldownPeriod;
        bool multisigRequired;
        uint256 multisigThreshold;
    }

    SecurityParameters public params;
    mapping(address => uint256) public dailyTransactions;
    mapping(address => uint256) public lastTransactionTime;
    mapping(address => bool) public blacklistedAddresses;
    address[] public securityAdmins;

    event SecurityParametersUpdated(
        uint256 maxTransactionAmount,
        uint256 dailyTransactionLimit,
        uint256 suspiciousActivityThreshold,
        uint256 cooldownPeriod,
        bool multisigRequired,
        uint256 multisigThreshold
    );
    event AddressBlacklisted(address indexed blacklistedAddress);
    event AddressWhitelisted(address indexed whitelistedAddress);
    event SecurityAdminAdded(address indexed newAdmin);
    event SecurityAdminRemoved(address indexed removedAdmin);

    modifier onlySecurityAdmin() {
        require(isSecurityAdmin(msg.sender), "Caller is not a security admin");
        _;
    }

    constructor(
        uint256 _maxTransactionAmount,
        uint256 _dailyTransactionLimit,
        uint256 _suspiciousActivityThreshold,
        uint256 _cooldownPeriod,
        bool _multisigRequired,
        uint256 _multisigThreshold,
        address initialOwner
    ) {
        _transferOwnership(initialOwner);
        params = SecurityParameters(
            _maxTransactionAmount,
            _dailyTransactionLimit,
            _suspiciousActivityThreshold,
            _cooldownPeriod,
            _multisigRequired,
            _multisigThreshold
        );
        securityAdmins.push(msg.sender);
    }

    function updateSecurityParameters(
        uint256 _maxTransactionAmount,
        uint256 _dailyTransactionLimit,
        uint256 _suspiciousActivityThreshold,
        uint256 _cooldownPeriod,
        bool _multisigRequired,
        uint256 _multisigThreshold
    ) external onlyOwner {
        params = SecurityParameters(
            _maxTransactionAmount,
            _dailyTransactionLimit,
            _suspiciousActivityThreshold,
            _cooldownPeriod,
            _multisigRequired,
            _multisigThreshold
        );
        emit SecurityParametersUpdated(
            _maxTransactionAmount,
            _dailyTransactionLimit,
            _suspiciousActivityThreshold,
            _cooldownPeriod,
            _multisigRequired,
            _multisigThreshold
        );
    }

    function getSecurityParameters() external view returns (SecurityParameters memory) {
        return params;
    }

    function isTransactionAllowed(address user, uint256 amount) public view returns (bool) {
        if (blacklistedAddresses[user]) {
            return false;
        }
        if (amount > params.maxTransactionAmount) {
            return false;
        }
        uint256 userDailyTotal = dailyTransactions[user] + amount;
        if (userDailyTotal > params.dailyTransactionLimit) {
            return false;
        }
        if (block.timestamp - lastTransactionTime[user] < params.cooldownPeriod) {
            return false;
        }
        return true;
    }

    function recordTransaction(address user, uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(isTransactionAllowed(user, amount), "Transaction not allowed");
        dailyTransactions[user] = dailyTransactions[user] + amount;
        lastTransactionTime[user] = block.timestamp;
        if (dailyTransactions[user] > params.suspiciousActivityThreshold) {
            emit AddressBlacklisted(user);
            blacklistedAddresses[user] = true;
        }
    }

    function blacklistAddress(address user) external onlySecurityAdmin {
        blacklistedAddresses[user] = true;
        emit AddressBlacklisted(user);
    }

    function whitelistAddress(address user) external onlySecurityAdmin {
        blacklistedAddresses[user] = false;
        emit AddressWhitelisted(user);
    }

    function addSecurityAdmin(address newAdmin) external onlyOwner {
        require(!isSecurityAdmin(newAdmin), "Address is already a security admin");
        securityAdmins.push(newAdmin);
        emit SecurityAdminAdded(newAdmin);
    }

    function removeSecurityAdmin(address admin) external onlyOwner {
        require(isSecurityAdmin(admin), "Address is not a security admin");
        for (uint256 i = 0; i < securityAdmins.length; i++) {
            if (securityAdmins[i] == admin) {
                securityAdmins[i] = securityAdmins[securityAdmins.length - 1];
                securityAdmins.pop();
                emit SecurityAdminRemoved(admin);
                break;
            }
        }
    }

    function isSecurityAdmin(address user) public view returns (bool) {
        for (uint256 i = 0; i < securityAdmins.length; i++) {
            if (securityAdmins[i] == user) {
                return true;
            }
        }
        return false;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function resetDailyLimit(address user) external onlySecurityAdmin {
        dailyTransactions[user] = 0;
    }
}