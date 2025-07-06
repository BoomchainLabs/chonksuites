/**
 * SPL Token Compatibility Layer
 * Handles different versions of @solana/spl-token package
 */

import { Connection, PublicKey } from '@solana/web3.js';

// Version detection and compatibility layer
let SPL_TOKEN_VERSION: string | null = null;
let compatibilityMode: 'v0.1.x' | 'v0.4.x' | 'unknown' = 'unknown';

// Dynamic imports based on version
let getAssociatedTokenAddress: any;
let getAccount: any;
let TOKEN_PROGRAM_ID: PublicKey;
let ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey;

// Initialize the compatibility layer
export async function initSPLTokenCompatibility() {
  try {
    // Try to import the new API first (v0.4.x)
    const newAPI = await import('@solana/spl-token');
    
    getAssociatedTokenAddress = newAPI.getAssociatedTokenAddress;
    getAccount = newAPI.getAccount;
    TOKEN_PROGRAM_ID = newAPI.TOKEN_PROGRAM_ID;
    ASSOCIATED_TOKEN_PROGRAM_ID = newAPI.ASSOCIATED_TOKEN_PROGRAM_ID;
    
    // Test if the new API functions exist
    if (getAssociatedTokenAddress && getAccount) {
      compatibilityMode = 'v0.4.x';
      console.log('✅ SPL Token v0.4.x API detected');
    } else {
      throw new Error('New API functions not found');
    }
  } catch (error) {
    // Fallback to old API (v0.1.x)
    try {
      const oldAPI = await import('@solana/spl-token');
      
      // In v0.1.x, the API was different
      if (oldAPI.TOKEN_PROGRAM_ID) {
        compatibilityMode = 'v0.1.x';
        TOKEN_PROGRAM_ID = oldAPI.TOKEN_PROGRAM_ID;
        
        // For v0.1.x, we need to implement the functions ourselves
        getAssociatedTokenAddress = createV1GetAssociatedTokenAddress;
        getAccount = createV1GetAccount;
        
        console.log('✅ SPL Token v0.1.x API detected, using compatibility layer');
      } else {
        throw new Error('Unknown SPL Token version');
      }
    } catch (fallbackError) {
      console.error('❌ Could not detect SPL Token version:', fallbackError);
      compatibilityMode = 'unknown';
    }
  }
}

// Compatibility functions for v0.1.x
function createV1GetAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
  // Manual implementation for v0.1.x
  return PublicKey.findProgramAddress(
    [
      owner.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL') // ASSOCIATED_TOKEN_PROGRAM_ID
  ).then(([address]) => address);
}

async function createV1GetAccount(connection: Connection, address: PublicKey): Promise<any> {
  // Manual implementation for v0.1.x
  const accountInfo = await connection.getAccountInfo(address);
  if (!accountInfo) {
    throw new Error('Account not found');
  }
  
  // Parse the account data manually (simplified version)
  const data = accountInfo.data;
  if (data.length < 165) {
    throw new Error('Invalid account data');
  }
  
  // Extract token account data (simplified parsing)
  const mint = new PublicKey(data.slice(0, 32));
  const owner = new PublicKey(data.slice(32, 64));
  const amountBytes = data.slice(64, 72);
  const amount = BigInt('0x' + Array.from(amountBytes).reverse().map(b => b.toString(16).padStart(2, '0')).join(''));
  
  return {
    mint,
    owner,
    amount,
    delegateOption: 0,
    delegate: null,
    state: 1,
    isNativeOption: 0,
    isNative: BigInt(0),
    delegatedAmount: BigInt(0),
    closeAuthorityOption: 0,
    closeAuthority: null
  };
}

// Unified API that works with both versions
export class CompatibleSPLToken {
  private connection: Connection;
  
  constructor(connection: Connection) {
    this.connection = connection;
  }
  
  async getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
    if (compatibilityMode === 'unknown') {
      await initSPLTokenCompatibility();
    }
    
    if (!getAssociatedTokenAddress) {
      throw new Error('getAssociatedTokenAddress not available');
    }
    
    return getAssociatedTokenAddress(mint, owner);
  }
  
  async getAccount(address: PublicKey): Promise<any> {
    if (compatibilityMode === 'unknown') {
      await initSPLTokenCompatibility();
    }
    
    if (!getAccount) {
      throw new Error('getAccount not available');
    }
    
    return getAccount(this.connection, address);
  }
  
  async getTokenBalance(mint: PublicKey, owner: PublicKey): Promise<number> {
    try {
      const associatedTokenAddress = await this.getAssociatedTokenAddress(mint, owner);
      
      // Try the new API first
      try {
        const tokenAccount = await this.getAccount(associatedTokenAddress);
        return Number(tokenAccount.amount) / Math.pow(10, 9); // Assuming 9 decimals
      } catch (accountError) {
        // Fallback to direct balance query
        const balance = await this.connection.getTokenAccountBalance(associatedTokenAddress);
        return parseFloat(balance.value.amount) / Math.pow(10, balance.value.decimals);
      }
    } catch (error) {
      console.log('Token balance retrieval failed:', error);
      return 0;
    }
  }
  
  getCompatibilityMode(): string {
    return compatibilityMode;
  }
}

// Initialize on import
initSPLTokenCompatibility().catch(console.error);