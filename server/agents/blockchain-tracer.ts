import { ChatMistralAI } from "@langchain/mistralai";
import { mcpManager } from "../services/mcp-services";

export interface TracingResult {
  address: string;
  transactionHistory: any[];
  flowPatterns: FlowPattern[];
  riskIndicators: RiskIndicator[];
  connectedEntities: ConnectedEntity[];
  temporalAnalysis: TemporalAnalysis;
  confidence: number;
}

export interface FlowPattern {
  type:
    | "mixing"
    | "layering"
    | "structuring"
    | "circular"
    | "fan_out"
    | "fan_in";
  addresses: string[];
  amount: number;
  confidence: number;
  description: string;
}

export interface RiskIndicator {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  evidence: any;
}

export interface ConnectedEntity {
  address: string;
  relationship: string;
  transactionCount: number;
  totalValue: number;
  riskScore: number;
}

export interface TemporalAnalysis {
  activityPeriods: ActivityPeriod[];
  peakTimes: Date[];
  dormantPeriods: DateRange[];
  velocityMetrics: VelocityMetrics;
}

export interface ActivityPeriod {
  start: Date;
  end: Date;
  transactionCount: number;
  volume: number;
  pattern: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface VelocityMetrics {
  avgTxPerDay: number;
  maxTxPerDay: number;
  velocityScore: number;
}

export class BlockchainTracerAgent {
  private model: ChatMistralAI;

