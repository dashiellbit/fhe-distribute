import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy FHECounter (kept for template completeness)
  // const deployedFHECounter = await deploy("FHECounter", { from: deployer, log: true });
  // console.log(`FHECounter contract: `, deployedFHECounter.address);

  // Deploy ConfidentialETH
  const deployedConfidentialETH = await deploy("ConfidentialETH", { from: deployer, log: true });
  console.log(`ConfidentialETH contract: `, deployedConfidentialETH.address);

  // Deploy Distributor with ConfidentialETH address
  const deployedDistributor = await deploy("Distributor", {
    from: deployer,
    args: [deployedConfidentialETH.address],
    log: true,
  });
  console.log(`Distributor contract: `, deployedDistributor.address);

  // Mint initial cETH balance to Distributor for distributions (example: 1,000,000 units)
  const signer = await hre.ethers.getSigner(deployer);
  const ceth = await hre.ethers.getContractAt("ConfidentialETH", deployedConfidentialETH.address, signer);
  const mintTx = await ceth.mint(deployedDistributor.address, 1_000_000);
  await mintTx.wait();
  console.log(`Minted initial cETH to Distributor`);
};
export default func;
func.id = "deploy_fheCounter"; // id required to prevent reexecution
func.tags = ["FHECounter", "ConfidentialETH", "Distributor"];
