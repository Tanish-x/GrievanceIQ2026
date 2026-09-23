const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting BharatChain smart contract deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Attach to existing CitizenRegistry
  console.log("\n📄 Attaching to existing CitizenRegistry...");
  const citizenRegistryAddress = "0x13fcbCeA5e59c00143918507d372AC7C612cfdA1";
  const CitizenRegistry = await ethers.getContractFactory("CitizenRegistry");
  const citizenRegistry = CitizenRegistry.attach(citizenRegistryAddress);
  console.log("✅ CitizenRegistry connected at:", citizenRegistryAddress);

  // Attach to existing DocumentRegistry
  console.log("\n📄 Attaching to existing DocumentRegistry...");
  const documentRegistryAddress = "0x6C08b51F1167A97627A6fB3405b5b24f57fe6144";
  const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
  const documentRegistry = DocumentRegistry.attach(documentRegistryAddress);
  console.log("✅ DocumentRegistry connected at:", documentRegistryAddress);

  // Deploy GrievanceSystem
  console.log("\n📄 Deploying GrievanceSystem...");
  const GrievanceSystem = await ethers.getContractFactory("GrievanceSystem");
  const grievanceSystem = await GrievanceSystem.deploy();
  await grievanceSystem.waitForDeployment();
  const grievanceSystemAddress = await grievanceSystem.getAddress();
  console.log("✅ GrievanceSystem deployed to:", grievanceSystemAddress);

  // Verify deployments
  console.log("\n🔍 Verifying deployments...");
  
  // Check CitizenRegistry
  const totalCitizens = await citizenRegistry.getTotalCitizens();
  console.log("   CitizenRegistry - Total citizens:", totalCitizens.toString());
  
  // Check DocumentRegistry
  const totalDocuments = await documentRegistry.totalDocuments();
  console.log("   DocumentRegistry - Total documents:", totalDocuments.toString());
  
  // Check GrievanceSystem
  const totalGrievances = await grievanceSystem.totalGrievances();
  console.log("   GrievanceSystem - Total grievances:", totalGrievances.toString());

  // Save deployment addresses
  console.log("\n💾 Saving deployment addresses...");
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      CitizenRegistry: {
        address: citizenRegistryAddress,
        transactionHash: citizenRegistry.deploymentTransaction()?.hash
      },
      DocumentRegistry: {
        address: documentRegistryAddress,
        transactionHash: documentRegistry.deploymentTransaction()?.hash
      },
      GrievanceSystem: {
        address: grievanceSystemAddress,
        transactionHash: grievanceSystem.deploymentTransaction()?.hash
      }
    },
    gasUsed: {
      CitizenRegistry: citizenRegistry.deploymentTransaction()?.gasLimit?.toString(),
      DocumentRegistry: documentRegistry.deploymentTransaction()?.gasLimit?.toString(),
      GrievanceSystem: grievanceSystem.deploymentTransaction()?.gasLimit?.toString()
    }
  };

  // Write to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const networkName = (await ethers.provider.getNetwork()).name || 'localhost';
  const deploymentFile = path.join(deploymentsDir, `${networkName}.json`);
  
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile);

  // Environment variables for frontend
  console.log("\n🔧 Environment variables for frontend:");
  console.log(`REACT_APP_CITIZEN_REGISTRY_ADDRESS=${citizenRegistryAddress}`);
  console.log(`REACT_APP_DOCUMENT_REGISTRY_ADDRESS=${documentRegistryAddress}`);
  console.log(`REACT_APP_GRIEVANCE_SYSTEM_ADDRESS=${grievanceSystemAddress}`);
  console.log(`REACT_APP_NETWORK_NAME=${networkName}`);

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("┌─────────────────────────────────────────────────────────┐");
  console.log("│                 📋 DEPLOYMENT SUMMARY                   │");
  console.log("├─────────────────────────────────────────────────────────┤");
  console.log(`│ Network: ${networkName.padEnd(47)} │`);
  console.log(`│ Deployer: ${deployer.address.padEnd(45)} │`);
  console.log("├─────────────────────────────────────────────────────────┤");
  console.log(`│ CitizenRegistry:   ${citizenRegistryAddress.padEnd(33)} │`);
  console.log(`│ DocumentRegistry:  ${documentRegistryAddress.padEnd(33)} │`);
  console.log(`│ GrievanceSystem:   ${grievanceSystemAddress.padEnd(33)} │`);
  console.log("└─────────────────────────────────────────────────────────┘");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
