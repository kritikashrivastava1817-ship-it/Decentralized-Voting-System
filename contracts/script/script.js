// Decentralized Voting System Frontend Script
// Author: Blockchain Developer
// Description: Frontend JavaScript for interacting with the voting smart contract

class VotingSystem {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.userAccount = null;
        this.contractAddress = null; // Set this to your deployed contract address
        this.contractABI = [
            {
                "inputs": [{"internalType": "string", "name": "_votingTitle", "type": "string"}],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [{"indexed": false, "internalType": "uint256", "name": "candidateId", "type": "uint256"}, {"indexed": false, "internalType": "string", "name": "name", "type": "string"}],
                "name": "CandidateAdded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{"indexed": true, "internalType": "address", "name": "voter", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "candidateId", "type": "uint256"}],
                "name": "VoteCasted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{"indexed": true, "internalType": "address", "name": "voter", "type": "address"}],
                "name": "VoterRegistered",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{"indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256"}],
                "name": "VotingEnded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [{"indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256"}],
                "name": "VotingStarted",
                "type": "event"
            },
            {
                "inputs": [{"internalType": "string", "name": "_name", "type": "string"}],
                "name": "addCandidate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "candidateCount",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "name": "candidates",
                "outputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}, {"internalType": "string", "name": "name", "type": "string"}, {"internalType": "uint256", "name": "voteCount", "type": "uint256"}, {"internalType": "bool", "name": "exists", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
                "name": "castVote",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "endVoting",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
                "name": "getCandidate",
                "outputs": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "uint256", "name": "voteCount", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getResults",
                "outputs": [{"internalType": "string", "name": "winnerName", "type": "string"}, {"internalType": "uint256", "name": "winnerVotes", "type": "uint256"}, {"internalType": "uint256", "name": "totalVotesCast", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "address", "name": "_voterAddress", "type": "address"}],
                "name": "getVoterInfo",
                "outputs": [{"internalType": "bool", "name": "isRegistered", "type": "bool"}, {"internalType": "bool", "name": "hasVoted", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getVotingStatus",
                "outputs": [{"internalType": "bool", "name": "active", "type": "bool"}, {"internalType": "uint256", "name": "startTime", "type": "uint256"}, {"internalType": "uint256", "name": "endTime", "type": "uint256"}, {"internalType": "uint256", "name": "currentTime", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [{"internalType": "address", "name": "", "type": "address"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "address", "name": "_voterAddress", "type": "address"}],
                "name": "registerVoter",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "_durationInMinutes", "type": "uint256"}],
                "name": "startVoting",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalVotes",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "address", "name": "", "type": "address"}],
                "name": "voters",
                "outputs": [{"internalType": "bool", "name": "isRegistered", "type": "bool"}, {"internalType": "bool", "name": "hasVoted", "type": "bool"}, {"internalType": "uint256", "name": "votedCandidateId", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "votingActive",
                "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "votingEndTime",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "votingStartTime",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "votingTitle",
                "outputs": [{"internalType": "string", "name": "", "type": "string"}],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        
        this.init();
    }

    // Initialize the application
    async init() {
        await this.loadWeb3();
        await this.loadContract();
        await this.loadAccount();
        this.setupEventListeners();
        this.updateUI();
        this.startAutoRefresh();
    }

    // Load Web3
    async loadWeb3() {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.showStatus('Web3 connected successfully', 'success');
            } catch (error) {
                this.showStatus('User denied account access', 'error');
            }
        } else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
        } else {
            this.showStatus('Please install MetaMask to use this application', 'error');
        }
    }

    // Load smart contract
    async loadContract() {
        if (!this.contractAddress) {
            this.showStatus('Please set the contract address in script.js', 'error');
            return;
        }
        
        try {
            this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
            this.showStatus('Contract loaded successfully', 'success');
        } catch (error) {
            this.showStatus('Failed to load contract: ' + error.message, 'error');
        }
    }

    // Load user account
    async loadAccount() {
        try {
            const accounts = await this.web3.eth.getAccounts();
            this.userAccount = accounts[0];
            
            if (this.userAccount) {
                document.getElementById('userAddress').textContent = 
                    this.userAccount.substring(0, 6) + '...' + this.userAccount.substring(38);
                this.showStatus('Account loaded: ' + this.userAccount.substring(0, 10) + '...', 'success');
            }
        } catch (error) {
            this.showStatus('Failed to load account: ' + error.message, 'error');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Connect wallet button
        document.getElementById('connectWallet').addEventListener('click', () => this.init());
        
        // Admin functions
        document.getElementById('addCandidateBtn').addEventListener('click', () => this.addCandidate());
        document.getElementById('registerVoterBtn').addEventListener('click', () => this.registerVoter());
        document.getElementById('startVotingBtn').addEventListener('click', () => this.startVoting());
        document.getElementById('endVotingBtn').addEventListener('click', () => this.endVoting());
        
        // Voter functions
        document.getElementById('castVoteBtn').addEventListener('click', () => this.castVote());
        document.getElementById('checkStatusBtn').addEventListener('click', () => this.updateUI());
        document.getElementById('viewResultsBtn').addEventListener('click', () => this.displayResults());
        
        // MetaMask account change listener
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                this.userAccount = accounts[0];
                this.loadAccount();
                this.updateUI();
            });
        }
    }

    // Add candidate (Admin only)
    async addCandidate() {
        const candidateName = document.getElementById('candidateName').value.trim();
        
        if (!candidateName) {
            this.showStatus('Please enter candidate name', 'error');
            return;
        }

        try {
            await this.contract.methods.addCandidate(candidateName).send({ from: this.userAccount });
            this.showStatus('Candidate added successfully!', 'success');
            document.getElementById('candidateName').value = '';
            this.updateUI();
        } catch (error) {
            this.showStatus('Failed to add candidate: ' + error.message, 'error');
        }
    }

    // Register voter (Admin only)
    async registerVoter() {
        const voterAddress = document.getElementById('voterAddress').value.trim();
        
        if (!voterAddress || !this.web3.utils.isAddress(voterAddress)) {
            this.showStatus('Please enter a valid Ethereum address', 'error');
            return;
        }

        try {
            await this.contract.methods.registerVoter(voterAddress).send({ from: this.userAccount });
            this.showStatus('Voter registered successfully!', 'success');
            document.getElementById('voterAddress').value = '';
        } catch (error) {
            this.showStatus('Failed to register voter: ' + error.message, 'error');
        }
    }

    // Start voting (Admin only)
    async startVoting() {
        const duration = parseInt(document.getElementById('votingDuration').value);
        
        if (!duration || duration <= 0) {
            this.showStatus('Please enter a valid duration in minutes', 'error');
            return;
        }

        try {
            await this.contract.methods.startVoting(duration).send({ from: this.userAccount });
            this.showStatus('Voting started successfully!', 'success');
            this.updateUI();
        } catch (error) {
            this.showStatus('Failed to start voting: ' + error.message, 'error');
        }
    }

    // End voting (Admin only)
    async endVoting() {
        try {
            await this.contract.methods.endVoting().send({ from: this.userAccount });
            this.showStatus('Voting ended successfully!', 'success');
            this.updateUI();
        } catch (error) {
            this.showStatus('Failed to end voting: ' + error.message, 'error');
        }
    }

    // Cast vote
    async castVote() {
        const candidateId = parseInt(document.getElementById('candidateSelect').value);
        
        if (!candidateId) {
            this.showStatus('Please select a candidate', 'error');
            return;
        }

        try {
            await this.contract.methods.castVote(candidateId).send({ from: this.userAccount });
            this.showStatus('Vote cast successfully!', 'success');
            this.updateUI();
        } catch (error) {
            this.showStatus('Failed to cast vote: ' + error.message, 'error');
        }
    }

    // Update UI with latest data
    async updateUI() {
        if (!this.contract) return;

        try {
            // Load basic contract info
            const votingTitle = await this.contract.methods.votingTitle().call();
            const candidateCount = await this.contract.methods.candidateCount().call();
            const totalVotes = await this.contract.methods.totalVotes().call();
            const owner = await this.contract.methods.owner().call();
            
            // Update contract info
            document.getElementById('votingTitle').textContent = votingTitle;
            document.getElementById('totalCandidates').textContent = candidateCount;
            document.getElementById('totalVotes').textContent = totalVotes;
            document.getElementById('contractOwner').textContent = owner.substring(0, 10) + '...';
            
            // Check if user is owner
            const isOwner = this.userAccount && this.userAccount.toLowerCase() === owner.toLowerCase();
            document.getElementById('adminPanel').style.display = isOwner ? 'block' : 'none';
            
            // Load voting status
            const votingStatus = await this.contract.methods.getVotingStatus().call();
            this.updateVotingStatus(votingStatus);
            
            // Load candidates
            await this.loadCandidates();
            
            // Check voter status
            if (this.userAccount) {
                await this.checkVoterStatus();
            }
            
        } catch (error) {
            this.showStatus('Failed to update UI: ' + error.message, 'error');
        }
    }

    // Update voting status display
    updateVotingStatus(status) {
        const { active, startTime, endTime, currentTime } = status;
        const statusElement = document.getElementById('votingStatus');
        const timerElement = document.getElementById('votingTimer');
        
        if (active) {
            statusElement.textContent = 'ACTIVE';
            statusElement.className = 'status-active';
            
            const timeLeft = parseInt(endTime) - parseInt(currentTime);
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / 3600);
                const minutes = Math.floor((timeLeft % 3600) / 60);
                const seconds = timeLeft % 60;
                timerElement.textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;
            } else {
                timerElement.textContent = 'Voting period has ended';
            }
        } else {
            statusElement.textContent = 'INACTIVE';
            statusElement.className = 'status-inactive';
            timerElement.textContent = 'Voting is not currently active';
        }
    }

    // Load and display candidates
    async loadCandidates() {
        const candidateCount = await this.contract.methods.candidateCount().call();
        const candidatesList = document.getElementById('candidatesList');
        const candidateSelect = document.getElementById('candidateSelect');
        
        candidatesList.innerHTML = '';
        candidateSelect.innerHTML = '<option value="">Select a candidate</option>';
        
        for (let i = 1; i <= candidateCount; i++) {
            try {
                const candidate = await this.contract.methods.getCandidate(i).call();
                
                // Add to candidates list
                const candidateDiv = document.createElement('div');
                candidateDiv.className = 'candidate-item';
                candidateDiv.innerHTML = `
                    <strong>${candidate.name}</strong>
                    <span class="vote-count">Votes: ${candidate.voteCount}</span>
                `;
                candidatesList.appendChild(candidateDiv);
                
                // Add to select dropdown
                const option = document.createElement('option');
                option.value = i;
                option.textContent = candidate.name;
                candidateSelect.appendChild(option);
                
            } catch (error) {
                console.log('Error loading candidate', i, error);
            }
        }
    }

    // Check voter status
    async checkVoterStatus() {
        try {
            const voterInfo = await this.contract.methods.getVoterInfo(this.userAccount).call();
            const voterStatusElement = document.getElementById('voterStatus');
            
            if (voterInfo.isRegistered) {
                if (voterInfo.hasVoted) {
                    voterStatusElement.textContent = 'Registered - Already Voted';
                    voterStatusElement.className = 'status-voted';
                    document.getElementById('castVoteBtn').disabled = true;
                } else {
                    voterStatusElement.textContent = 'Registered - Can Vote';
                    voterStatusElement.className = 'status-can-vote';
                    document.getElementById('castVoteBtn').disabled = false;
                }
            } else {
                voterStatusElement.textContent = 'Not Registered';
                voterStatusElement.className = 'status-not-registered';
                document.getElementById('castVoteBtn').disabled = true;
            }
        } catch (error) {
            console.log('Error checking voter status:', error);
        }
    }

    // Display voting results
    async displayResults() {
        try {
            const results = await this.contract.methods.getResults().call();
            const resultsDiv = document.getElementById('resultsDisplay');
            
            resultsDiv.innerHTML = `
                <h3>🏆 Voting Results</h3>
                <div class="result-item">
                    <strong>Winner:</strong> ${results.winnerName}
                </div>
                <div class="result-item">
                    <strong>Winning Votes:</strong> ${results.winnerVotes}
                </div>
                <div class="result-item">
                    <strong>Total Votes Cast:</strong> ${results.totalVotesCast}
                </div>
            `;
            
            resultsDiv.style.display = 'block';
        } catch (error) {
            this.showStatus('Failed to get results: ' + error.message, 'error');
        }
    }

    // Show status messages
    showStatus(message, type) {
        const statusDiv = document.getElementById('statusMessage');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        statusDiv.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }

    // Auto refresh UI every 30 seconds
    startAutoRefresh() {
        setInterval(() => {
            this.updateUI();
        }, 30000);
    }
}

// Initialize the voting system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your deployed contract address
    const contractAddress = '0x0000000000000000000000000000000000000000'; // REPLACE THIS
    
    if (contractAddress === '0x0000000000000000000000000000000000000000') {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial;">
                <h2>⚠️ Configuration Required</h2>
                <p>Please update the contract address in script.js with your deployed contract address.</p>
                <p>Look for the line: <code>const contractAddress = '0x0000...';</code></p>
            </div>
        `;
        return;
    }
    
    const votingSystem = new VotingSystem();
    votingSystem.contractAddress = contractAddress;
});

// Utility functions
function formatTimestamp(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
}

function shortenAddress(address) {
    return address.substring(0, 6) + '...' + address.substring(38);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VotingSystem;
}
