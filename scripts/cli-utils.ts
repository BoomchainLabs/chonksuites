#!/usr/bin/env tsx

/**
 * Web3 CLI Utilities for Chonk9k Suite
 * Essential blockchain operations for SLERF (Base) and CHONKPUMP (Solana)
 */

import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo, 
  transfer,
  getAssociatedTokenAddress,
  getAccount,
  // Import constants for compatibility
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { ethers } from 'ethers';
import { createPublicClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// Configuration
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const BASE_RPC_URL = 'https://mainnet.base.org';

// Token addresses
const SLERF_TOKEN_ADDRESS = '0x233df63325933fa3f2dac8e695cd84bb2f91ab07';
const CHONKPUMP_TOKEN_ADDRESS = 'DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump';

class Web3CLI {
  private solanaConnection: Connection;
  private baseClient: any;

  constructor() {
    this.solanaConnection = new Connection(SOLANA_RPC_URL);
    this.baseClient = createPublicClient({
      chain: base,
      transport: http(BASE_RPC_URL)
    });
  }

  // Solana Operations
  async getSolanaBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.solanaConnection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting Solana balance:', error);
      return 0;
    }
  }

  async getChonkpumpBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const tokenMint = new PublicKey(CHONKPUMP_TOKEN_ADDRESS);
      
      // Try to get associated token address first
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        publicKey
      );
      
      // Try to get account info without creating
      try {
        const tokenAccount = await getAccount(this.solanaConnection, associatedTokenAddress);
        return Number(tokenAccount.amount) / Math.pow(10, 9); // CHONKPUMP has 9 decimals
      } catch (accountError) {
        // Fallback to direct balance check
        const balance = await this.solanaConnection.getTokenAccountBalance(associatedTokenAddress);
        return parseFloat(balance.value.amount) / Math.pow(10, balance.value.decimals);
      }
    } catch (error) {
      console.error('Error getting CHONKPUMP balance:', error);
      return 0;
    }
  }

  // Base/Ethereum Operations
  async getBaseBalance(walletAddress: string): Promise<number> {
    try {
      const balance = await this.baseClient.getBalance({
        address: walletAddress as `0x${string}`
      });
      return parseFloat(formatEther(balance));
    } catch (error) {
      console.error('Error getting Base balance:', error);
      return 0;
    }
  }

  async getSlerfBalance(walletAddress: string): Promise<number> {
    try {
      // ERC-20 token balance check
      const tokenContract = {
        address: SLERF_TOKEN_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: 'balance', type: 'uint256' }]
          },
          {
            name: 'decimals',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ name: 'decimals', type: 'uint8' }]
          }
        ]
      };

      const [balance, decimals] = await Promise.all([
        this.baseClient.readContract({
          ...tokenContract,
          functionName: 'balanceOf',
          args: [walletAddress as `0x${string}`]
        }),
        this.baseClient.readContract({
          ...tokenContract,
          functionName: 'decimals'
        })
      ]);

      return parseFloat(formatEther(balance as bigint)) * Math.pow(10, 18 - (decimals as number));
    } catch (error) {
      console.error('Error getting SLERF balance:', error);
      return 0;
    }
  }

  // Wallet validation
  async validateSolanaWallet(address: string): Promise<boolean> {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  async validateEthereumWallet(address: string): Promise<boolean> {
    return ethers.isAddress(address);
  }

  // Network status
  async getSolanaNetworkStatus(): Promise<{ slot: number; blockhash: string }> {
    try {
      const slot = await this.solanaConnection.getSlot();
      const latestBlockhash = await this.solanaConnection.getLatestBlockhash();
      return {
        slot,
        blockhash: latestBlockhash.blockhash
      };
    } catch (error) {
      console.error('Error getting Solana network status:', error);
      return { slot: 0, blockhash: '' };
    }
  }

  async getBaseNetworkStatus(): Promise<{ blockNumber: number }> {
    try {
      const blockNumber = await this.baseClient.getBlockNumber();
      return { blockNumber: Number(blockNumber) };
    } catch (error) {
      console.error('Error getting Base network status:', error);
      return { blockNumber: 0 };
    }
  }
}

// CLI Commands
async function main() {
  const cli = new Web3CLI();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'balance':
      const walletAddress = args[1];
      const network = args[2]; // 'solana' or 'base'
      
      if (!walletAddress) {
        console.error('Usage: npm run cli balance <wallet-address> <network>');
        process.exit(1);
      }

      if (network === 'solana') {
        const solBalance = await cli.getSolanaBalance(walletAddress);
        const chonkBalance = await cli.getChonkpumpBalance(walletAddress);
        console.log(`SOL Balance: ${solBalance}`);
        console.log(`CHONKPUMP Balance: ${chonkBalance}`);
      } else if (network === 'base') {
        const ethBalance = await cli.getBaseBalance(walletAddress);
        const slerfBalance = await cli.getSlerfBalance(walletAddress);
        console.log(`ETH Balance: ${ethBalance}`);
        console.log(`SLERF Balance: ${slerfBalance}`);
      } else {
        console.error('Network must be "solana" or "base"');
        process.exit(1);
      }
      break;

    case 'validate':
      const addressToValidate = args[1];
      const networkType = args[2];
      
      if (!addressToValidate || !networkType) {
        console.error('Usage: npm run cli validate <address> <network>');
        process.exit(1);
      }

      let isValid = false;
      if (networkType === 'solana') {
        isValid = await cli.validateSolanaWallet(addressToValidate);
      } else if (networkType === 'base' || networkType === 'ethereum') {
        isValid = await cli.validateEthereumWallet(addressToValidate);
      }
      
      console.log(`Address ${addressToValidate} is ${isValid ? 'valid' : 'invalid'} for ${networkType}`);
      break;

    case 'status':
      console.log('Checking network status...');
      const [solanaStatus, baseStatus] = await Promise.all([
        cli.getSolanaNetworkStatus(),
        cli.getBaseNetworkStatus()
      ]);
      
      console.log('Solana Network:');
      console.log(`  Current Slot: ${solanaStatus.slot}`);
      console.log(`  Latest Blockhash: ${solanaStatus.blockhash.slice(0, 20)}...`);
      
      console.log('Base Network:');
      console.log(`  Block Number: ${baseStatus.blockNumber}`);
      break;

    case 'help':
    default:
      console.log(`
Chonk9k Suite Web3 CLI

Available Commands:
  balance <wallet-address> <network>  - Check wallet balances
  validate <address> <network>        - Validate wallet address format
  status                              - Check network status
  help                                - Show this help message

Examples:
  npm run cli balance 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana
  npm run cli balance 0x1234...5678 base
  npm run cli validate 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana
  npm run cli status
      `);
      break;
  }
}

// Check if this is the main module
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  main().catch(console.error);
}

export default Web3CLI;