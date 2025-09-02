const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of Decentralized Voting System...\n");

  // Get the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Details:");
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "wei");
  console.log("Network:", await ethers.provider.getNetwork());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Deploy the contract
  const Project = await ethers.getContractFactory("Project");
  
  // Voting title for the election
  const votingTitle = "2024 Community Leadership Election";
  
  console.log("📦 Deploying contract...");
  const project = await Project.deploy(votingTitle);
  
  // Wait for deployment to be confirmed
  await project.deployed();
  
  console.log("✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", project.address);
  console.log("🗳️  Voting Title:", votingTitle);
  console.log("👑 Contract Owner:", await project.owner());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Setup initial data for testing (optional)
  console.log("🔧 Setting up initial test data...");
  
  try {
    // Add some sample candidates
    console.log("Adding candidates...");
    await project.addCandidate("Alice Johnson - Progressive Party");
    await project.addCandidate("Bob Smith - Conservative Alliance");
    await project.addCandidate("Carol Davis - Independent");
    
    console.log("✅ Added 3 sample candidates");
    
    // Register some sample voters (using deployer and any additional signers)
    const signers = await ethers.getSigners();
    console.log("Registering sample voters...");
    
    for (let i = 0; i < Math.min(5, signers.length); i++) {
      await project.registerVoter(signers[i].address);
      console.log(`✅ Registered voter: ${signers[i].address}`);
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
  } catch (error) {
    console.log("⚠️  Warning: Could not set up initial test data:", error.message);
  }

  // Display contract information
  console.log("📊 Contract Information:");
  console.log("Total Candidates:", (await project.candidateCount()).toString());
  console.log("Total Votes Cast:", (await project.totalVotes()).toString());
  console.log("Voting Active:", await project.votingActive());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Display next steps
  console.log("🎯 Next Steps:");
  console.log("1. Verify the contract on Etherscan (if on mainnet/testnet)");
  console.log("2. Update your frontend with the contract address");
  console.log("3. Start voting by calling startVoting(durationInMinutes)");
  console.log("4. Test the voting functionality");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save deployment info to file
  const deploymentInfo = {
    contractAddress: project.address,
    contractOwner: await project.owner(),
    votingTitle: votingTitle,
    network: await ethers.provider.getNetwork(),
    deploymentTime: new Date().toISOString(),
    deployerAddress: deployer.address,
    transactionHash: project.deployTransaction.hash
  };

  const fs = require("fs");
  const path = require("path");
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `deployment-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Deployment completed successfully!");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed!");
    console.error("Error:", error);
    process.exit(1);
  });
