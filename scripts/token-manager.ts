#!/usr/bin/env tsx

/**
 * Token Manager CLI for Chonk9k Suite
 * Advanced token operations and management for SLERF and CHONKPUMP
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ethers } from 'ethers';
import { createPublicClient, http, formatEther, getContract } from 'viem';
import { base } from 'viem/chains';

// Configuration
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const BASE_RPC_URL = 'https://mainnet.base.org';

// Token configurations
const TOKENS = {
  SLERF: {
    address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
    network: 'base',
    symbol: 'SLERF',
    decimals: 18
  },
  CHONKPUMP: {
    address: 'DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump',
    network: 'solana',
    symbol: 'CHONKPUMP',
    decimals: 9
  }
};

// ERC-20 ABI for token operations
const ERC20_ABI = [
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
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'symbol', type: 'string' }]
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'totalSupply', type: 'uint256' }]
  }
] as const;

class TokenManager {
  private solanaConnection: Connection;
  private baseClient: any;

  constructor() {
    this.solanaConnection = new Connection(SOLANA_RPC_URL);
    this.baseClient = createPublicClient({
      chain: base,
      transport: http(BASE_RPC_URL)
    });
  }

  // Check token information
  async checkTokenInfo(tokenSymbol: keyof typeof TOKENS): Promise<void> {
    const token = TOKENS[tokenSymbol];
    
    console.log(`\n=== ${token.symbol} Token Information ===`);
    console.log(`Address: ${token.address}`);
    console.log(`Network: ${token.network}`);
    console.log(`Decimals: ${token.decimals}`);

    if (token.network === 'base') {
      await this.checkERC20TokenInfo(token.address);
    } else if (token.network === 'solana') {
      await this.checkSolanaTokenInfo(token.address);
    }
  }

  private async checkERC20TokenInfo(tokenAddress: string): Promise<void> {
    try {
      const contract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        client: this.baseClient
      });

      const [symbol, decimals, totalSupply] = await Promise.all([
        this.baseClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'symbol'
        }),
        this.baseClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'decimals'
        }),
        this.baseClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'totalSupply'
        })
      ]);

      console.log(`Symbol: ${symbol}`);
      console.log(`Decimals: ${decimals}`);
      console.log(`Total Supply: ${formatEther(totalSupply as bigint)} ${symbol}`);
    } catch (error) {
      console.error(`Error fetching token info: ${error}`);
    }
  }

  private async checkSolanaTokenInfo(tokenAddress: string): Promise<void> {
    try {
      const mintPublicKey = new PublicKey(tokenAddress);
      const mintInfo = await this.solanaConnection.getParsedAccountInfo(mintPublicKey);
      
      if (mintInfo.value?.data && 'parsed' in mintInfo.value.data) {
        const parsedData = mintInfo.value.data.parsed;
        console.log(`Mint Authority: ${parsedData.info.mintAuthority || 'None'}`);
        console.log(`Supply: ${parsedData.info.supply}`);
        console.log(`Decimals: ${parsedData.info.decimals}`);
        console.log(`Is Initialized: ${parsedData.info.isInitialized}`);
      }
    } catch (error) {
      console.error(`Error fetching Solana token info: ${error}`);
    }
  }

  // Check wallet balances for both tokens
  async checkWalletBalances(walletAddress: string, network: 'solana' | 'base'): Promise<void> {
    console.log(`\n=== Wallet Balances: ${walletAddress} ===`);

    if (network === 'solana') {
      await this.checkSolanaWalletBalances(walletAddress);
    } else if (network === 'base') {
      await this.checkBaseWalletBalances(walletAddress);
    }
  }

  private async checkSolanaWalletBalances(walletAddress: string): Promise<void> {
    try {
      const publicKey = new PublicKey(walletAddress);
      
      // SOL balance
      const solBalance = await this.solanaConnection.getBalance(publicKey);
      console.log(`SOL: ${solBalance / LAMPORTS_PER_SOL}`);

      // CHONKPUMP token balance
      const chonkpumpMint = new PublicKey(TOKENS.CHONKPUMP.address);
      const associatedTokenAddress = await getAssociatedTokenAddress(
        chonkpumpMint,
        publicKey
      );

      try {
        const tokenAccount = await getAccount(this.solanaConnection, associatedTokenAddress);
        const balance = Number(tokenAccount.amount) / Math.pow(10, TOKENS.CHONKPUMP.decimals);
        console.log(`CHONKPUMP: ${balance}`);
      } catch (error) {
        console.log(`CHONKPUMP: 0 (No token account found)`);
      }

    } catch (error) {
      console.error(`Error checking Solana balances: ${error}`);
    }
  }

  private async checkBaseWalletBalances(walletAddress: string): Promise<void> {
    try {
      // ETH balance
      const ethBalance = await this.baseClient.getBalance({
        address: walletAddress as `0x${string}`
      });
      console.log(`ETH: ${formatEther(ethBalance)}`);

      // SLERF token balance
      const slerfBalance = await this.baseClient.readContract({
        address: TOKENS.SLERF.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`]
      });

      const formattedBalance = Number(formatEther(slerfBalance as bigint));
      console.log(`SLERF: ${formattedBalance}`);

    } catch (error) {
      console.error(`Error checking Base balances: ${error}`);
    }
  }

  // Generate token distribution report
  async generateDistributionReport(): Promise<void> {
    console.log('\n=== Token Distribution Report ===');
    
    for (const [symbol, token] of Object.entries(TOKENS)) {
      console.log(`\n--- ${symbol} ---`);
      await this.checkTokenInfo(symbol as keyof typeof TOKENS);
    }
  }

  // Validate token addresses
  async validateTokenAddresses(): Promise<void> {
    console.log('\n=== Token Address Validation ===');

    for (const [symbol, token] of Object.entries(TOKENS)) {
      let isValid = false;
      
      if (token.network === 'solana') {
        try {
          new PublicKey(token.address);
          isValid = true;
        } catch {
          isValid = false;
        }
      } else if (token.network === 'base') {
        isValid = ethers.isAddress(token.address);
      }

      console.log(`${symbol} (${token.network}): ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
  }
}

// CLI Commands
async function main() {
  const tokenManager = new TokenManager();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'check':
      const tokenSymbol = args[1] as keyof typeof TOKENS;
      
      if (tokenSymbol && TOKENS[tokenSymbol]) {
        await tokenManager.checkTokenInfo(tokenSymbol);
      } else {
        console.log('Available tokens: SLERF, CHONKPUMP');
        console.log('Usage: npm run token:check <SLERF|CHONKPUMP>');
      }
      break;

    case 'balance':
      const walletAddress = args[1];
      const network = args[2] as 'solana' | 'base';
      
      if (!walletAddress || !network) {
        console.error('Usage: npm run token:balance <wallet-address> <solana|base>');
        process.exit(1);
      }

      await tokenManager.checkWalletBalances(walletAddress, network);
      break;

    case 'report':
      await tokenManager.generateDistributionReport();
      break;

    case 'validate':
      await tokenManager.validateTokenAddresses();
      break;

    case 'help':
    default:
      console.log(`
Chonk9k Suite Token Manager CLI

Available Commands:
  check <token>                       - Check token information (SLERF|CHONKPUMP)
  balance <wallet-address> <network>  - Check wallet token balances
  report                              - Generate complete token distribution report
  validate                            - Validate all token addresses
  help                                - Show this help message

Examples:
  npm run token:check SLERF
  npm run token:check CHONKPUMP
  tsx scripts/token-manager.ts balance 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana
  tsx scripts/token-manager.ts balance 0x1234...5678 base
  tsx scripts/token-manager.ts report
  tsx scripts/token-manager.ts validate
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

export default TokenManager;