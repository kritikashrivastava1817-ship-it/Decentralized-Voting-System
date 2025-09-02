// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Decentralized Voting System
 * @dev A smart contract for conducting transparent and secure voting
 * @author Blockchain Developer
 */
contract Project {
    
    // Structure to represent a candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        bool exists;
    }
    
    // Structure to represent a voter
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
    }
    
    // State variables
    address public owner;
    string public votingTitle;
    bool public votingActive;
    uint256 public votingStartTime;
    uint256 public votingEndTime;
    uint256 public totalVotes;
    uint256 public candidateCount;
    
    // Mappings
    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;
    
    // Events
    event VoterRegistered(address indexed voter);
    event VoteCasted(address indexed voter, uint256 candidateId);
    event CandidateAdded(uint256 candidateId, string name);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded(uint256 endTime);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        require(block.timestamp >= votingStartTime && block.timestamp <= votingEndTime, "Voting period has ended or not started");
        _;
    }
    
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "You are not registered to vote");
        _;
    }
    
    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }
    
    constructor(string memory _votingTitle) {
        owner = msg.sender;
        votingTitle = _votingTitle;
        votingActive = false;
        totalVotes = 0;
        candidateCount = 0;
    }
    
    /**
     * @dev Core Function 1: Register a voter
     * @param _voterAddress Address of the voter to register
     */
    function registerVoter(address _voterAddress) external onlyOwner {
        require(!voters[_voterAddress].isRegistered, "Voter is already registered");
        require(_voterAddress != address(0), "Invalid voter address");
        
        voters[_voterAddress] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedCandidateId: 0
        });
        
        emit VoterRegistered(_voterAddress);
    }
    
    /**
     * @dev Core Function 2: Cast a vote for a candidate
     * @param _candidateId ID of the candidate to vote for
     */
    function castVote(uint256 _candidateId) external votingIsActive onlyRegisteredVoter hasNotVoted {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        // Update voter status
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        
        // Update candidate vote count
        candidates[_candidateId].voteCount++;
        
        // Update total votes
        totalVotes++;
        
        emit VoteCasted(msg.sender, _candidateId);
    }
    
    /**
     * @dev Core Function 3: Get voting results and winner
     * @return winnerName Name of the winning candidate
     * @return winnerVotes Number of votes received by winner
     * @return totalVotesCast Total number of votes cast
     */
    function getResults() external view returns (string memory winnerName, uint256 winnerVotes, uint256 totalVotesCast) {
        require(!votingActive || block.timestamp > votingEndTime, "Voting is still active");
        
        uint256 maxVotes = 0;
        uint256 winnerId = 0;
        
        // Find candidate with maximum votes
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
        
        if (winnerId > 0) {
            winnerName = candidates[winnerId].name;
            winnerVotes = maxVotes;
        } else {
            winnerName = "No votes cast";
            winnerVotes = 0;
        }
        
        totalVotesCast = totalVotes;
    }
    
    // Additional helper functions
    
    /**
     * @dev Add a new candidate (only owner)
     * @param _name Name of the candidate
     */
    function addCandidate(string memory _name) external onlyOwner {
        require(!votingActive, "Cannot add candidates during active voting");
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidateCount++;
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            voteCount: 0,
            exists: true
        });
        
        emit CandidateAdded(candidateCount, _name);
    }
    
    /**
     * @dev Start the voting process
     * @param _durationInMinutes Duration of voting in minutes
     */
    function startVoting(uint256 _durationInMinutes) external onlyOwner {
        require(!votingActive, "Voting is already active");
        require(candidateCount >= 2, "At least 2 candidates required");
        require(_durationInMinutes > 0, "Duration must be greater than 0");
        
        votingActive = true;
        votingStartTime = block.timestamp;
        votingEndTime = block.timestamp + (_durationInMinutes * 1 minutes);
        
        emit VotingStarted(votingStartTime, votingEndTime);
    }
    
    /**
     * @dev End the voting process manually (only owner)
     */
    function endVoting() external onlyOwner {
        require(votingActive, "Voting is not active");
        
        votingActive = false;
        votingEndTime = block.timestamp;
        
        emit VotingEnded(votingEndTime);
    }
    
    /**
     * @dev Get candidate information
     * @param _candidateId ID of the candidate
     * @return name Name of the candidate
     * @return voteCount Number of votes received
     */
    function getCandidate(uint256 _candidateId) external view returns (string memory name, uint256 voteCount) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }
    
    /**
     * @dev Get voter information
     * @param _voterAddress Address of the voter
     * @return isRegistered Whether the voter is registered
     * @return hasVoted Whether the voter has voted
     */
    function getVoterInfo(address _voterAddress) external view returns (bool isRegistered, bool hasVoted) {
        Voter memory voter = voters[_voterAddress];
        return (voter.isRegistered, voter.hasVoted);
    }
    
    /**
     * @dev Get voting status and timing information
     * @return active Whether voting is currently active
     * @return startTime Voting start timestamp
     * @return endTime Voting end timestamp
     * @return currentTime Current block timestamp
     */
    function getVotingStatus() external view returns (bool active, uint256 startTime, uint256 endTime, uint256 currentTime) {
        return (votingActive, votingStartTime, votingEndTime, block.timestamp);
    }
}
