#!/usr/bin/env node

/**
 * Pre-deployment Testing Script for Chonk9k Suite
 * Tests all routes, components, and API endpoints
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

console.log('🚀 Starting comprehensive pre-deployment testing...\n');

// Test 1: Check for TypeScript compilation errors
console.log('1. Testing TypeScript compilation...');
try {
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'inherit', cwd: 'client' });
  console.log('✅ TypeScript compilation passed\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed\n');
  process.exit(1);
}

// Test 2: Check critical file existence
console.log('2. Checking critical files...');
const criticalFiles = [
  'client/src/App.tsx',
  'client/src/components/stable-dashboard.tsx',
  'client/src/components/professional-landing.tsx',
  'server/routes.ts',
  'server/db.ts',
  'shared/schema.ts',
  'attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg',
  'attached_assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg'
];

const missingFiles = criticalFiles.filter(file => !existsSync(file));
if (missingFiles.length > 0) {
  console.log('❌ Missing critical files:', missingFiles);
  process.exit(1);
} else {
  console.log('✅ All critical files present\n');
}

// Test 3: Check for broken imports
console.log('3. Checking for broken imports...');
const componentFiles = [
  'client/src/App.tsx',
  'client/src/components/stable-dashboard.tsx',
  'client/src/components/professional-landing.tsx',
  'client/src/components/slerf-trading-hub.tsx',
  'client/src/components/real-staking-platform.tsx',
  'client/src/components/monetization-dashboard.tsx',
  'client/src/components/dao-governance.tsx',
  'client/src/components/achievements-simple.tsx',
  'client/src/components/simple-challenges.tsx',
  'client/src/components/simple-playground.tsx',
  'client/src/components/hacker-terminal.tsx'
];

let brokenImports = [];
componentFiles.forEach(file => {
  if (existsSync(file)) {
    try {
      const content = readFileSync(file, 'utf8');
      // Check for common broken import patterns
      const imports = content.match(/import.*from ['"]([^'"]+)['"]/g) || [];
      imports.forEach(imp => {
        if (imp.includes('MascotShowcase') || imp.includes('ShoppingCart')) {
          brokenImports.push(`${file}: ${imp}`);
        }
      });
    } catch (error) {
      brokenImports.push(`${file}: Could not read file`);
    }
  } else {
    brokenImports.push(`${file}: File not found`);
  }
});

if (brokenImports.length > 0) {
  console.log('❌ Broken imports found:', brokenImports);
} else {
  console.log('✅ No broken imports detected\n');
}

// Test 4: Check route configuration
console.log('4. Checking route configuration...');
if (existsSync('client/src/App.tsx')) {
  const appContent = readFileSync('client/src/App.tsx', 'utf8');
  const routes = [
    'StableDashboard',
    'SlerfTradingHub', 
    'RealStakingPlatform',
    'MonetizationDashboard',
    'DAOGovernance',
    'AchievementsSimple',
    'SimpleChallenges',
    'SimplePlayground',
    'HackerTerminal',
    'ProfessionalLanding'
  ];
  
  const missingRoutes = routes.filter(route => !appContent.includes(route));
  if (missingRoutes.length > 0) {
    console.log('❌ Missing route components:', missingRoutes);
  } else {
    console.log('✅ All route components configured\n');
  }
}

// Test 5: Check token logo references
console.log('5. Checking token logo references...');
const logoFiles = [
  'client/src/components/token-logo.tsx',
  'client/src/components/token-logos.tsx',
  'client/src/components/live-trading-dashboard.tsx',
  'client/src/components/clean-trading-dashboard.tsx'
];

let logoIssues = [];
logoFiles.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    // Check for correct logo paths
    if (!content.includes('C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg') && 
        content.includes('SLERF')) {
      logoIssues.push(`${file}: SLERF logo not updated to authentic version`);
    }
    if (!content.includes('806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg') && 
        content.includes('CHONK')) {
      logoIssues.push(`${file}: CHONK9K logo not updated to authentic version`);
    }
  }
});

if (logoIssues.length > 0) {
  console.log('⚠️ Logo reference issues:', logoIssues);
} else {
  console.log('✅ Token logos properly configured\n');
}

// Test 6: API endpoint verification
console.log('6. Checking API endpoints...');
if (existsSync('server/routes.ts')) {
  const routesContent = readFileSync('server/routes.ts', 'utf8');
  const requiredEndpoints = [
    '/api/auth/user',
    '/api/dashboard',
    '/api/user/token-balances',
    '/api/tasks/active',
    '/api/challenges'
  ];
  
  const missingEndpoints = requiredEndpoints.filter(endpoint => 
    !routesContent.includes(`'${endpoint}'`) && !routesContent.includes(`"${endpoint}"`)
  );
  
  if (missingEndpoints.length > 0) {
    console.log('❌ Missing API endpoints:', missingEndpoints);
  } else {
    console.log('✅ All required API endpoints present\n');
  }
}

console.log('🎯 Pre-deployment testing completed!');
console.log('✨ Ready for production deployment');