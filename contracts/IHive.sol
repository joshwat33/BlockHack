// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract IHive {
    mapping(string => bool) public ideas;

    event IdeaAdded(string idea, address indexed sender);

    // Add a new idea if it does not exist
    function addIdea(string memory _idea) public payable {
        require(msg.value > 0, "You need to send some Ether");
        require(!ideas[_idea], "Idea already exists");

        ideas[_idea] = true;
        emit IdeaAdded(_idea, msg.sender);
    }

    // Check if the idea exists
    function ideaExists(string memory _idea) public view returns (bool) {
        return ideas[_idea];
    }
}
