const hre = require("hardhat");

async function main() {
  // const GRAV = await hre.ethers.getContractFactory("Grav");
  // const grav = await GRAV.deploy();
  // console.log("Grav deployed to:", grav.address);

  const Egg = await hre.ethers.getContractFactory("Puffs");
  const egg = await Egg.deploy("0xC6baB722a7049B3363C4A7b76cf78B3beb6483c2");

  await egg.setFreeMintActive(true);

  console.log("Eggs deployed to:", egg.address);
  await egg.deployTransaction.wait(5);
  /*

  try {
    await hre.run("verify:verify", {
      address: grav.address,
      contract: "contracts/Mocks/Grav.sol:Grav",
      network: "mumbai",
    });
  } catch (err) {
    console.log(err);
  }

  try {
    await hre.run("verify:verify", {
      address: egg.address,
      constructorArguments: [
        fmv.address,
        wl.address,
        grav.address,
        voucher.address,
      ],
      contract: "contracts/Eggs.sol:Eggs",
      network: "mumbai",
    });
  } catch (err) {
    console.log(err);
  }
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
