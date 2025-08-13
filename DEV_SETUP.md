# Development Server Setup - Port 8080

## Quick Start

### 1. Setup Dependencies

```bash
npm run setup
```

This command will:

- Install PNPM if not available
- Install all project dependencies
- Create `.env` file with default configuration
- Verify Vite configuration for port 8080

### 2. Start Development Server

```bash
npm run dev
```

This starts the development server on port 8080.

## Alternative Commands

### Full Setup and Start

```bash
npm run dev:start
```

Runs setup and immediately starts the dev server.

### Manual Steps

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Server Configuration

- **Port**: 8080
- **Host**: 0.0.0.0 (accessible from network)
- **Local URL**: http://localhost:8080
- **Network Access**: http://[your-ip]:8080

## Features

### 🔧 Development Features

- **Hot Module Replacement (HMR)** - Live reloading
- **TypeScript Support** - Full type checking
- **Express API Integration** - Backend API available during dev
- **Multi-Chain Wallet Support** - Solana, Ethereum, Polygon, Arbitrum

### 🧠 AI/ML Capabilities

- **LangChain Integration** - Multi-agent AI workflows
- **Mistral AI** - Advanced language model analysis
- **LangSmith Tracing** - AI operation monitoring
- **Real-time Analysis** - Live transaction monitoring

### 🛡️ AML/Compliance Features

- **MetaSleuth Integration** - Wallet screening
- **Chainabuse API** - Sanctions checking
- **Helius RPC** - Enhanced Solana data
- **Coinstats API** - Multi-chain portfolio data
- **PEP Checking** - Political exposure screening

## Environment Variables

The setup script creates a `.env` file with all necessary API keys and configuration. Key variables include:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# AI Configuration
MISTRAL_API_KEY=...
LANGSMITH_API_KEY=...

# Blockchain APIs
HELIUS_API_KEY=...
CHAINABUSE_API_KEY=...
METASLEUTH_WALLET_SCREENING_API_KEY=...
COINSTATS_API_KEY=...
```

## Troubleshooting

### Port 8080 Already in Use

```bash
# Find and kill process using port 8080
lsof -ti:8080 | xargs kill -9

# Or use a different port
npm run dev -- --port 8081
```

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm run setup
```

### Environment Issues

```bash
# Recreate .env file
rm .env
npm run setup
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start:prod
```

## Available Scripts

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `npm run setup`      | Setup development environment         |
| `npm run dev`        | Start development server on port 8080 |
| `npm run dev:start`  | Setup and start in one command        |
| `npm run build`      | Build for production                  |
| `npm run start`      | Start production server               |
| `npm run start:prod` | Start production server on port 8080  |
| `npm run test`       | Run tests                             |
| `npm run typecheck`  | Check TypeScript types                |

## Architecture

```
Sentrysol AML Platform
├── Client (React + Vite) - Port 8080
├── Server (Express + Node.js) - Integrated
├── AI Agents (LangChain + Mistral)
├── Blockchain APIs (Multi-chain)
└── Compliance Services (Real-time)
```

## Next Steps

After setup:

1. Visit http://localhost:8080
2. Connect your wallet (Phantom, MetaMask, etc.)
3. Start using AML investigation features
4. Explore the multi-agent AI analysis
5. Test real-time compliance monitoring

## Support

For development issues:

- Check the browser console for errors
- Review the terminal output for server logs
- Ensure all environment variables are set
- Verify API keys are valid and active
