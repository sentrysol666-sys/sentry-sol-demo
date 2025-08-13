import { mcpManager } from './mcp-services';

export interface TransactionData {
  signature: string;
  slot: number;
  timestamp: number;
  fee: number;
  feePayer: string;
  instructions: any[];
  accounts: string[];
  logMessages: string[];
}

export interface EnhancedTransaction {
  signature: string;
  description: string;
  type: string;
  source: string;
  timestamp: number;
  slot: number;
  fee: number;
  nativeTransfers: any[];
  tokenTransfers: any[];
  accountData: any[];
  transactionError: any;
  instructions: any[];
  events: any[];
}

export interface AddressTransactionHistory {
  address: string;
  transactions: EnhancedTransaction[];
  hasMore: boolean;
  before?: string;
  after?: string;
}

export class HeliusService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_HELIUS_API_KEY || "49107f03-be28-4419-b417-8341142ba90a";
    this.baseUrl = `https://api.helius.xyz/v0`;
  }

  // Enhanced Transaction Parsing
  async parseTransactions(signatures: string[]): Promise<EnhancedTransaction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/?api-key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: signatures
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error parsing transactions:', error);
      throw error;
    }
  }

  // Transaction History for Address
  async getAddressTransactionHistory(
    address: string, 
    options: {
      limit?: number;
      before?: string;
      after?: string;
      type?: string;
      source?: string;
    } = {}
  ): Promise<AddressTransactionHistory> {
    try {
      const params = new URLSearchParams({
        'api-key': this.apiKey,
        ...options,
        limit: (options.limit || 100).toString()
      });

      const response = await fetch(
        `${this.baseUrl}/addresses/${address}/transactions/?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        address,
        transactions: data,
        hasMore: data.length === (options.limit || 100),
        before: options.before,
        after: options.after
      };
    } catch (error) {
      console.error('Error fetching address transaction history:', error);
      throw error;
    }
  }

  // Use MCP client for advanced Helius operations
  async useMCPHeliusTools(toolName: string, parameters: any = {}): Promise<any> {
    const client = mcpManager.getClient('helius');
    if (!client) {
      throw new Error('Helius MCP client not initialized');
    }

    try {
      const result = await client.callTool(toolName, parameters);
      return result;
    } catch (error) {
      console.error(`Error calling Helius MCP tool ${toolName}:`, error);
      throw error;
    }
  }

  // Get account information
  async getAccountInfo(address: string): Promise<any> {
    try {
      return await this.useMCPHeliusTools('get_account_info', { address });
    } catch (error) {
      // Fallback to direct API call
      const response = await fetch(`${this.baseUrl}/addresses/${address}?api-key=${this.apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
  }

  // Get token metadata
  async getTokenMetadata(mintAddress: string): Promise<any> {
    try {
      return await this.useMCPHeliusTools('get_token_metadata', { mint: mintAddress });
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }

  // Get NFT data
  async getNFTData(mintAddress: string): Promise<any> {
    try {
      return await this.useMCPHeliusTools('get_nft_data', { mint: mintAddress });
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      throw error;
    }
  }

  // Advanced transaction analysis for AML
  async analyzeTransactionForAML(signature: string): Promise<{
    riskScore: number;
    flags: string[];
    analysis: any;
    transactions: EnhancedTransaction[];
  }> {
    try {
      const transactions = await this.parseTransactions([signature]);
      if (transactions.length === 0) {
        throw new Error('Transaction not found');
      }

      const transaction = transactions[0];
      const flags: string[] = [];
      let riskScore = 0;

      // Basic AML analysis
      if (transaction.fee > 1000000) { // High fee
        flags.push('HIGH_FEE');
        riskScore += 10;
      }

      if (transaction.tokenTransfers && transaction.tokenTransfers.length > 10) {
        flags.push('MULTIPLE_TOKEN_TRANSFERS');
        riskScore += 15;
      }

      if (transaction.transactionError) {
        flags.push('FAILED_TRANSACTION');
        riskScore += 5;
      }

      // Check for known risky patterns
      if (transaction.instructions.some((inst: any) => 
        inst.programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' && 
        inst.data && inst.data.includes('burn')
      )) {
        flags.push('TOKEN_BURN');
        riskScore += 20;
      }

      return {
        riskScore: Math.min(riskScore, 100),
        flags,
        analysis: {
          timestamp: transaction.timestamp,
          type: transaction.type,
          source: transaction.source,
          instructionCount: transaction.instructions.length,
          accountCount: transaction.accountData.length
        },
        transactions
      };
    } catch (error) {
      console.error('Error analyzing transaction for AML:', error);
      throw error;
    }
  }

  // Batch analyze multiple addresses for compliance
  async batchAnalyzeAddresses(addresses: string[]): Promise<{
    address: string;
    riskScore: number;
    transactionCount: number;
    flags: string[];
    lastActivity: number;
  }[]> {
    const results = await Promise.allSettled(
      addresses.map(async (address) => {
        try {
          const history = await this.getAddressTransactionHistory(address, { limit: 50 });
          const flags: string[] = [];
          let riskScore = 0;

          // Analyze transaction patterns
          if (history.transactions.length > 100) {
            flags.push('HIGH_ACTIVITY');
            riskScore += 15;
          }

          // Check for recent activity (last 24 hours)
          const dayAgo = Date.now() / 1000 - 86400;
          const recentTxs = history.transactions.filter(tx => tx.timestamp > dayAgo);
          if (recentTxs.length > 20) {
            flags.push('HIGH_RECENT_ACTIVITY');
            riskScore += 20;
          }

          // Check for failed transactions
          const failedTxs = history.transactions.filter(tx => tx.transactionError);
          if (failedTxs.length > 5) {
            flags.push('MULTIPLE_FAILED_TXS');
            riskScore += 10;
          }

          return {
            address,
            riskScore: Math.min(riskScore, 100),
            transactionCount: history.transactions.length,
            flags,
            lastActivity: history.transactions[0]?.timestamp || 0
          };
        } catch (error) {
          console.error(`Error analyzing address ${address}:`, error);
          return {
            address,
            riskScore: 0,
            transactionCount: 0,
            flags: ['ANALYSIS_ERROR'],
            lastActivity: 0
          };
        }
      })
    );

    return results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);
  }
}

export const heliusService = new HeliusService();
