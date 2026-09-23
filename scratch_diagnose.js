const { testConnection } = require('../server/config/database');
const blockchainService = require('../server/services/blockchain');

async function diagnose() {
  console.log("--- Testing Database Connection ---");
  try {
    const dbOk = await testConnection();
    console.log("Database connection OK?", dbOk);
  } catch (e) {
    console.error("Database connection threw:", e.message);
  }

  console.log("\n--- Testing Blockchain Service ---");
  try {
    await blockchainService.getCitizen('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    console.log("Blockchain getCitizen succeeded.");
  } catch (e) {
    console.error("Blockchain getCitizen threw:", e.message);
  }
}
diagnose();
