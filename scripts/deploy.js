// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");
const { parseEther } = require("ethers/lib/utils");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const Egg = await hre.ethers.getContractFactory("Eggs");
  const egg = await Egg.deploy();
  await egg.deployed();

  await egg.deployTransaction.wait(5);
  console.log("Eggs deployed to:", egg.address);

  await hre.run("verify:verify", {
    address: egg.address,
    contract: "contracts/Eggs.sol:Eggs",
    network: "mumbai",
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
