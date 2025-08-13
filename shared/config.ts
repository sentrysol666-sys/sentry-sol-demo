export const API_ENDPOINTS = {
  // Helius Enhanced Solana APIs
  PARSE_TRANSACTIONS: 'https://api.helius.xyz/v0/transactions/',
  PARSE_TRANSACTION_HISTORY: (address: string) => 
    `https://api.helius.xyz/v0/addresses/${address}/transactions/`,
  
  // Metasleuth APIs
  METASLEUTH_WALLET_SCREENING: 'https://api.metasleuth.io/v1/wallet-screening',
  METASLEUTH_ADDRESS_LABEL: 'https://api.metasleuth.io/v1/address-label',
  
  // Chainabuse APIs
  CHAINABUSE_SANCTIONS: 'https://api.chainabuse.com/v1/check-sanctioned-address',
  CHAINABUSE_REPORTS: 'https://api.chainabuse.com/v1/reports',
  
  // CoinStats APIs
  COINSTATS_WALLET: 'https://api.coinstats.app/public/v1/wallet',
  COINSTATS_PORTFOLIO: 'https://api.coinstats.app/public/v1/portfolio',
  
  // PEP Checker
  PEP_CHECKER: 'https://api.pepchecker.com/v1/check',
} as const;

export const MCP_SERVERS = {
  GITHUB: 'https://server.smithery.ai/@smithery-ai/github',
  HELIUS: 'https://server.smithery.ai/@dcSpark/mcp-server-helius',
  SHERLOCK: 'https://server.smithery.ai/@qKitNp/sherlock_mcp',
  ETHERSCAN: 'https://server.smithery.ai/@xiaok/etherscan-mcp-server',
} as const;

export interface AMLAlert {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'sanctions' | 'aml' | 'suspicious_activity' | 'compliance';
  address: string;
  description: string;
  agent: string;
  confidence: number;
}

export interface WalletScreeningResult {
  address: string;
  riskScore: number;
  sanctionsMatch: boolean;
  pepMatch: boolean;
  adverseMediaCount: number;
  transactionPatterns: string[];
  lastActivity: Date;
}

export interface ComplianceReport {
  id: string;
  createdAt: Date;
  investigator: string;
  walletAddress: string;
  riskAssessment: 'low' | 'medium' | 'high';
  findings: string[];
  recommendations: string[];
  status: 'draft' | 'review' | 'approved' | 'rejected';
}
