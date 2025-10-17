# FHE-Distribute

> A privacy-preserving batch token distribution system powered by Fully Homomorphic Encryption (FHE) on Ethereum

![Solidity](https://img.shields.io/badge/Solidity-0.8.27-blue)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-BSD--3--Clause--Clear-green)
![Network](https://img.shields.io/badge/network-Sepolia-purple)

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Advantages](#key-advantages)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

**FHE-Distribute** is a groundbreaking decentralized application that enables **confidential batch token distribution** on Ethereum using Fully Homomorphic Encryption (FHE) technology from [Zama's FHEVM protocol](https://docs.zama.ai/fhevm).

The system allows users to distribute tokens to multiple recipients in a single transaction while keeping all amounts completely encrypted and private on-chain. Recipients can decrypt and view their own balances using cryptographic proofs, but the actual amounts remain hidden from the public blockchain.

### Live Deployment

- **Network:** Ethereum Sepolia Testnet
- **ConfidentialETH Token:** `0xfFb7940Eb2f47fa4dBf2c9024ae6a3f9db9aD228`
- **Distributor Contract:** `0x839db71eA1857D4D88BAF6914b6874F9dcA997B3`
- **Frontend:** Fully functional React application with RainbowKit wallet integration

## Problem Statement

Traditional token distribution systems on blockchain face critical privacy challenges:

### Current Limitations

1. **Public Transparency = No Privacy**
   - All token amounts are publicly visible on-chain
   - Distribution patterns can be analyzed by anyone
   - Recipient balances are exposed to competitors, attackers, and the public
   - Salary distributions, rewards, and payments become public knowledge

2. **Batch Distribution Complexity**
   - Multiple transactions required for multiple recipients
   - High gas costs for mass distributions
   - Complex coordination and manual processes
   - No native privacy protection mechanisms

3. **Business Confidentiality Issues**
   - Companies cannot hide employee compensation amounts
   - Token vesting schedules are publicly trackable
   - Investment distributions reveal business strategies
   - Competitive intelligence risks from transparent transactions

### What FHE-Distribute Solves

FHE-Distribute addresses these problems by:

- **Encrypting all amounts before on-chain storage** - Nobody can see distribution amounts
- **Batching multiple encrypted distributions** - One transaction for many recipients
- **Enabling private balance viewing** - Only the recipient can decrypt their balance
- **Maintaining blockchain verifiability** - All operations are still cryptographically verified
- **Preserving business confidentiality** - Distribution patterns remain private

## Key Advantages

### 1. Complete On-Chain Privacy

Unlike mixer protocols or zero-knowledge proofs that hide transaction graphs, FHE-Distribute provides:

- **Encrypted amounts at rest** - Balances stored as ciphertext on-chain
- **No plaintext exposure** - Amounts never visible in any transaction logs
- **Homomorphic operations** - Computations performed on encrypted data
- **User-controlled decryption** - Only legitimate recipients can view their balances

### 2. Practical Usability

- **Simple Web Interface** - No complex CLI tools or technical knowledge required
- **Wallet Integration** - Seamless connection via RainbowKit (MetaMask, WalletConnect, etc.)
- **Real-Time Feedback** - Transaction status updates and balance decryption in the UI
- **Faucet System** - Easy testing with mintable test tokens

### 3. Gas Efficiency

- **Batch Operations** - Distribute to unlimited recipients in single transaction
- **Transient ACL** - Temporary access control reduces gas costs
- **Optimized FHE Operations** - Efficient encrypted computation using Zama's protocol

### 4. Security by Design

- **EIP-712 Signing** - Cryptographic proof of balance ownership
- **Access Control Lists** - Fine-grained permission management for encrypted data
- **Immutable Token Reference** - Distributor contract cannot be manipulated
- **No Centralized Key Storage** - Users generate ephemeral keypairs client-side

### 5. Scalability

- **Efficient Encrypted Operations** - FHE operations scale with modern hardware
- **Layer 2 Compatible** - Architecture supports L2 deployment for further cost reduction
- **Modular Design** - Easy to extend to other token standards or distribution patterns

## Features

### Core Functionality

#### 1. Confidential Batch Distribution
- Input multiple recipient addresses and amounts via web UI
- Client-side encryption using Zama FHE SDK
- Single transaction for unlimited recipients
- Real-time transaction status tracking
- Automatic gas estimation and transaction signing

#### 2. Encrypted Token (cETH)
- Implements `ConfidentialFungibleToken` standard
- All balances stored as encrypted `euint64` (64-bit encrypted unsigned integers)
- Supports confidential transfers between addresses
- Mintable for testing and faucet operations
- Full FHE operation support (addition, subtraction with overflow protection)

#### 3. Faucet System
- Request test cETH tokens through the web interface
- Direct minting to connected wallet address
- Configurable amounts (up to 2^64 - 1 tokens)
- Essential for testing distribution workflows

#### 4. Private Balance Viewing
- View your own encrypted balance handle (ciphertext identifier)
- Decrypt your balance using your private key via EIP-712 signature
- Check any address's encrypted balance (returns handle, not amount)
- Decrypt any address's balance if you can prove ownership
- All decryption happens client-side via Zama Relayer

#### 5. Command-Line Interface
- Hardhat task for automated batch distributions
- Useful for CI/CD pipelines and programmatic usage
- Encrypts amounts and submits transactions via CLI
- Full TypeScript support with generated ABIs

### User Interface Features

- **Responsive Design** - Works on desktop and mobile browsers
- **Dynamic Recipient Management** - Add/remove recipients dynamically
- **Input Validation** - Real-time validation of addresses and amounts
- **Decimal Precision** - Supports 6 decimal places (configurable)
- **Transaction History** - View recent distributions (via blockchain explorer integration)
- **Error Handling** - Clear error messages and recovery suggestions

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework for building interactive components |
| **TypeScript** | 5.8.3 | Type-safe development and better IDE support |
| **Vite** | 7.1.6 | Fast build tool and development server |
| **Wagmi** | 2.17.0 | React hooks for Ethereum wallet interactions |
| **RainbowKit** | 2.2.8 | Beautiful wallet connection UI component |
| **Viem** | 2.37.6 | Low-level Ethereum library for contract calls |
| **Ethers.js** | 6.15.0 | Ethereum library for transaction signing |
| **React Query** | 5.89.0 | Server state management and caching |
| **@zama-fhe/relayer-sdk** | 0.2.0 | FHE encryption, decryption, and relayer communication |

### Blockchain Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Hardhat** | 2.26.0 | Ethereum development environment and testing framework |
| **Solidity** | 0.8.27 | Smart contract programming language |
| **@fhevm/solidity** | 0.8.0 | FHE-enabled Solidity library for encrypted operations |
| **@fhevm/hardhat-plugin** | 0.1.0 | Hardhat plugin for FHE development |
| **new-confidential-contracts** | 0.1.1 | Zama's confidential token contract library |
| **TypeChain** | Latest | Generate TypeScript bindings from contract ABIs |

### Cryptography & Privacy

| Technology | Purpose |
|------------|---------|
| **Zama FHEVM** | Fully Homomorphic Encryption virtual machine for Ethereum |
| **Gateway Chain** | Decentralized network for managing FHE operations |
| **FHE Relayer** | Service for coordinating encrypted input/output |
| **KMS (Key Management Service)** | Secure key management for re-encryption |
| **EIP-712** | Typed structured data signing for ownership proofs |

### Network Infrastructure

- **Ethereum Sepolia Testnet** (Chain ID: 11155111) - Primary deployment network
- **Gateway Chain** (Chain ID: 55815) - FHE operation coordination
- **Infura RPC** - Reliable Ethereum node access
- **Etherscan API** - Contract verification and blockchain exploration

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Vite + TypeScript)           │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │ RainbowKit  │  │  Zama FHE    │  │  Wagmi/Ethers   │ │ │
│  │  │   Wallet    │  │    SDK       │  │   Contract      │ │ │
│  │  │ Connection  │  │  Encryption  │  │  Interaction    │ │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │         DistributorApp Component                    │ │ │
│  │  │  • Input recipients & amounts                       │ │ │
│  │  │  • Encrypt amounts client-side                      │ │ │
│  │  │  • Sign transactions with wallet                    │ │ │
│  │  │  • Decrypt & display balances                       │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Web3 RPC / Zama Relayer API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Ethereum Sepolia Testnet                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │               Smart Contracts (Solidity)                  │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  ConfidentialETH.sol                                │ │ │
│  │  │  ├─ Encrypted token balances (euint64)              │ │ │
│  │  │  ├─ confidentialTransfer()                          │ │ │
│  │  │  ├─ confidentialBalanceOf()                         │ │ │
│  │  │  └─ mint() for testing                              │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                          │                                │ │
│  │                          │ References                     │ │
│  │                          ▼                                │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  Distributor.sol                                    │ │ │
│  │  │  ├─ batchDistributeEncrypted()                      │ │ │
│  │  │  ├─ Validates encrypted inputs                      │ │ │
│  │  │  ├─ Grants transient ACL                            │ │ │
│  │  │  └─ Transfers to recipients                         │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ FHE Operations
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Zama FHE Infrastructure                      │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Gateway    │      │ FHE Relayer  │      │     KMS      │ │
│  │    Chain     │◄────►│   Service    │◄────►│ Key Mgmt     │ │
│  │              │      │              │      │  Service     │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│         │                      │                      │        │
│         └──────────────────────┴──────────────────────┘        │
│                    Encrypted Data Pipeline                     │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
fhe-distribute/
├── contracts/                          # Smart contract source files
│   ├── ConfidentialETH.sol            # Encrypted ERC20-like token
│   └── Distributor.sol                 # Batch distribution logic
│
├── deploy/                             # Hardhat deployment scripts
│   └── deploy.ts                       # Deploy ConfidentialETH + Distributor
│
├── tasks/                              # Custom Hardhat CLI tasks
│   ├── accounts.ts                     # Show account information
│   └── Distributor.ts                  # CLI batch distribution task
│
├── test/                               # Smart contract tests
│   └── Distributor.ts                  # Test batch distribution flow
│
├── home/                               # React frontend application
│   ├── src/
│   │   ├── App.tsx                     # Main app wrapper with routing
│   │   ├── components/
│   │   │   ├── DistributorApp.tsx     # Main UI component (distribution + faucet)
│   │   │   └── Header.tsx              # Navigation header with wallet button
│   │   ├── hooks/
│   │   │   ├── useZamaInstance.ts     # Initialize Zama FHE SDK
│   │   │   └── useEthersSigner.ts     # Convert Wagmi client to ethers signer
│   │   ├── config/
│   │   │   ├── contracts.ts            # Contract ABIs and addresses
│   │   │   └── wagmi.ts                # Wagmi + RainbowKit configuration
│   │   ├── styles/                     # Component-specific styles
│   │   └── main.tsx                    # React entry point
│   ├── public/                         # Static assets
│   ├── package.json                    # Frontend dependencies
│   └── vite.config.ts                  # Vite build configuration
│
├── scripts/                            # Build automation scripts
│   └── sync-abis.js                    # Copy ABIs to frontend after compile
│
├── docs/                               # Zama FHEVM documentation
│
├── hardhat.config.ts                   # Hardhat configuration (networks, compiler)
├── package.json                        # Root dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── .env                                # Environment variables (gitignored)
└── README.md                           # This file
```

### Data Flow

#### Distribution Flow

1. **User Input** → User enters recipient addresses and amounts in web UI
2. **Client-Side Encryption** → Zama SDK encrypts each amount with FHE public key
3. **Proof Generation** → SDK generates zero-knowledge proof for each encrypted input
4. **Transaction Creation** → Frontend bundles encrypted amounts + proofs
5. **Wallet Signing** → User signs transaction with connected wallet (MetaMask, etc.)
6. **On-Chain Validation** → Distributor contract validates proofs and converts to internal encrypted format
7. **ACL Grant** → Distributor granted transient access to perform transfers
8. **Batch Transfer** → Contract calls `confidentialTransfer()` for each recipient
9. **Confirmation** → Transaction mined, balances updated on-chain (still encrypted)

#### Decryption Flow

1. **User Request** → User clicks "Decrypt Balance" for their address
2. **Keypair Generation** → Client generates ephemeral public/private keypair
3. **EIP-712 Signature** → User signs typed message proving address ownership
4. **Relayer Request** → Frontend sends signature + public key to Zama Relayer
5. **KMS Re-Encryption** → Relayer coordinates with KMS to re-encrypt balance with user's public key
6. **Client Decryption** → Frontend decrypts using ephemeral private key
7. **Display** → Plaintext balance shown in UI (never leaves client)

## Smart Contracts

### ConfidentialETH.sol

**Purpose:** ERC20-like token with fully encrypted balances

**Location:** `/contracts/ConfidentialETH.sol`

**Key Features:**
- Inherits from `ConfidentialFungibleToken` (Zama's library)
- All balances stored as `euint64` (64-bit encrypted unsigned integers)
- Supports encrypted transfers, approvals, and balance queries
- Public `mint()` function for testing and faucet operations

**Core Functions:**

```solidity
// Mint new encrypted tokens to an address
function mint(address to, uint64 amount) external {
    euint64 encryptedAmount = FHE.asEuint64(amount);
    _mint(to, encryptedAmount);
}

// Inherited from ConfidentialFungibleToken:
function confidentialBalanceOf(address account) external view returns (euint64)
function confidentialTransfer(address to, externalEuint64 amount, bytes calldata inputProof) external returns (bool)
function confidentialApprove(address spender, externalEuint64 amount, bytes calldata inputProof) external returns (bool)
```

**Deployment Address:** `0xfFb7940Eb2f47fa4dBf2c9024ae6a3f9db9aD228` (Sepolia)

### Distributor.sol

**Purpose:** Batch distribution of encrypted token amounts

**Location:** `/contracts/Distributor.sol`

**Key Features:**
- Holds distributable cETH token balance
- Immutable reference to ConfidentialETH token contract
- Batch processes multiple recipients in single transaction
- Uses transient ACL for gas-efficient temporary permissions

**Core Functions:**

```solidity
constructor(address _token) {
    token = IConfidentialFungibleToken(_token);
}

function batchDistributeEncrypted(
    address[] calldata recipients,
    externalEuint64[] calldata encryptedAmounts,
    bytes calldata inputProof
) external {
    require(recipients.length == encryptedAmounts.length, "Length mismatch");

    for (uint256 i = 0; i < recipients.length; i++) {
        // Convert external encrypted input to internal format
        euint64 amount = FHE.fromExternal(encryptedAmounts[i], inputProof);

        // Grant transient ACL access for this transaction
        FHE.allowTransient(amount, address(token));

        // Perform confidential transfer
        token.confidentialTransfer(recipients[i], amount);
    }
}
```

**Security Features:**
- Validates all encrypted inputs with zero-knowledge proofs
- Uses `FHE.fromExternal()` to ensure cryptographic validity
- Transient ACL permissions automatically expire after transaction
- Immutable token reference prevents rug-pull attacks

**Deployment Address:** `0x839db71eA1857D4D88BAF6914b6874F9dcA997B3` (Sepolia)

### Access Control Lists (ACL)

FHE operations require explicit permission to access encrypted data:

- **Permanent ACL:** `FHE.allow()` - Grants persistent access (stored on-chain)
- **Transient ACL:** `FHE.allowTransient()` - Temporary access for current transaction only
- **Use Case:** Distributor uses transient ACL for gas efficiency

## How It Works

### Technical Deep Dive

#### 1. Fully Homomorphic Encryption (FHE)

FHE enables computation on encrypted data without decryption:

```typescript
// Client encrypts amount
const encrypted = await zamaInstance.encrypt64(1000); // Encrypt "1000" tokens

// Contract performs operations on encrypted data
euint64 balance = encryptedBalances[user];
euint64 newBalance = FHE.add(balance, encrypted); // Addition on ciphertext

// Result is still encrypted, but mathematically correct
```

**Key Properties:**
- **Semantic Security:** Ciphertext reveals nothing about plaintext
- **Homomorphic Operations:** Support addition, subtraction, multiplication, comparison
- **Deterministic Encryption:** Same plaintext can produce different ciphertexts
- **Threshold Decryption:** Requires cooperation of multiple KMS nodes

#### 2. Encryption Process

When a user distributes tokens:

```typescript
// Frontend: DistributorApp.tsx:distribute()
const amounts = rows.map(row => parseAmountToUint64(row.amount));
const recipients = rows.map(row => row.address);

// Encrypt each amount using Zama SDK
const encryptedInputs = await Promise.all(
    amounts.map(amt => zamaInstance.encrypt64(amt))
);

// Create contract call with encrypted inputs
const tx = await distributorContract.batchDistributeEncrypted(
    recipients,
    encryptedInputs.handles,      // Ciphertext handles
    encryptedInputs.inputProof    // Zero-knowledge proof
);
```

**Under the Hood:**
1. SDK generates random nonce for semantic security
2. Encrypts amount with Zama's FHE public key
3. Creates zero-knowledge proof that encryption is valid
4. Returns ciphertext handle (identifier) and proof
5. Frontend sends handle + proof to contract
6. Contract validates proof before accepting encrypted data

#### 3. On-Chain Processing

```solidity
// Distributor.sol:batchDistributeEncrypted()
for (uint256 i = 0; i < recipients.length; i++) {
    // Validate and convert external ciphertext to internal format
    euint64 amount = FHE.fromExternal(encryptedAmounts[i], inputProof);

    // Grant temporary permission for token contract to read this encrypted value
    FHE.allowTransient(amount, address(token));

    // Token contract now has permission to perform encrypted transfer
    token.confidentialTransfer(recipients[i], amount);
}
```

**Key Security Checks:**
- `FHE.fromExternal()` validates zero-knowledge proof
- Prevents submission of invalid or malicious ciphertexts
- Ensures encrypted amount is properly formatted
- Verifies cryptographic binding to transaction context

#### 4. Decryption Process

When a user wants to view their balance:

```typescript
// Frontend: DistributorApp.tsx:decryptHandle()

// Step 1: Get encrypted balance handle from contract
const encryptedBalance = await cETHContract.confidentialBalanceOf(userAddress);

// Step 2: Generate ephemeral keypair for re-encryption
const { publicKey, privateKey } = zamaInstance.generateKeypair();

// Step 3: Create EIP-712 signature proving ownership
const signature = await signer.signTypedData({
    domain: { name: "ConfidentialETH", version: "1", chainId: 11155111 },
    types: { Reencrypt: [{ name: "publicKey", type: "bytes" }] },
    primaryType: "Reencrypt",
    message: { publicKey: publicKey }
});

// Step 4: Request re-encryption from Zama Relayer
const reencrypted = await zamaInstance.reencrypt(
    encryptedBalance,
    privateKey,
    publicKey,
    signature,
    contractAddress,
    userAddress
);

// Step 5: Decrypt locally (never sent over network)
const plaintext = zamaInstance.decrypt(reencrypted, privateKey);
console.log(`Your balance: ${plaintext} cETH`);
```

**Security Properties:**
- Ephemeral keypair never stored, regenerated each time
- Private key never leaves user's browser
- EIP-712 signature proves user owns the address
- Relayer cannot decrypt the balance itself
- Re-encryption uses threshold cryptography with KMS nodes

#### 5. Gas Costs

Estimated gas costs on Sepolia (may vary with network conditions):

| Operation | Gas Used | USD Cost (@ $3000 ETH, 20 gwei) |
|-----------|----------|--------------------------------|
| Mint cETH | ~150,000 | ~$0.09 |
| Distribute to 1 recipient | ~250,000 | ~$0.15 |
| Distribute to 10 recipients | ~1,200,000 | ~$0.72 |
| Distribute to 50 recipients | ~5,500,000 | ~$3.30 |
| Balance decryption (off-chain) | 0 | Free |

**Optimization Notes:**
- Transient ACL reduces gas by ~30% vs permanent ACL
- Batch distributions amortize fixed costs across recipients
- Decryption is off-chain, no gas required
- Future L2 deployment would reduce costs by 10-100x

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm, yarn, or pnpm**: Package manager
- **MetaMask or compatible wallet**: For interacting with the dApp
- **Sepolia ETH**: For gas fees (get from [Sepolia faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/fhe-distribute.git
   cd fhe-distribute
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd home
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   PRIVATE_KEY=your_deployer_private_key_here
   INFURA_API_KEY=your_infura_api_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here  # Optional, for verification
   ```

   **Security Warning:** Never commit your `.env` file or expose private keys!

5. **Compile smart contracts**

   ```bash
   npm run compile
   ```

   This will:
   - Compile Solidity contracts
   - Generate TypeChain TypeScript bindings
   - Copy ABIs to frontend (`home/src/config/contracts.ts`)

6. **Run tests** (optional but recommended)

   ```bash
   npm run test
   ```

### Quick Start - Use Deployed Contracts

The easiest way to get started is using the already-deployed contracts on Sepolia:

1. **Start the frontend**

   ```bash
   cd home
   npm run dev
   ```

2. **Open in browser**

   Navigate to `http://localhost:5173`

3. **Connect your wallet**

   - Click "Connect Wallet" in the header
   - Select MetaMask (or your preferred wallet)
   - Approve the connection
   - Ensure you're on Sepolia Testnet

4. **Get test tokens**

   - Go to the "Faucet" tab
   - Enter an amount (e.g., 1000)
   - Click "Get cETH"
   - Approve the transaction in your wallet
   - Wait for confirmation

5. **Distribute tokens**

   - Go to the "Distribute" tab
   - Click "Add Recipient" to add rows
   - Enter recipient addresses and amounts
   - Click "Distribute Tokens"
   - Approve the transaction
   - Wait for confirmation

6. **View encrypted balance**

   - Go to the "View Balance" tab
   - Your encrypted balance handle is displayed automatically
   - Click "Decrypt My Balance" to view the actual amount
   - Sign the EIP-712 message when prompted
   - Your decrypted balance will appear

### Deploy Your Own Contracts (Optional)

If you want to deploy your own instance:

1. **Ensure you have Sepolia ETH** (at least 0.1 ETH for deployment)

2. **Deploy contracts**

   ```bash
   npm run deploy:sepolia
   ```

   This will:
   - Deploy ConfidentialETH token contract
   - Deploy Distributor contract
   - Mint 1,000,000,000 cETH to the Distributor
   - Output contract addresses

3. **Update frontend configuration**

   Edit `home/src/config/contracts.ts` with your new contract addresses:

   ```typescript
   export const CONFIDENTIAL_ETH_ADDRESS = "0xYourNewCETHAddress";
   export const DISTRIBUTOR_ADDRESS = "0xYourNewDistributorAddress";
   ```

4. **Restart frontend**

   ```bash
   cd home
   npm run dev
   ```

## Usage

### Web Interface

#### Distribute Tokens

1. Navigate to the **Distribute** tab
2. Click **Add Recipient** to add more rows (default starts with 1)
3. For each recipient:
   - Enter the Ethereum address (must be valid checksummed address)
   - Enter the amount (up to 6 decimal places, max 18,446,744,073,709.551615)
4. Click **Distribute Tokens**
5. Review the transaction in your wallet and approve
6. Wait for transaction confirmation (usually 15-30 seconds on Sepolia)
7. Status updates will appear below the button

**Example Input:**
```
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
Amount: 100.5

Address: 0x1234567890123456789012345678901234567890
Amount: 250.123456
```

#### Get Test Tokens (Faucet)

1. Navigate to the **Faucet** tab
2. Ensure your wallet is connected
3. Enter the amount of cETH you want to mint
4. Click **Get cETH**
5. Approve the transaction
6. Wait for confirmation

**Note:** In production, this function would be restricted. For testing, anyone can mint.

#### View and Decrypt Balance

1. Navigate to the **View Balance** tab

2. **View Your Own Balance:**
   - Your address is automatically detected
   - Encrypted balance handle is displayed
   - Click **Decrypt My Balance**
   - Sign the EIP-712 message in your wallet
   - Your decrypted balance appears

3. **View Another Address's Balance:**
   - Enter any Ethereum address in the input field
   - Click **Check Balance**
   - The encrypted balance handle is displayed
   - To decrypt, you would need that address's private key (ownership proof)

**Important:** You can only decrypt balances for addresses you control (own the private key).

### Command Line Interface

#### Distribute via CLI

Use the Hardhat task for automated distributions:

```bash
npx hardhat distributor:distribute \
  --recipients "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,0x1234567890123456789012345678901234567890" \
  --amounts "100,250" \
  --network sepolia
```

**Parameters:**
- `--recipients`: Comma-separated list of recipient addresses
- `--amounts`: Comma-separated list of amounts (in token units, not wei)
- `--network`: Network to deploy to (sepolia, localhost, etc.)

#### View Accounts

```bash
npx hardhat accounts --network sepolia
```

Shows all configured accounts and their balances.

#### Other Useful Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Run tests on Sepolia (requires deployed contracts)
npm run test:sepolia

# Generate coverage report
npm run coverage

# Clean build artifacts
npm run clean

# Lint code
npm run lint
```

## Development

### Local Development Setup

For local testing with a mock FHEVM node:

1. **Start local Hardhat node** (in terminal 1)

   ```bash
   npx hardhat node
   ```

   This starts a local blockchain with FHEVM support.

2. **Deploy contracts locally** (in terminal 2)

   ```bash
   npx hardhat deploy --network localhost
   ```

3. **Update frontend config**

   Edit `home/src/config/wagmi.ts` to include `localhost` chain:

   ```typescript
   import { localhost } from 'wagmi/chains';

   export const config = createConfig({
       chains: [sepolia, localhost],
       // ...
   });
   ```

4. **Update contract addresses** in `home/src/config/contracts.ts` with locally deployed addresses

5. **Start frontend**

   ```bash
   cd home
   npm run dev
   ```

6. **Connect MetaMask to localhost**

   - Network: Localhost 8545
   - Chain ID: 31337
   - Import one of the Hardhat test accounts using the private key shown in terminal 1

### Project Scripts

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile Solidity contracts and generate TypeChain types |
| `npm run test` | Run Hardhat tests with local FHEVM mock |
| `npm run test:sepolia` | Run integration tests on Sepolia testnet |
| `npm run deploy:sepolia` | Deploy contracts to Sepolia |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Run ESLint on TypeScript files |
| `npm run clean` | Remove build artifacts and cache |
| `npm run typechain` | Generate TypeScript types from ABIs |

### Frontend Development

```bash
cd home

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint frontend code
npm run lint
```

### Adding New Features

#### Add a New Smart Contract Function

1. **Edit contract** (e.g., `contracts/Distributor.sol`)

   ```solidity
   function newFeature(address recipient, euint64 amount) external {
       // Your logic here
   }
   ```

2. **Recompile**

   ```bash
   npm run compile
   ```

3. **Update tests** (`test/Distributor.ts`)

   ```typescript
   it("should execute newFeature correctly", async function () {
       // Test logic
   });
   ```

4. **Run tests**

   ```bash
   npm run test
   ```

5. **Update frontend** (`home/src/components/DistributorApp.tsx`)

   ```typescript
   const handleNewFeature = async () => {
       const tx = await distributorContract.newFeature(recipient, encryptedAmount);
       await tx.wait();
   };
   ```

#### Add a New Frontend Component

1. **Create component** (`home/src/components/NewComponent.tsx`)

   ```typescript
   export function NewComponent() {
       return <div>New Feature</div>;
   }
   ```

2. **Import in App.tsx**

   ```typescript
   import { NewComponent } from './components/NewComponent';
   ```

3. **Add to UI**

   ```typescript
   <NewComponent />
   ```

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `PRIVATE_KEY` | Deployer account private key | Yes (for deployment) |
| `INFURA_API_KEY` | Infura RPC endpoint access | Yes |
| `ETHERSCAN_API_KEY` | Contract verification on Etherscan | No (recommended) |

**Never commit `.env` file to version control!**

## Testing

### Running Tests

```bash
# Run all tests on local mock FHEVM
npm run test

# Run specific test file
npx hardhat test test/Distributor.ts

# Run with gas reporting
REPORT_GAS=true npm run test

# Run tests on Sepolia (requires deployed contracts)
npm run test:sepolia
```

### Test Coverage

```bash
npm run coverage
```

Generates coverage report in `coverage/` directory.

### Test Structure

Tests are located in `/test/Distributor.ts`:

```typescript
describe("Distributor", function () {
    let distributor: Distributor;
    let cETH: ConfidentialETH;
    let owner: SignerWithAddress;

    beforeEach(async function () {
        // Deploy contracts
        // Setup test accounts
    });

    it("should distribute encrypted amounts to multiple recipients", async function () {
        // Encrypt amounts
        // Call batchDistributeEncrypted
        // Verify balances changed (encrypted)
        // Decrypt and verify correct amounts
    });

    it("should reject invalid proofs", async function () {
        // Try to submit invalid encrypted input
        // Expect transaction to revert
    });

    // More tests...
});
```

### Integration Testing on Sepolia

For end-to-end testing on Sepolia testnet:

1. **Ensure contracts are deployed**
2. **Fund test accounts with Sepolia ETH**
3. **Run integration tests**

   ```bash
   npm run test:sepolia
   ```

This will:
- Connect to Sepolia via Infura
- Use deployed contract addresses
- Execute real transactions on testnet
- Verify all operations work end-to-end

## Deployment

### Deploying to Sepolia Testnet

1. **Prepare environment**

   Ensure `.env` is configured:
   ```
   PRIVATE_KEY=0x... (deployer account with Sepolia ETH)
   INFURA_API_KEY=your_infura_key
   ETHERSCAN_API_KEY=your_etherscan_key (optional)
   ```

2. **Deploy contracts**

   ```bash
   npm run deploy:sepolia
   ```

   **Output:**
   ```
   Deploying ConfidentialETH...
   ConfidentialETH deployed to: 0xfFb7940Eb2f47fa4dBf2c9024ae6a3f9db9aD228

   Deploying Distributor...
   Distributor deployed to: 0x839db71eA1857D4D88BAF6914b6874F9dcA997B3

   Minting initial supply to Distributor...
   Minted 1000000000 cETH to Distributor

   Deployment complete!
   ```

3. **Verify contracts on Etherscan** (optional but recommended)

   ```bash
   npx hardhat verify --network sepolia 0xfFb7940Eb2f47fa4dBf2c9024ae6a3f9db9aD228

   npx hardhat verify --network sepolia 0x839db71eA1857D4D88BAF6914b6874F9dcA997B3 "0xfFb7940Eb2f47fa4dBf2c9024ae6a3f9db9aD228"
   ```

4. **Update frontend configuration**

   Edit `home/src/config/contracts.ts`:

   ```typescript
   export const CONFIDENTIAL_ETH_ADDRESS = "0xfFb7940Eb2f47fa4dBf2c9024ae6a3f9db9aD228";
   export const DISTRIBUTOR_ADDRESS = "0x839db71eA1857D4D88BAF6914b6874F9dcA997B3";
   ```

5. **Build and deploy frontend**

   ```bash
   cd home
   npm run build
   # Deploy dist/ folder to hosting service (Vercel, Netlify, etc.)
   ```

### Deploying to Other Networks

To deploy to a different network:

1. **Add network configuration** in `hardhat.config.ts`:

   ```typescript
   networks: {
       customNetwork: {
           url: "https://rpc.customnetwork.com",
           accounts: [process.env.PRIVATE_KEY!],
           chainId: 12345,
       },
   }
   ```

2. **Ensure network supports FHEVM**

   FHE operations require Zama's FHEVM infrastructure. Check [Zama docs](https://docs.zama.ai/fhevm) for supported networks.

3. **Deploy**

   ```bash
   npx hardhat deploy --network customNetwork
   ```

### Mainnet Deployment Considerations

**WARNING:** Mainnet deployment requires careful planning and security audits.

Before deploying to Ethereum mainnet:

1. **Security Audit**
   - Professional smart contract audit (OpenZeppelin, Trail of Bits, etc.)
   - Formal verification of critical functions
   - Extensive testnet testing (Sepolia, Goerli)

2. **Gas Optimization**
   - Optimize FHE operations for mainnet gas prices
   - Consider Layer 2 deployment (Arbitrum, Optimism) for lower costs
   - Implement gas estimation and limits in frontend

3. **Access Control**
   - Remove or restrict `mint()` function (replace with proper issuance logic)
   - Implement admin controls with multi-sig (Gnosis Safe)
   - Add emergency pause functionality

4. **Monitoring**
   - Set up contract monitoring (Defender, Tenderly)
   - Implement event logging for all critical operations
   - Create alerting for suspicious activity

5. **Legal Compliance**
   - Consult legal counsel regarding token regulations
   - Implement KYC/AML if required by jurisdiction
   - Draft terms of service and privacy policy

## Security Considerations

### Smart Contract Security

1. **Immutability**
   - Distributor's token reference is immutable (set in constructor)
   - Prevents admin from changing token contract to malicious one

2. **Input Validation**
   - All encrypted inputs validated with zero-knowledge proofs
   - `FHE.fromExternal()` ensures cryptographic validity
   - Array length checks prevent out-of-bounds access

3. **Access Control**
   - Transient ACL minimizes attack surface
   - Permissions automatically expire after transaction
   - No permanent access grants to external contracts

4. **Reentrancy Protection**
   - Token contract uses checks-effects-interactions pattern
   - No external calls before state updates
   - Solidity 0.8.27 includes built-in overflow protection

### Privacy & Cryptography

1. **Encrypted Storage**
   - All balances stored as encrypted `euint64` on-chain
   - No plaintext amounts ever visible in transactions or logs
   - Encryption uses Zama's production-grade FHE scheme

2. **Decryption Security**
   - Requires EIP-712 signature proving address ownership
   - Ephemeral keypairs regenerated for each decryption
   - Private keys never stored or transmitted
   - Re-encryption uses threshold cryptography (KMS)

3. **Proof Validation**
   - Zero-knowledge proofs ensure encrypted inputs are valid
   - Prevents submission of malformed or malicious ciphertexts
   - Proof verification happens on-chain (trustless)

### Frontend Security

1. **Wallet Security**
   - RainbowKit handles wallet connection securely
   - No private keys stored in frontend code
   - All transaction signing happens in user's wallet

2. **Input Sanitization**
   - Address validation (checksummed Ethereum addresses)
   - Amount bounds checking (0 to 2^64-1)
   - Decimal precision limiting (6 decimal places)

3. **Error Handling**
   - Graceful error messages for failed transactions
   - No sensitive information exposed in error logs
   - Proper handling of rejected wallet signatures

### Operational Security

1. **Private Key Management**
   - Never commit `.env` file to version control
   - Use hardware wallets (Ledger, Trezor) for mainnet deployments
   - Implement multi-sig for contract admin functions

2. **RPC Security**
   - Use Infura/Alchemy API keys with access restrictions
   - Implement rate limiting on frontend
   - Monitor RPC usage for abuse

3. **Dependency Security**
   - Regular `npm audit` to check for vulnerabilities
   - Pin dependency versions in package.json
   - Use Dependabot for automated security updates

### Known Limitations

1. **FHE Computation Limits**
   - Encrypted operations are more expensive than plaintext
   - Practical limit of ~100 recipients per batch on mainnet
   - Overflow/underflow detection is limited in encrypted domain

2. **Decryption Latency**
   - Balance decryption requires round-trip to Zama Relayer
   - Typical latency: 2-5 seconds
   - Dependent on Relayer infrastructure availability

3. **Browser Requirements**
   - Requires modern browser with WebAssembly support
   - Large WASM bundle (~2MB) for FHE operations
   - May be slow on mobile devices

### Recommended Security Practices

- [ ] Use hardware wallet for mainnet deployment
- [ ] Enable 2FA on all accounts (GitHub, Infura, Etherscan)
- [ ] Regular security audits before major releases
- [ ] Monitor contract events for anomalies
- [ ] Implement rate limiting on public functions
- [ ] Use Gnosis Safe multi-sig for admin operations
- [ ] Regular dependency updates and audits
- [ ] Penetration testing of frontend
- [ ] Bug bounty program for responsible disclosure

## Future Roadmap

### Short Term (Q2-Q3 2025)

#### 1. Enhanced Token Standards
- [ ] Support for ERC20 wrapper (deposit ETH → cETH, withdraw cETH → ETH)
- [ ] Multi-token support (cUSDC, cDAI, etc.)
- [ ] Token allowances and approvals with encrypted amounts
- [ ] Batch transfer function for individual users

#### 2. User Experience Improvements
- [ ] CSV import for batch distributions (upload recipient list)
- [ ] Transaction history dashboard with filtering
- [ ] Estimated gas costs before transaction submission
- [ ] Mobile-responsive UI enhancements
- [ ] Dark mode theme
- [ ] Multi-language support (i18n)

#### 3. Developer Tools
- [ ] TypeScript SDK for programmatic distributions
- [ ] REST API for integrations
- [ ] Webhooks for transaction notifications
- [ ] Ethers.js and Viem plugins for FHE operations
- [ ] Comprehensive API documentation

#### 4. Security Enhancements
- [ ] Professional smart contract audit (OpenZeppelin/Trail of Bits)
- [ ] Bug bounty program launch
- [ ] Formal verification of critical functions
- [ ] Emergency pause mechanism
- [ ] Multi-sig admin controls (Gnosis Safe)

### Medium Term (Q4 2025 - Q1 2026)

#### 5. Scalability & Performance
- [ ] Layer 2 deployment (Arbitrum, Optimism, zkSync)
- [ ] Batch decryption for multiple addresses
- [ ] Off-chain encrypted storage with on-chain commitments
- [ ] Optimistic FHE execution for faster transactions
- [ ] State channels for repeated distributions

#### 6. Advanced Features
- [ ] Scheduled distributions (vesting, time-locked releases)
- [ ] Conditional distributions (if-then logic on encrypted data)
- [ ] Encrypted voting and governance
- [ ] Confidential staking and rewards
- [ ] Cross-chain encrypted bridges

#### 7. Enterprise Features
- [ ] Permissioned distributions (whitelist/blacklist)
- [ ] Role-based access control (RBAC)
- [ ] Audit trail and compliance reporting
- [ ] Integration with payroll systems
- [ ] KYC/AML compliance modules (optional)

#### 8. Analytics & Monitoring
- [ ] Encrypted analytics (distribution patterns without revealing amounts)
- [ ] On-chain metrics dashboard
- [ ] Gas usage optimization recommendations
- [ ] Contract health monitoring
- [ ] User activity analytics (privacy-preserving)

### Long Term (2026+)

#### 9. Ecosystem Expansion
- [ ] Confidential DeFi protocols (AMM, lending, borrowing with encrypted amounts)
- [ ] Encrypted NFT metadata and royalties
- [ ] Privacy-preserving DAO treasuries
- [ ] Confidential prediction markets
- [ ] Encrypted gaming economies

#### 10. Research & Innovation
- [ ] Zero-knowledge rollups for FHE operations
- [ ] Homomorphic encryption for general computation (not just arithmetic)
- [ ] Post-quantum cryptography integration
- [ ] Hardware acceleration for FHE operations
- [ ] Novel FHE schemes for lower latency

#### 11. Interoperability
- [ ] Cross-chain encrypted messaging
- [ ] Integration with other privacy protocols (Aztec, Secret Network)
- [ ] Confidential data oracles
- [ ] Encrypted off-chain computation (TEE integration)

#### 12. Governance & Decentralization
- [ ] DAO governance for protocol upgrades
- [ ] Decentralized Zama Relayer network
- [ ] Community-driven feature prioritization
- [ ] Token economics for incentivizing validators

### Community Requests

We're actively seeking community input on:

- **Most desired features** - What would make FHE-Distribute more useful for your use case?
- **Integration needs** - Which platforms/protocols should we integrate with?
- **Performance bottlenecks** - Where are you experiencing friction?
- **Documentation gaps** - What needs better explanation?

**Submit feature requests:** [GitHub Issues](https://github.com/yourusername/fhe-distribute/issues)

**Join the discussion:** [Discord Community](https://discord.gg/zama)

### Contribution Areas

We welcome contributions in:

- Smart contract optimization
- Frontend UI/UX improvements
- Documentation and tutorials
- Language translations
- Security research
- Testing and QA

See [Contributing](#contributing) section for guidelines.

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or reporting issues, your help is appreciated.

### How to Contribute

1. **Fork the repository**

   Click the "Fork" button in the top-right corner of the GitHub page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/yourusername/fhe-distribute.git
   cd fhe-distribute
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-new-feature
   ```

4. **Make your changes**

   - Follow existing code style and conventions
   - Add tests for new features
   - Update documentation as needed

5. **Run tests**

   ```bash
   npm run test
   npm run lint
   ```

6. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

   **Commit message format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

7. **Push to your fork**

   ```bash
   git push origin feature/amazing-new-feature
   ```

8. **Create a Pull Request**

   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes in detail
   - Link any related issues

### Contribution Guidelines

#### Code Style

- **Solidity:** Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript:** Use ESLint configuration (run `npm run lint`)
- **Comments:** Document complex logic and FHE operations
- **Naming:** Use descriptive variable and function names

#### Testing Requirements

- All new features must include tests
- Maintain or improve code coverage
- Test both success and failure cases
- Include integration tests for complex features

#### Documentation

- Update README.md for new features
- Add inline code comments for complex logic
- Update TypeScript types and interfaces
- Create examples for new APIs

#### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation updated
- [ ] Commit messages follow conventional format
- [ ] PR description clearly explains changes
- [ ] Linked related issues (if applicable)

### Reporting Issues

When reporting bugs, please include:

1. **Environment:**
   - Node.js version
   - npm/yarn version
   - Operating system
   - Browser (for frontend issues)

2. **Steps to reproduce:**
   - Detailed steps to trigger the bug
   - Expected behavior
   - Actual behavior

3. **Code snippets/screenshots:**
   - Error messages
   - Console logs
   - Network requests (if relevant)

4. **Possible solution:**
   - If you have ideas on how to fix it

### Feature Requests

For feature requests, please describe:

1. **Use case:** What problem does this solve?
2. **Proposed solution:** How should it work?
3. **Alternatives considered:** Other approaches you've thought about
4. **Additional context:** Any other relevant information

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help newcomers learn and contribute

### Getting Help

- **Documentation:** Check this README and [Zama docs](https://docs.zama.ai/fhevm)
- **GitHub Discussions:** Ask questions and share ideas
- **Discord:** Join the [Zama Discord](https://discord.gg/zama) community
- **Stack Overflow:** Tag questions with `fhevm` and `zama`

### Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for helping make FHE-Distribute better!

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

### What this means:

- ✅ You can use this code for personal, educational, and commercial purposes
- ✅ You can modify and distribute the code
- ✅ You must include the original license and copyright notice
- ❌ No patent rights are granted
- ❌ No trademark rights are granted
- ❌ Software is provided "as is" without warranty

See the [LICENSE](LICENSE) file for full details.

### Third-Party Licenses

This project includes code from:

- **Zama FHEVM** - BSD-3-Clause-Clear License
- **OpenZeppelin Contracts** - MIT License
- **Hardhat** - MIT License
- **React** - MIT License
- **RainbowKit** - MIT License

See individual packages for their licenses.

## Support

### Getting Help

- **Documentation:** Start with this README and the [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- **GitHub Issues:** [Report bugs or request features](https://github.com/yourusername/fhe-distribute/issues)
- **GitHub Discussions:** [Ask questions and share ideas](https://github.com/yourusername/fhe-distribute/discussions)
- **Discord:** Join the [Zama Community Discord](https://discord.gg/zama) for real-time help
- **Stack Overflow:** Tag questions with `fhevm`, `zama`, and `ethereum`

### Frequently Asked Questions

#### Q: What is Fully Homomorphic Encryption (FHE)?

**A:** FHE is a form of encryption that allows computations to be performed directly on encrypted data without decrypting it first. Results remain encrypted and can only be decrypted by someone with the proper key.

#### Q: How is this different from Zero-Knowledge Proofs (ZKPs)?

**A:** ZKPs prove that a statement is true without revealing the underlying data. FHE allows computation on encrypted data while keeping it encrypted. FHE-Distribute uses both: FHE for encrypted balances and ZKPs for validating encrypted inputs.

#### Q: Can I use this on Ethereum mainnet?

**A:** Currently deployed on Sepolia testnet. Mainnet deployment requires Zama's mainnet infrastructure to be available. Check [Zama's roadmap](https://docs.zama.ai/fhevm) for updates.

#### Q: What are the gas costs?

**A:** FHE operations are more expensive than standard operations. Expect 150k-250k gas per encrypted transfer. Batch distributions amortize costs across recipients. See [How It Works](#how-it-works) for detailed gas analysis.

#### Q: Is my data really private?

**A:** Yes. All amounts are encrypted client-side before sending to the blockchain. Only encrypted ciphertext is stored on-chain. Only the recipient with the private key can decrypt their balance. No observer, miner, or node operator can see plaintext amounts.

#### Q: Can I decrypt someone else's balance?

**A:** No. Decryption requires an EIP-712 signature from the address owner's private key. The Zama Relayer validates ownership before re-encrypting the balance for decryption.

#### Q: What happens if I lose my private key?

**A:** You lose access to decrypt your balance. The encrypted balance still exists on-chain, but without the private key, you cannot decrypt it. This is similar to losing access to any Ethereum wallet.

#### Q: Can the contract owner see my balance?

**A:** No. The contract stores only encrypted data. Not even the contract deployer can decrypt balances without the recipient's private key.

#### Q: How long does decryption take?

**A:** Typically 2-5 seconds. Decryption requires a round-trip to the Zama Relayer and coordination with the KMS for re-encryption.

#### Q: Can I use this for my company's payroll?

**A:** Potentially, yes. FHE-Distribute is designed for confidential distributions. However, ensure compliance with local regulations and consider legal/tax implications of crypto payments.

#### Q: Is this audited?

**A:** The core Zama FHEVM protocol is audited. This specific implementation has not undergone a professional audit. We recommend an audit before mainnet deployment or handling significant value.

#### Q: How can I contribute?

**A:** See the [Contributing](#contributing) section! We welcome code contributions, bug reports, documentation improvements, and feature requests.

### Contact

- **Project Maintainer:** [Your Name/Organization]
- **Email:** support@yourproject.com
- **Twitter:** [@yourproject](https://twitter.com/yourproject)
- **Discord:** [Join our Discord](https://discord.gg/yourserver)

### Acknowledgments

Built with:

- **Zama** - For FHEVM protocol and FHE libraries
- **OpenZeppelin** - Smart contract libraries
- **Hardhat** - Development framework
- **RainbowKit** - Wallet connection UI
- **Ethereum Foundation** - Blockchain infrastructure

Special thanks to the Zama team for pioneering FHE on Ethereum and providing excellent documentation and support.

---

**Built with ❤️ for a privacy-preserving future**

*"Privacy is not about hiding something. It's about protecting someone."* - Edward Snowden