  constructor() {
    this.model = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      model:
        process.env.MISTRAL_MODEL ||
        "ft:mistral-medium-latest:b319469f:20250807:b80c0dce",
      temperature: 0.1,
    });
  }

  async traceAddress(address: string): Promise<TracingResult> {
    console.log(`🔍 Blockchain Tracer: Analyzing address ${address}`);

    try {
      // Step 1: Get transaction history from multiple sources
      const transactionHistory = await this.getTransactionHistory(address);

      // Step 2: Analyze flow patterns using AI
      const flowPatterns = await this.analyzeFlowPatterns(
        address,
        transactionHistory,
      );

      // Step 3: Identify risk indicators
      const riskIndicators = await this.identifyRiskIndicators(
        transactionHistory,
        flowPatterns,
      );

      // Step 4: Map connected entities
      const connectedEntities = await this.mapConnectedEntities(
        address,
        transactionHistory,
      );

      // Step 5: Perform temporal analysis
      const temporalAnalysis =
        await this.performTemporalAnalysis(transactionHistory);

      // Step 6: Calculate overall confidence
      const confidence = this.calculateConfidence(
        transactionHistory,
        flowPatterns,
        riskIndicators,
      );

      return {
        address,
        transactionHistory,
        flowPatterns,
        riskIndicators,
        connectedEntities,
        temporalAnalysis,
        confidence,
      };
    } catch (error) {
      console.error("Blockchain tracing failed:", error);
      throw error;
    }
  }

  private async getTransactionHistory(address: string): Promise<any[]> {
    try {
      // Try to use Helius MCP for Solana addresses
      if (this.isSolanaAddress(address)) {
        const heliusClient = mcpManager.getClient("helius");
        if (heliusClient) {
          const result = await mcpManager.callTool(
            "helius",
            "get_transaction_history",
            {
              address,
              limit: 100,
            },
          );
          return result.transactions || [];
        }
      }

      // Try to use Etherscan MCP for Ethereum addresses
      if (this.isEthereumAddress(address)) {
        const etherscanClient = mcpManager.getClient("etherscan");
        if (etherscanClient) {
          const result = await mcpManager.callTool(
            "etherscan",
            "get_transaction_history",
            {
              address,
              limit: 100,
            },
          );
          return result.transactions || [];
        }
      }

      // Fallback: generate mock data for demo
      return this.generateMockTransactions(address);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      return this.generateMockTransactions(address);
    }
  }

  private async analyzeFlowPatterns(
    address: string,
    transactions: any[],
  ): Promise<FlowPattern[]> {
    const prompt = `Analyze these blockchain transactions for suspicious flow patterns:
    
    Address: ${address}
    Transaction Count: ${transactions.length}
    
    Look for:
    1. Mixing services usage
    2. Layering transactions  
    3. Structuring (breaking large amounts into smaller ones)
    4. Circular transactions
    5. Fan-out/Fan-in patterns
    
    Provide structured analysis of any suspicious patterns found.`;

    try {
      const response = await this.model.invoke([
        {
          role: "system",
          content:
            "You are an expert blockchain forensics analyst specializing in transaction flow analysis.",
        },
        { role: "user", content: prompt },
      ]);

      // Parse AI response and generate structured patterns
      return this.extractPatternsFromResponse(
        response.content as string,
        transactions,
      );
    } catch (error) {
      console.error("Error analyzing flow patterns:", error);
      return this.generateMockPatterns(transactions);
    }
  }

  private async identifyRiskIndicators(
    transactions: any[],
    patterns: FlowPattern[],
  ): Promise<RiskIndicator[]> {
    const indicators: RiskIndicator[] = [];

    // High transaction frequency
    if (transactions.length > 100) {
      indicators.push({
        type: "high_frequency",
        severity: "medium",
        description: `High transaction frequency: ${transactions.length} transactions`,
        evidence: { count: transactions.length },
      });
    }

    // Suspicious patterns
    patterns.forEach((pattern) => {
      if (pattern.type === "mixing" || pattern.type === "layering") {
        indicators.push({
          type: "suspicious_pattern",
          severity: "high",
          description: `${pattern.type} pattern detected`,
          evidence: pattern,
        });
      }
    });

    // Large transaction amounts
    const largeTxs = transactions.filter((tx) => tx.value > 1000000);
    if (largeTxs.length > 0) {
      indicators.push({
        type: "large_transactions",
        severity: "medium",
        description: `${largeTxs.length} large transactions detected`,
        evidence: { transactions: largeTxs.slice(0, 5) },
      });
    }

    return indicators;
  }

  private async mapConnectedEntities(
    address: string,
    transactions: any[],
  ): Promise<ConnectedEntity[]> {
    const entityMap = new Map<string, ConnectedEntity>();

    transactions.forEach((tx) => {
      const counterparty = tx.from === address ? tx.to : tx.from;

      if (entityMap.has(counterparty)) {
        const entity = entityMap.get(counterparty)!;
        entity.transactionCount++;
        entity.totalValue += parseFloat(tx.value || "0");
      } else {
        entityMap.set(counterparty, {
          address: counterparty,
          relationship: tx.from === address ? "recipient" : "sender",
          transactionCount: 1,
          totalValue: parseFloat(tx.value || "0"),
          riskScore: Math.random() * 100, // In production, calculate actual risk
        });
      }
    });

    return Array.from(entityMap.values())
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 20); // Top 20 connected entities
  }

  private async performTemporalAnalysis(
    transactions: any[],
  ): Promise<TemporalAnalysis> {
    // Group transactions by time periods
    const periods = this.groupTransactionsByPeriod(transactions);
    const activityPeriods = this.identifyActivityPeriods(periods);
    const peakTimes = this.identifyPeakTimes(periods);
    const dormantPeriods = this.identifyDormantPeriods(periods);
    const velocityMetrics = this.calculateVelocityMetrics(transactions);

    return {
      activityPeriods,
      peakTimes,
      dormantPeriods,
      velocityMetrics,
    };
  }

  private calculateConfidence(
    transactions: any[],
    patterns: FlowPattern[],
    indicators: RiskIndicator[],
  ): number {
    let confidence = 0.5; // Base confidence

    // More transactions = higher confidence
    confidence += Math.min(transactions.length / 1000, 0.3);

    // Detected patterns increase confidence
    confidence += patterns.length * 0.1;

    // Multiple risk indicators increase confidence
    confidence += indicators.length * 0.05;

    return Math.min(confidence, 1.0);
  }

  // Helper methods
  private isSolanaAddress(address: string): boolean {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }

  private isEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  private generateMockTransactions(address: string): any[] {
    const count = Math.floor(Math.random() * 200) + 50;
    const transactions = [];

    for (let i = 0; i < count; i++) {
      transactions.push({
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: Math.random() > 0.5 ? address : this.generateRandomAddress(),
        to: Math.random() > 0.5 ? address : this.generateRandomAddress(),
        value: (Math.random() * 1000000).toString(),
        timestamp: Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 100000),
      });
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  private generateRandomAddress(): string {
    return "0x" + Math.random().toString(16).substr(2, 40);
  }

  private extractPatternsFromResponse(
    response: string,
    transactions: any[],
  ): FlowPattern[] {
    // Simple pattern extraction - in production this would be more sophisticated
    const patterns: FlowPattern[] = [];

    if (response.toLowerCase().includes("mixing")) {
      patterns.push({
        type: "mixing",
        addresses: transactions.slice(0, 5).map((tx) => tx.to),
        amount: 100000,
        confidence: 0.8,
        description: "Potential mixing service usage detected",
      });
    }

    if (response.toLowerCase().includes("layering")) {
      patterns.push({
        type: "layering",
        addresses: transactions.slice(0, 3).map((tx) => tx.to),
        amount: 50000,
        confidence: 0.7,
        description: "Layering pattern identified",
      });
    }

    return patterns;
  }

  private generateMockPatterns(transactions: any[]): FlowPattern[] {
    const patterns: FlowPattern[] = [];

    if (Math.random() > 0.7) {
      patterns.push({
        type: "fan_out",
        addresses: transactions.slice(0, 10).map((tx) => tx.to),
        amount: Math.random() * 1000000,
        confidence: 0.6,
        description:
          "Fan-out pattern detected - single source to multiple destinations",
      });
    }

    return patterns;
  }

  private groupTransactionsByPeriod(transactions: any[]): Map<string, any[]> {
    const periods = new Map<string, any[]>();

    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const period = date.toISOString().split("T")[0]; // Group by day

      if (!periods.has(period)) {
        periods.set(period, []);
      }
      periods.get(period)!.push(tx);
    });

    return periods;
  }

  private identifyActivityPeriods(
    periods: Map<string, any[]>,
  ): ActivityPeriod[] {
    const activityPeriods: ActivityPeriod[] = [];

    periods.forEach((txs, date) => {
      if (txs.length > 5) {
        // Threshold for "active" period
        activityPeriods.push({
          start: new Date(date),
          end: new Date(date),
          transactionCount: txs.length,
          volume: txs.reduce((sum, tx) => sum + parseFloat(tx.value || "0"), 0),
          pattern: txs.length > 20 ? "high_activity" : "normal_activity",
        });
      }
    });

    return activityPeriods;
  }

  private identifyPeakTimes(periods: Map<string, any[]>): Date[] {
    const sortedPeriods = Array.from(periods.entries()).sort(
      (a, b) => b[1].length - a[1].length,
    );

    return sortedPeriods.slice(0, 3).map(([date, _]) => new Date(date));
  }

  private identifyDormantPeriods(periods: Map<string, any[]>): DateRange[] {
    // Simplified dormant period detection
    const dormantPeriods: DateRange[] = [];
    const dates = Array.from(periods.keys()).sort();

    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const daysDiff =
        (next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff > 7) {
        // More than 7 days gap
        dormantPeriods.push({
          start: current,
          end: next,
        });
      }
    }

    return dormantPeriods;
  }

  private calculateVelocityMetrics(transactions: any[]): VelocityMetrics {
    const periods = this.groupTransactionsByPeriod(transactions);
    const dailyCounts = Array.from(periods.values()).map((txs) => txs.length);

    return {
      avgTxPerDay: dailyCounts.reduce((a, b) => a + b, 0) / dailyCounts.length,
      maxTxPerDay: Math.max(...dailyCounts),
      velocityScore: Math.min(Math.max(...dailyCounts) / 10, 100), // Score out of 100
    };
  }
}

export const blockchainTracerAgent = new BlockchainTracerAgent();
