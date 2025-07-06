# Replit Project Documentation

## Overview

This is a full-stack web application built with React, TypeScript, and Express.js that implements a gamified rewards system with wallet integration. The application features a token-based rewards system where users can complete daily tasks, earn loyalty points, and participate in a referral program. The frontend uses modern UI components from shadcn/ui with a custom gaming aesthetic, while the backend provides REST API endpoints for user management, task completion, and reward tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Design System**: Custom gaming theme with neon colors and glassmorphism effects

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL session store

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with type-safe query builder
- **Schema Definition**: Shared schema between frontend and backend
- **Migrations**: Drizzle Kit for database migrations
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple

## Key Components

### Database Schema
- **users**: Core user data with wallet addresses, login streaks, and reward metrics
- **tasks**: Daily/weekly tasks with reward values and metadata
- **userTasks**: Junction table tracking user task completion
- **tokenBalances**: User token holdings (SLERF, CHONKPUMP)
- **referrals**: Referral program tracking
- **activities**: User activity logging

### API Endpoints
- **POST /api/connect-wallet**: Wallet connection and user authentication
- **GET /api/dashboard**: User dashboard data aggregation
- **POST /api/tasks/complete**: Task completion and reward distribution
- **POST /api/claim**: Reward claiming mechanism
- **GET /api/referral/stats**: Referral statistics
- **GET /api/loyalty-score**: Loyalty score calculation

### Frontend Components
- **WalletConnect**: Multi-chain wallet connection (EVM/Solana)
- **DailyTasks**: Task completion interface
- **TokenBalances**: Real-time token balance display
- **LoyaltyScore**: Gamified loyalty scoring system
- **ReferralSystem**: Referral link generation and tracking
- **ClaimRewards**: Reward claiming interface

## Data Flow

1. **User Authentication**: Users connect their wallet (EVM or Solana) to authenticate
2. **Dashboard Loading**: User data is fetched and aggregated from multiple database tables
3. **Task Completion**: Users complete tasks, triggering reward calculations and database updates
4. **Loyalty Scoring**: Real-time loyalty score calculation based on login streaks, referrals, and activity
5. **Reward Distribution**: Pending rewards are tracked and can be claimed by users
6. **Referral Processing**: Referral links are generated and tracked for reward distribution

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI components for accessibility
- **class-variance-authority**: Component variant management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library
- **date-fns**: Date manipulation utilities

### Backend Dependencies
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Neon Database serverless driver
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store
- **zod**: Runtime type validation

### Development Dependencies
- **tsx**: TypeScript execution engine
- **esbuild**: Fast JavaScript bundler
- **vite**: Frontend build tool and dev server
- **drizzle-kit**: Database migrations and introspection

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution with hot reload
- **Database**: Development database with push-based schema updates

### Production Build
- **Frontend**: Vite build outputting to `dist/public`
- **Backend**: esbuild bundling server code to `dist/index.js`
- **Database**: Migration-based schema management
- **Deployment**: Single Node.js process serving both API and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Session Management**: Secure session configuration for production

## Changelog

Changelog:
- July 06, 2025. Initial setup
- July 06, 2025. Added PostgreSQL database with Drizzle ORM, migrated from in-memory storage to persistent database storage

## User Preferences

Preferred communication style: Simple, everyday language.