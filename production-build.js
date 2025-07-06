#!/usr/bin/env node

// Production build script with optimizations
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting production build...');

try {
  // Clean existing dist
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build frontend with optimizations
  console.log('📦 Building frontend...');
  execSync('vite build --mode production', { stdio: 'inherit' });

  // Build backend
  console.log('🔧 Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', { stdio: 'inherit' });

  // Copy package.json for deployment
  const packageJson = {
    "name": "boomchain-labs",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "start": "NODE_ENV=production node dist/index.js"
    },
    "dependencies": {
      "@neondatabase/serverless": "^0.10.4",
      "drizzle-orm": "^0.36.1",
      "express": "^4.19.2",
      "express-session": "^1.18.1",
      "connect-pg-simple": "^9.0.1",
      "passport": "^0.7.0",
      "passport-local": "^1.0.0",
      "zod": "^3.23.8"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

  console.log('✅ Production build complete!');
  console.log('📁 Files ready in ./dist directory');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}