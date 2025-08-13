#!/bin/bash

# Sentrysol AML Platform - Development Server Deployment Script
# Port 8080 Setup

echo "🚀 Sentrysol AML Platform - Development Deployment"
echo "================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

print_status "Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "NPM is not installed. Please install NPM first."
    exit 1
fi

print_status "NPM found: $(npm --version)"

# Run the setup script
print_info "Running development setup..."
npm run setup

if [ $? -eq 0 ]; then
    print_status "Setup completed successfully"
else
    print_error "Setup failed"
    exit 1
fi

# Check if port 8080 is available
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port 8080 is already in use"
    print_info "Attempting to free port 8080..."
    
    # Try to kill process on port 8080
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    sleep 2
    
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
        print_error "Cannot free port 8080. Please manually stop the process or use a different port."
        print_info "To use a different port, run: npm run dev -- --port 8081"
        exit 1
    else
        print_status "Port 8080 freed successfully"
    fi
else
    print_status "Port 8080 is available"
fi

# Create logs directory
mkdir -p logs

print_info "Starting development server on port 8080..."
print_info "Server will be available at:"
echo "  Local:    http://localhost:8080"
echo "  Network:  http://$(hostname -I | awk '{print $1}'):8080"
echo ""
print_info "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev 2>&1 | tee logs/dev-server.log

print_info "Development server stopped"
