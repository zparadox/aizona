// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AgentGenome is Ownable {
    using Strings for uint256;

    struct AgentAttributes {
        uint256 intelligence;
        uint256 creativity;
        uint256 efficiency;
        uint256 autonomy;
        uint256 specialization;
    }

    AgentAttributes public attributes;
    string public description;

    event AttributesUpdated(AgentAttributes newAttributes);
    event DescriptionUpdated(string newDescription);

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
        // Constructor logic here
    }

    function updateAttributes(
        uint256 _intelligence,
        uint256 _creativity,
        uint256 _efficiency,
        uint256 _autonomy,
        uint256 _specialization
    ) external onlyOwner {
        require(_intelligence <= 100 && _creativity <= 100 && _efficiency <= 100 && _autonomy <= 100 && _specialization <= 100, "Attribute values must be between 0 and 100");
        
        attributes = AgentAttributes(
            _intelligence,
            _creativity,
            _efficiency,
            _autonomy,
            _specialization
        );
        emit AttributesUpdated(attributes);
    }

    function updateDescription(string memory _description) external onlyOwner {
        description = _description;
        emit DescriptionUpdated(_description);
    }

    function getAttributes() external view returns (AgentAttributes memory) {
        return attributes;
    }

    function getDescription() external view returns (string memory) {
        return description;
    }

    function getGenomeString() public view returns (string memory) {
        return string(abi.encodePacked(
            attributes.intelligence.toString(),
            "-",
            attributes.creativity.toString(),
            "-",
            attributes.efficiency.toString(),
            "-",
            attributes.autonomy.toString(),
            "-",
            attributes.specialization.toString()
        ));
    }
}