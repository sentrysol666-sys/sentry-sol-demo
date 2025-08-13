# 🚀 Sentrysol AML Platform - Development Server Setup

## Quick Deployment on Port 8080

### 🎯 One-Click Setup & Deploy

#### Option 1: Automated Setup (Recommended)
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat

# Or using NPM
npm run dev:start
```

#### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
npm run setup

# 3. Start development server
npm run dev
```

## 📋 Requirements

- **Node.js** 18.0.0 or higher
- **NPM** 8.0.0 or higher (PNPM recommended)
- **Port 8080** must be available

## 🌐 Server Access

Once running, the server will be available at:

- **Local Development**: http://localhost:8080
- **Network Access**: http://[your-ip-address]:8080
- **Docker**: http://0.0.0.0:8080

## 🔧 Configuration Details

### Port Configuration
The development server is configured to run on **port 8080** with the following settings:

```typescript
// vite.config.ts
server: {
  host: "0.0.0.0",     // Allow external connections
  port: 8080,           // Fixed port
  strictPort: true,     // Exit if port unavailable
  open: true,           // Auto-open browser
  cors: true,           // Enable CORS
  hmr: { port: 8081 }   // HMR on separate port
}
```

### Environment Variables
```env
PORT=8080
NODE_ENV=development
VITE_DEV_SERVER_PORT=8080
```

## 🛠️ Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Setup** | `npm run setup` | Complete environment setup |
| **Development** | `npm run dev` | Start dev server on port 8080 |
| **Quick Start** | `npm run dev:start` | Setup + start in one command |
| **Build** | `npm run build` | Production build |
| **Production** | `npm run start:prod` | Production server on port 8080 |

## 🏗️ Architecture

### Frontend (Port 8080)
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Material Design Icons**
- **Wallet Integration** (Multi-chain)

### Backend (Integrated)
- **Express.js** API server
- **LangChain** AI agents
- **Real-time** blockchain data
- **AML/Compliance** services

### AI/ML Stack
- **LangGraph** for agent workflows
- **Mistral AI** for analysis
- **LangSmith** for tracing
- **Multi-agent** architecture

## 🔌 API Integrations

### Blockchain Data
- **Helius** - Solana enhanced data
- **Coinstats** - Multi-chain portfolios
- **Etherscan** - Ethereum data

### Compliance Services
- **MetaSleuth** - Wallet screening
- **Chainabuse** - Sanctions checking
- **PEP Checker** - Political exposure

### Wallet Support
- **Solana**: Phantom, Solflare, Backpack
- **Ethereum**: MetaMask, WalletConnect
- **Multi-chain**: Polygon, Arbitrum, BSC

## 🚨 Troubleshooting

### Port 8080 In Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill process (Linux/Mac)
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm run setup
```

### Build Issues
```bash
# Clear build cache
rm -rf dist .vite
npm run build
```

### Environment Issues
```bash
# Recreate environment
rm .env
npm run setup
```

## 🌐 Network Configuration

### Local Network Access
To access from other devices on your network:

1. Find your IP address:
   ```bash
   # Linux/Mac
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. Access via: `http://[your-ip]:8080`

### Firewall Configuration
Ensure port 8080 is open:

```bash
# Linux (UFW)
sudo ufw allow 8080

# Windows Firewall
# Add inbound rule for port 8080
```

## 📊 Development Features

### Hot Module Replacement (HMR)
- **Fast Refresh** for React components
- **Instant Updates** without page reload
- **State Preservation** during development

### TypeScript Support
- **Full Type Checking** in real-time
- **IntelliSense** and auto-completion
- **Error Detection** before runtime

### API Development
- **Express Integration** with Vite
- **Real-time APIs** during development
- **AI Agent Testing** in dev mode

## 🔒 Security Considerations

### Development Security
- **CORS** enabled for local development
- **API Keys** in environment variables
- **No Production Secrets** in dev mode

### Network Security
- **Localhost** by default
- **Network Access** configurable
- **HTTPS** available with certificates

## 📈 Performance Optimization

### Development Mode
- **Fast Startup** with Vite
- **Efficient HMR** for quick iterations
- **Lazy Loading** for large codebases

### Production Build
- **Code Splitting** for optimal loading
- **Tree Shaking** to reduce bundle size
- **Compression** for faster delivery

## 📝 Logging

### Development Logs
- **Console Output** for server logs
- **Browser DevTools** for client logs
- **File Logging** in `logs/` directory

### Log Files
```
logs/
├── dev-server.log    # Development server logs
├── api-requests.log  # API request logs
└── errors.log        # Error logs
```

## 🚀 Deployment Ready

The development setup is configured to be deployment-ready:

- **Environment Variables** properly configured
- **Build Scripts** optimized for production
- **Docker Support** with proper port mapping
- **CI/CD Ready** with all necessary scripts

## 💡 Tips for Development

1. **Use PNPM** for faster dependency management
2. **Enable Browser DevTools** for debugging
3. **Monitor Network Tab** for API calls
4. **Use React DevTools** for component debugging
5. **Check Console** for wallet connection issues

## 📞 Support

For development support:
- Check browser console for client errors
- Review terminal output for server errors
- Ensure all API keys are valid
- Verify wallet extensions are installed
- Test network connectivity to external APIs

---

**Ready to start developing?** Run `npm run dev` and visit http://localhost:8080! 🎉
