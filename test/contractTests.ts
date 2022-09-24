import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {loadFixture, deployContract} from 'ethereum-waffle';
import { ethers } from "hardhat";
import { NFTWARS__factory } from "../typechain-types";

const address0 = "0x0000000000000000000000000000000000000000";
export const sleep = async (waitTime: number) =>
  new Promise(resolve =>
    setTimeout(resolve, waitTime));

describe("NFTWARS", function () {
  async function deployNFTWars() {
    const [owner, anotherAcc] = await ethers.getSigners();
    const NFTWARS = await hre.ethers.getContractFactory("NFTWARS");
    const nftWars = await NFTWARS.deploy();

    return { nftWars, owner, anotherAcc };
  }
  it("Should mint 100 NFT", async function () {
    const {nftWars, owner, anotherAcc} = await loadFixture(deployNFTWars);
    for (let index = 0; index < 100; index++) {
      if (index < 50) {
        nftWars.connect(owner).mintNFT();
      }
      else {
        nftWars.connect(anotherAcc).mintNFT();
      }
      sleep(10);
    };
    expect(await nftWars.idToAddressNFT(100)).to.equal(anotherAcc.address);
    await expect(nftWars.connect(owner).mintNFT()).to.be.reverted;
  });
  it("Only NFT Owners Can Fight", async function () {
    const {nftWars, owner, anotherAcc} = await loadFixture(deployNFTWars);
    expect(await nftWars.idToAddressNFT(10)).to.equal(owner.address);
    expect(await nftWars.idToAddressNFT(70)).to.equal(anotherAcc.address);
    await expect(nftWars.connect(anotherAcc).fight(10, 70)).to.be.reverted;
  });
  it("Burn Mechanism Check", async function () {
    const {nftWars, owner} = await loadFixture(deployNFTWars);
    await nftWars.connect(owner).fight(12, 20);
    const result = await nftWars.idToAddressNFT(12);
    if(result == address0){
      expect(await nftWars.idToAddressNFT(20)).to.equal(owner.address);
    }
    else{
      expect(result).to.equal(owner.address);
    }
  });
  it("Kill Count Check", async function () {
    const {nftWars, owner} = await loadFixture(deployNFTWars);
    await nftWars.connect(owner).fight(23, 24);
    const result = await nftWars.idToAddressNFT(23);
    if(result == address0){
      expect(await nftWars.idToKillCount(24)).to.equal(1);
    }
    else{
      expect(await nftWars.idToKillCount(23)).to.equal(1);
    }
  });
});