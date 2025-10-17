import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:distributor:address", "Prints the Distributor address").setAction(async (_args: TaskArguments, hre) => {
  const dist = await hre.deployments.get("Distributor");
  console.log("Distributor:", dist.address);
});

task("task:distributor:batch", "Distribute encrypted amounts to recipients")
  .addParam("recipients", "Comma-separated recipient addresses")
  .addParam("amounts", "Comma-separated uint64 amounts (plaintext; will be encrypted)")
  .setAction(async (args: TaskArguments, hre) => {
    const { ethers, fhevm, deployments } = hre;
    await fhevm.initializeCLIApi();

    const distDep = await deployments.get("Distributor");
    const distributor = await ethers.getContractAt("Distributor", distDep.address);
    const tokenAddr = await distributor.tokenAddress();

    const [signer] = await ethers.getSigners();

    const recipients: string[] = (args.recipients as string).split(",").map((s) => s.trim());
    const amountsStr: string[] = (args.amounts as string).split(",").map((s) => s.trim());
    if (recipients.length !== amountsStr.length) throw new Error("recipients/amounts length mismatch");
    const amountsNum = amountsStr.map((a) => BigInt(a));

    const input = fhevm.createEncryptedInput(distDep.address, signer.address);
    for (const a of amountsNum) input.add64(a);
    const encrypted = await input.encrypt();

    const tx = await distributor
      .connect(signer)
      .batchDistributeEncrypted(
        recipients,
        encrypted.handles as unknown as string[],
        encrypted.inputProof as string,
      );
    console.log(`Wait for tx:${tx.hash}...`);
    await tx.wait();
    console.log("Batch distribution done.");

    // Show token balances (encrypted handles)
    const token = await ethers.getContractAt("ConfidentialETH", tokenAddr);
    for (const r of recipients) {
      const encBal = await token.confidentialBalanceOf(r);
      console.log(`Encrypted balance handle for ${r}: ${encBal}`);
    }
  });

