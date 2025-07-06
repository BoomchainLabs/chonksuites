# Chonk9k Suite - Deployment Guide for boomchainlab.com

## Project Overview
Full-stack Web3 loyalty gaming platform with blockchain integration for SLERF (Base) and CHONK9K (Solana) tokens.

## Production Build Process

### 1. Environment Variables Required
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Session Security
SESSION_SECRET=your-secure-session-secret-key

# Optional: Blockchain API Keys
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
BASE_RPC_URL=https://mainnet.base.org
```

### 2. Build Commands
```bash
# Install dependencies
npm install

# Build production assets
npm run build

# Start production server
npm start
```

### 3. Build Output
- Frontend: `dist/public/` (static assets)
- Backend: `dist/index.js` (bundled server)
- Database: PostgreSQL schema via Drizzle ORM

### 4. Server Configuration
- **Port**: 5000 (configurable via PORT env var)
- **Static Files**: Served from `dist/public`
- **API Routes**: `/api/*`
- **Database**: PostgreSQL with connection pooling

## Deployment Features

### Web3 Integration
- Solana wallet connection (Phantom, Solflare)
- Base chain wallet connection (MetaMask, WalletConnect)
- Real-time token balance tracking
- Blockchain transaction simulation

### Gaming Features
- Daily task completion system
- SLERF mining game with click mechanics
- Price prediction game
- Trivia rewards system
- Loyalty scoring algorithm

### NFT & Trading
- NFT marketplace with collection management
- Token staking pools (SLERF/CHONK9K)
- Trading charts with real-time data
- Professional staking tiers

### Security
- Express session management
- PostgreSQL session store
- CORS configuration
- Input validation with Zod schemas

## Post-Deployment Checklist

1. **Database Setup**
   - Run `npm run db:push` to initialize schema
   - Verify database connection
   - Check table creation

2. **Web3 Services**
   - Test Solana RPC connectivity
   - Verify Base chain integration
   - Check token balance endpoints

3. **Frontend Assets**
   - Verify static file serving
   - Check logo and asset loading
   - Test responsive design

4. **API Endpoints**
   - Test authentication flow
   - Verify task completion
   - Check reward claiming

## Domain Configuration for boomchainlab.com

The project is configured to work with any domain. Key considerations:

- **CORS**: Configure for boomchainlab.com origin
- **Session Cookies**: Set secure domain settings
- **Asset URLs**: Use relative paths (already configured)
- **API Base URL**: Auto-detects current domain

## Performance Optimizations

- **Frontend**: Vite production build with asset optimization
- **Backend**: esbuild bundling for minimal size
- **Database**: Connection pooling with pgPool
- **Static Assets**: Efficient serving via Express

## Monitoring & Logs

- Express request logging
- Database query monitoring
- Web3 service status checks
- User activity tracking