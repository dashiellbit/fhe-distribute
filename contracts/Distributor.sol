// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {IConfidentialFungibleToken} from "new-confidential-contracts/interfaces/IConfidentialFungibleToken.sol";

/// @title Confidential Batch Distributor
/// @notice Distributes confidential amounts of a ConfidentialFungibleToken to multiple recipients.
/// @dev Amounts are supplied as encrypted inputs and consumed with FHE ACL.
contract Distributor is SepoliaConfig {
    IConfidentialFungibleToken public immutable token;

    /// @param _token Address of a ConfidentialFungibleToken-compliant token (e.g., ConfidentialETH)
    constructor(address _token) {
        require(_token != address(0), "invalid token");
        token = IConfidentialFungibleToken(_token);
    }

    /// @notice Distribute encrypted amounts to recipients in a single call
    /// @param recipients List of recipient addresses
    /// @param encryptedAmounts List of encrypted amounts (external handles)
    /// @param inputProof Zama input proof corresponding to the ciphertexts
    /// @dev The function converts external encrypted inputs to internal euint64 values, grants
    ///      transient ACL access to the token contract, and then transfers from this contract's balance.
    function batchDistributeEncrypted(
        address[] calldata recipients,
        externalEuint64[] calldata encryptedAmounts,
        bytes calldata inputProof
    ) external {
        uint256 n = recipients.length;
        require(n == encryptedAmounts.length, "length mismatch");

        for (uint256 i = 0; i < n; i++) {
            euint64 amount = FHE.fromExternal(encryptedAmounts[i], inputProof);
            // Allow the token contract to consume this ciphertext during the transfer
            FHE.allowTransient(amount, address(token));
            token.confidentialTransfer(recipients[i], amount);
        }
    }

    /// @notice Read the token address used by this distributor
    function tokenAddress() external view returns (address) {
        return address(token);
    }
}

