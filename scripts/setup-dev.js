#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Development Server on Port 8080...\n');

// Check if we have the correct package manager
const packageManager = 'pnpm';

try {
  // Check if pnpm is installed
  execSync('pnpm --version', { stdio: 'ignore' });
  console.log('✅ PNPM detected');
} catch (error) {
  console.log('❌ PNPM not found. Installing...');
  try {
    execSync('npm install -g pnpm', { stdio: 'inherit' });
    console.log('✅ PNPM installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install PNPM. Please install manually: npm install -g pnpm');
    process.exit(1);
  }
}

console.log('\n📦 Installing dependencies...');
try {
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('\n🔧 Checking environment configuration...');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('⚠️  .env file not found');
  console.log('📝 Creating .env file with default values...');
  
  const defaultEnv = `# Sentrysol AML Platform Environment Configuration
# Development Server Configuration
PORT=8080
NODE_ENV=development

# LangSmith Configuration
LANGSMITH_TRACING="true"
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_API_KEY="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"
LANGSMITH_PROJECT="sentry"

# AI Model Configuration
MISTRAL_API_KEY=3TRh2eDXjNBZ4hj7iD4O5PbgjSgman9J
MISTRAL_MODEL=ft:mistral-medium-latest:b319469f:20250807:b80c0dce

# Supabase Configuration
VITE_SUPABASE_URL=https://sdblpkltvzbkywuveuvc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYmxwa2x0dnpia3l3dXZldXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzA4NDksImV4cCI6MjA3MDY0Njg0OX0.xVEZluFu0LOpWOyBDdZWA9Dvfk7dHiVQwmf-TQsCGzk

# Helius RPC Configuration
HELIUS_API_KEY=49107f03-be28-4419-b417-8341142ba90a
RPC_URL=https://mainnet.helius-rpc.com/?api-key=49107f03-be28-4419-b417-8341142ba90a
STANDARD_WEBSOCKET_URL=wss://mainnet.helius-rpc.com/?api-key=49107f03-be28-4419-b417-8341142ba90a

# AML/Compliance APIs
CHAINABUSE_API_KEY=ca_UmZSSUNLV0NjN0d4M2tGSElocE1maGNBLjBFbTlyeWZHTFE5RDhyeFZmei9EdFE9PQ
METASLEUTH_WALLET_SCREENING_API_KEY=a39e9fd34b0b5a5b772744bfbbcb319af198e255ea72bb2d8e095c6596201958
METASLEUTH_ADDRESS_LABEL_API_KEY=4ec6543266f0de4274c65e6fe562fa490b317c326dabdaa89bc83573b4ccb36e

# Financial Data APIs
COINSTATS_API_KEY=nTJ5v0C2KFwvnzy18Vw6gfdQsGZq0PC/EHlAEYD0Iwo=
ETHERSCAN_API_KEY=MJHA7QDMIE1XJFV8K16SG1X1Y76DYG3E3H

# Development APIs
GITHUB_ACCESS_TOKEN=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

# Enhanced Solana APIs
HELIUS_PARSE_TRANSACTIONS_URL=https://api.helius.xyz/v0/transactions/?api-key=49107f03-be28-4419-b417-8341142ba90a
HELIUS_TRANSACTION_HISTORY_URL=https://api.helius.xyz/v0/addresses
`;
  
  fs.writeFileSync('.env', defaultEnv);
  console.log('✅ .env file created with default configuration');
} else {
  console.log('✅ .env file exists');
}

console.log('\n🔍 Verifying Vite configuration...');
const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  if (viteConfig.includes('port: 8080')) {
    console.log('✅ Vite configured for port 8080');
  } else {
    console.log('⚠️  Vite configuration may need port 8080 setup');
  }
} else {
  console.log('❌ vite.config.ts not found');
}

console.log('\n🎯 Development server setup complete!');
console.log('\n📋 Available commands:');
console.log('  pnpm dev        - Start development server on port 8080');
console.log('  pnpm build      - Build for production');
console.log('  pnpm start      - Start production server');
console.log('  pnpm test       - Run tests');
console.log('\n🌐 Server will be available at:');
console.log('  Local:    http://localhost:8080');
console.log('  Network:  http://[your-ip]:8080');
console.log('\n🚀 Ready to start! Run: pnpm dev');
