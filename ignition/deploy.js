const hre = require("hardhat");

async function main() {
  const DaiToken = await ethers.getContractFactory("DaiToken");
  const dai = await DaiToken.deploy(100000000000);
  await dai.waitForDeployment();
  console.log("Contract Address", await dai.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
