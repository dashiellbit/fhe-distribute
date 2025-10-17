import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("Distributor", function () {
  before(function () {
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }
  });

  it("distributes encrypted amounts to recipients", async function () {
    const [deployer, alice, bob] = await ethers.getSigners();

    const ConfidentialETH = await ethers.getContractFactory("ConfidentialETH");
    const ceth = await ConfidentialETH.deploy();
    const cethAddr = await ceth.getAddress();

    const Distributor = await ethers.getContractFactory("Distributor");
    const dist = await Distributor.deploy(cethAddr);
    const distAddr = await dist.getAddress();

    // Mint cETH to distributor
    await (await ceth.mint(distAddr, 1_000_000)).wait();

    // Prepare encrypted inputs for 100 and 200
    const input = fhevm.createEncryptedInput(distAddr, deployer.address);
    input.add64(BigInt(100));
    input.add64(BigInt(200));
    const encrypted = await input.encrypt();

    await (await dist.batchDistributeEncrypted([alice.address, bob.address], encrypted.handles, encrypted.inputProof)).wait();

    const encAlice = await ceth.confidentialBalanceOf(alice.address);
    const decAlice = await fhevm.userDecryptEuint(FhevmType.euint64, encAlice, cethAddr, alice);
    const encBob = await ceth.confidentialBalanceOf(bob.address);
    const decBob = await fhevm.userDecryptEuint(FhevmType.euint64, encBob, cethAddr, bob);

    expect(decAlice).to.equal(100n);
    expect(decBob).to.equal(200n);
  });
});

