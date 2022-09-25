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

  const FreeMintVoucher = await hre.ethers.getContractFactory(
    "FreeMintVoucher"
  );
  const fmv = await FreeMintVoucher.deploy();
  console.log("Free Mint voucher deployed to:", fmv.address);

  const VoucherIncubator = await hre.ethers.getContractFactory(
    "contracts/VoucherIncubator.sol:VoucherIncubator"
  );
  const voucher = await VoucherIncubator.deploy(fmv.address);
  console.log("Incubator Voucher deployed to:", voucher.address);

  const GRAV = await hre.ethers.getContractFactory("Grav");
  const grav = await GRAV.deploy();
  console.log("Grav deployed to:", grav.address);

  const WLVoucher = await hre.ethers.getContractFactory("WhitelistVoucher");
  const wl = await WLVoucher.deploy(grav.address);
  console.log("WL Voucher", wl.address);

  const Egg = await hre.ethers.getContractFactory("Eggs");
  const egg = await Egg.deploy(
    fmv.address,
    wl.address,
    grav.address,
    voucher.address
  );

  await voucher.changeEggContract(egg.address);
  await egg.setFreeMintActive(true);
  await egg.setPublicMintActive(true);
  await egg.setWLMintActive(true);

  await egg.deployTransaction.wait(5);

  console.log("Eggs deployed to:", egg.address);

  try {
    await hre.run("verify:verify", {
      address: fmv.address,
      contract: "contracts/Mocks/FreeMintVoucher.sol:FreeMintVoucher",
      network: "mumbai",
    });
  } catch (err) {}

  try {
    await hre.run("verify:verify", {
      address: voucher.address,
      constructorArguments: [grav.address],
      contract: "contracts/VoucherIncubator.sol:VoucherIncubator",
      network: "mumbai",
    });
  } catch (err) {}

  try {
    await hre.run("verify:verify", {
      address: grav.address,
      contract: "contracts/Mocks/Grav.sol:Grav",
      network: "mumbai",
    });
  } catch (err) {}

  try {
    await hre.run("verify:verify", {
      address: wl.address,
      constructorArguments: [grav.address],
      contract: "contracts/Mocks/WhitelistVoucher.sol:WhitelistVoucher",
      network: "mumbai",
    });
  } catch (err) {}

  try {
    await hre.run("verify:verify", {
      address: egg.address,
      constructorArguments: [fmv.address, wl.address, grav.address],
      contract: "contracts/Eggs.sol:Eggs",
      network: "mumbai",
    });
  } catch (err) {}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
