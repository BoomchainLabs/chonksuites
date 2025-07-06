# Chonk9k Suite CLI Tools

Essential Web3 command-line utilities for managing $LERF (Base) and $CHONK9K (Solana) tokens.

## Quick Start

```bash
# Make CLI executable
chmod +x scripts/cli.sh

# Check network status
./scripts/cli.sh status

# Validate wallet addresses
./scripts/cli.sh validate 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana
./scripts/cli.sh validate 0x1234567890123456789012345678901234567890 base

# Check wallet balances
./scripts/cli.sh balance 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana
./scripts/cli.sh balance 0x1234567890123456789012345678901234567890 base
```

## Available Tools

### 1. Web3 CLI (`scripts/cli-utils.ts`)

Core blockchain operations for both networks.

```bash
# Direct usage with tsx
tsx scripts/cli-utils.ts balance <wallet-address> <network>
tsx scripts/cli-utils.ts validate <address> <network>
tsx scripts/cli-utils.ts status

# Using the wrapper script
./scripts/cli.sh balance <wallet-address> <network>
./scripts/cli.sh validate <address> <network>
./scripts/cli.sh status
```

**Features:**
- Real-time balance checking for SOL, ETH, SLERF, and CHONKPUMP
- Wallet address validation for both Solana and Ethereum formats
- Network status monitoring (current slot/block numbers)
- Support for Base Layer 2 and Solana mainnet

### 2. Token Manager (`scripts/token-manager.ts`)

Advanced token information and management utilities.

```bash
# Direct usage
tsx scripts/token-manager.ts check SLERF
tsx scripts/token-manager.ts check CHONKPUMP
tsx scripts/token-manager.ts balance <wallet> <network>
tsx scripts/token-manager.ts report
tsx scripts/token-manager.ts validate

# Using the wrapper script
./scripts/cli.sh token check SLERF
./scripts/cli.sh token check CHONKPUMP
./scripts/cli.sh token balance <wallet> <network>
./scripts/cli.sh token report
./scripts/cli.sh token validate
```

**Features:**
- Detailed token information (symbol, decimals, total supply)
- Multi-token balance checking
- Token address validation
- Distribution reports
- Support for Token Extensions on Solana

### 3. Web3 Service (`server/web3-service.ts`)

Backend integration service for the dashboard.

**Features:**
- Real token balance fetching for dashboard display
- Wallet address validation
- Network health monitoring
- Token transfer simulation
- Price data integration ready

## Token Information

### SLERF ($LERF) (Base Chain)
- **Token Name**: SLERF
- **Symbol**: $LERF
- **Address**: `0x233df63325933fa3f2dac8e695cd84bb2f91ab07`
- **Network**: Base (Ethereum L2)
- **Standard**: ERC-20
- **Decimals**: 18

### CHONK9K ($CHONK9K) (Solana)
- **Token Name**: CHONK9K
- **Symbol**: $CHONK9K
- **Address**: `DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump`
- **Network**: Solana Mainnet
- **Standard**: SPL Token
- **Decimals**: 9

## Command Examples

### Balance Checking
```bash
# Check Solana wallet (SOL + CHONKPUMP)
./scripts/cli.sh balance 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana

# Check Base wallet (ETH + SLERF)
./scripts/cli.sh balance 0x742d35Cc6634C0532925a3b8D65291ff9abB7a9A base
```

### Token Information
```bash
# Get SLERF token details
./scripts/cli.sh token check SLERF

# Get CHONKPUMP token details
./scripts/cli.sh token check CHONKPUMP

# Generate complete token report
./scripts/cli.sh token report
```

### Validation
```bash
# Validate Solana address
./scripts/cli.sh validate 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana

# Validate Ethereum/Base address
./scripts/cli.sh validate 0x742d35Cc6634C0532925a3b8D65291ff9abB7a9A base

# Validate all token addresses
./scripts/cli.sh token validate
```

### Network Status
```bash
# Check both networks
./scripts/cli.sh status
```

## Dependencies

All CLI tools use the following packages:
- `@solana/web3.js` - Solana blockchain interaction
- `@solana/spl-token` - SPL token operations
- `ethers` - Ethereum utilities
- `viem` - Modern Ethereum client
- `wagmi` - React hooks for Ethereum

## Configuration

### Environment Variables
```bash
# Optional: Custom RPC endpoints
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
BASE_RPC_URL=https://mainnet.base.org
```

### Network Endpoints
- **Solana**: `https://api.mainnet-beta.solana.com`
- **Base**: `https://mainnet.base.org`

## Error Handling

The CLI tools include comprehensive error handling:
- Network connectivity issues
- Invalid wallet addresses
- Token account not found scenarios
- RPC endpoint failures

Failed operations will display clear error messages and fallback to safe defaults where appropriate.

## Integration with Dashboard

The Web3 service (`server/web3-service.ts`) provides backend integration for:
- Real-time token balance display
- Wallet validation during connection
- Network status health checks
- Token transfer simulations for rewards

This enables the dashboard to show actual blockchain data while maintaining the gamified experience.