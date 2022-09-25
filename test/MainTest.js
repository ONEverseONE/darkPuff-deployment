const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers, network } = require("hardhat");
const { extendConfig } = require("hardhat/config");

describe("Simple Escrow Main", function () {
  let FreeMintVoucher;
  let Grav;
  let VoucherIncubator;
  let WhitelistVoucher;
  let Egg;
  let provider;
  before(async function () {
    [owner, ace, acadia] = await ethers.getSigners();
    provider = ethers.provider;

    let FMV = await ethers.getContractFactory("FreeMintVoucher");
    FreeMintVoucher = await FMV.deploy();

    let GRAV = await ethers.getContractFactory("Grav");
    Grav = await GRAV.deploy();

    let VI = await ethers.getContractFactory("VoucherIncubator");
    VoucherIncubator = await VI.deploy(Grav.address);

    let WLVoucher = await ethers.getContractFactory("WhitelistVoucher");
    WhitelistVoucher = await WLVoucher.deploy(Grav.address);

    let EGG = await ethers.getContractFactory("Eggs");
    Egg = await EGG.deploy(
      FreeMintVoucher.address,
      WhitelistVoucher.address,
      Grav.address,
      VoucherIncubator.address
    );

    await FreeMintVoucher.setApprovalForAll(Egg.address, true);
    await WhitelistVoucher.setApprovalForAll(Egg.address, true);
    await VoucherIncubator.changeEggContract(Egg.address);
    await FreeMintVoucher.mint(50);
    await WhitelistVoucher.mintWhitelistVoucherNFT(5, 10);
    await Grav.increaseAllowance(Egg.address, parseEther("100000"));

    await Grav.mint(parseEther("100000"));
  });

  describe("Deployment", function () {
    it("Should set the owner", async function () {
      expect(await Egg.owner()).to.equal(owner.address);
    });
  });

  describe("Free Mint", function () {
    it("Should fail if not enabled", async function () {
      await expect(Egg.freeMint([1])).to.be.revertedWith(
        "OV: Free mints not active"
      );
    });
    it("Should transfer tokens", async function () {
      let tokens = [];
      for (var i = 1; i <= 10; i++) {
        tokens.push(i);
      }
      await Egg.setFreeMintActive(true);
      await Egg.freeMint(tokens);
      expect(await Egg.balanceOf(owner.address)).to.equal(10);
    });
    it("Should transfer Incubator vouchers", async function () {
      expect(await VoucherIncubator.balanceOf(owner.address)).to.equal(10);
    });
  });
  describe("WL Mint", function () {
    it("Should fail if not enabled", async function () {
      await expect(Egg.wlMint([1], false)).to.be.revertedWith(
        "OV: WL mints not active"
      );
    });
    it("Should transfer tokens", async function () {
      let tokens = [];
      for (var i = 0; i < 10; i++) {
        tokens.push(i);
      }
      await Egg.setWLMintActive(true);
      await Egg.wlMint(tokens, false);
      expect(await VoucherIncubator.balanceOf(owner.address)).to.equal(60);
    });
    it("Should transfer Incubator vouchers", async function () {
      expect(await VoucherIncubator.balanceOf(owner.address)).to.equal(60);
    });
  });
  describe("Public Mint", function () {
    it("Should fail if not enabled", async function () {
      await expect(Egg.publicMint(5, false)).to.be.revertedWith(
        "OV: Public mints not active"
      );
    });
    it("Should transfer tokens", async function () {
      await Egg.setPublicMintActive(true);
      await Egg.publicMint(10, false);
      expect(await Egg.balanceOf(owner.address)).to.equal(70);
    });
    it("Should not transfer vouchers", async function () {
      expect(await VoucherIncubator.balanceOf(owner.address)).to.equal(60);
    });
  });
});
