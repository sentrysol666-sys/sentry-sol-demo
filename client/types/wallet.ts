// Extend the Window interface to include ethereum (MetaMask)
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: Function) => void;
      removeListener: (event: string, handler: Function) => void;
      selectedAddress: string | null;
      chainId: string;
    };
  }
}

export interface WalletConnection {
  address: string;
  publicKey?: string;
  chainId?: number | string;
  balance?: string;
  isConnected: boolean;
}

export interface SolanaWalletInfo extends WalletConnection {
  publicKey: string;
  lamports?: number;
}

export interface EthereumWalletInfo extends WalletConnection {
  chainId: number;
  balance: string;
  ensName?: string;
}

export type SupportedChain = 'solana' | 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';

export interface ChainConfig {
  chainId: number | string;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface WalletAnalysis {
  address: string;
  chain: SupportedChain;
  riskScore: number;
  flags: string[];
  transactions: {
    total: number;
    suspicious: number;
    volume: string;
  };
  sanctions: {
    isListed: boolean;
    source?: string;
    details?: string;
  };
  adverseMedia: {
    mentions: number;
    risk: 'low' | 'medium' | 'high';
    sources: string[];
  };
}

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  bsc: {
    chainId: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  solana: {
    chainId: 'mainnet-beta',
    name: 'Solana Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    blockExplorer: 'https://explorer.solana.com',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
    },
  },
};

export {};
