import "@fhevm/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import type { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";
dotenv.config();
import "solidity-coverage";

import "./tasks/accounts";
import "./tasks/Distributor";

// Run 'npx hardhat vars setup' to see the list of variables that need to be set

const PRIVATE_KEY: string = process.env.PRIVATE_KEY || "";
const INFURA_API_KEY: string = process.env.INFURA_API_KEY || "";
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY || "";

const LOCAL_BALANCE = "100000000000000000000000"; // 100,000 ETH for testing
const FALLBACK_LOCAL_PRIVATE_KEYS: string[] = [
  "0x1000000000000000000000000000000000000000000000000000000000000001",
  "0x2000000000000000000000000000000000000000000000000000000000000002",
  "0x3000000000000000000000000000000000000000000000000000000000000003",
  "0x4000000000000000000000000000000000000000000000000000000000000004",
  "0x5000000000000000000000000000000000000000000000000000000000000005",
  "0x6000000000000000000000000000000000000000000000000000000000000006",
  "0x7000000000000000000000000000000000000000000000000000000000000007",
  "0x8000000000000000000000000000000000000000000000000000000000000008",
  "0x9000000000000000000000000000000000000000000000000000000000000009",
];

const combinedLocalKeys = PRIVATE_KEY
  ? [PRIVATE_KEY, ...FALLBACK_LOCAL_PRIVATE_KEYS]
  : [...FALLBACK_LOCAL_PRIVATE_KEYS];

const uniqueLocalKeys: string[] = [];
for (const key of combinedLocalKeys) {
  if (!uniqueLocalKeys.some((existing) => existing.toLowerCase() === key.toLowerCase())) {
    uniqueLocalKeys.push(key);
  }
}

const hardhatAccounts = uniqueLocalKeys.map((key) => ({
  privateKey: key,
  balance: LOCAL_BALANCE,
}));

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: { sepolia: ETHERSCAN_API_KEY },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: hardhatAccounts,
    },
    anvil: {
      chainId: 31337,
      url: "http://localhost:8545",
      accounts: uniqueLocalKeys,
    },
    sepolia: {
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.27",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
      evmVersion: "cancun",
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
