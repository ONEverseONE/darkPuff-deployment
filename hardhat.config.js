require("@nomicfoundation/hardhat-toolbox");

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // harmonytestnet: {
    //   url: "https://api.s0.b.hmny.io",
    //   accounts: [`${process.env.PRIVATE_KEY}`],
    // },
    mumbai: {
      url: `${process.env.MATIC_RPC}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      // harmonyTest: `${process.env.ETHERSCAN_KEY}`,
      // polygon: `${process.env.POLYGONSCAN_KEY}`,
      polygonMumbai: `${process.env.POLYGONSCAN_KEY}`,
    },
  },
};
