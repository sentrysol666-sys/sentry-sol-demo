import {
  blockchainTracerAgent,
  TracingResult,
} from "../agents/blockchain-tracer.ts";
import { supervisorAgent } from "../agents/supervisor-agent.ts";

export interface WalletAnalysisResult {
  address: string;
  chain: "solana" | "ethereum";
  isConnectedWallet: boolean;
  walletMetadata: WalletMetadata;
  riskAssessment: RiskAssessment;
  tracingResults: TracingResult;
  realTimeData: RealTimeData;
  recommendations: Recommendation[];
  complianceStatus: ComplianceStatus;
}

export interface WalletMetadata {
  walletType: string; // 'phantom', 'metamask', 'solflare', etc.
  connectionTime: Date;
  balance: string;
  tokenBalances: TokenBalance[];
  nftHoldings: NFTHolding[];
}

export interface TokenBalance {
  symbol: string;
  amount: string;
  value: string;
  contract?: string;
}

export interface NFTHolding {
  collection: string;
  tokenId: string;
  name: string;
  description?: string;
  image?: string;
}

export interface RiskAssessment {
  overallScore: number;
  factors: RiskFactor[];
  confidenceLevel: number;
  lastUpdated: Date;
}

export interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  description: string;
  evidence: any[];
}

export interface RealTimeData {
  currentBalance: string;
  lastTransaction: any;
  activeConnections: number;
  networkActivity: NetworkActivity;
}

export interface NetworkActivity {
  last24h: {
    transactions: number;
    volume: string;
    uniqueCounterparties: number;
  };
  last7d: {
    transactions: number;
    volume: string;
    uniqueCounterparties: number;
  };
}

export interface Recommendation {
  type: "action" | "monitoring" | "investigation";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  suggestedAction: string;
}

export interface ComplianceStatus {
  sanctionsCheck: {
    status: "clear" | "flagged" | "unknown";
    confidence: number;
    lastChecked: Date;
  };
  pepCheck: {
    status: "clear" | "flagged" | "unknown";
    confidence: number;
    lastChecked: Date;
  };
  amlRating: "low" | "medium" | "high" | "critical";
  jurisdictionRisk: string;
}

export class WalletAnalysisService {
  private connectedWallets: Map<string, WalletMetadata> = new Map();

  async analyzeConnectedWallet(
    address: string,
    chain: "solana" | "ethereum",
    walletType: string,
    connectionData: any,
  ): Promise<WalletAnalysisResult> {
    console.log(
      `🔍 Wallet Analysis: Analyzing connected ${chain} wallet ${address}`,
    );

    try {
      // 1. Store wallet metadata
      const walletMetadata = await this.buildWalletMetadata(
        address,
        chain,
        walletType,
        connectionData,
      );
      this.connectedWallets.set(address, walletMetadata);

      // 2. Run blockchain tracing
      const tracingResults = await blockchainTracerAgent.traceAddress(address);

      // 3. Get real-time data
      const realTimeData = await this.getRealTimeData(address, chain);

      // 4. Perform risk assessment with wallet context
      const riskAssessment = await this.performWalletRiskAssessment(
        address,
        tracingResults,
        walletMetadata,
        realTimeData,
      );

      // 5. Run full compliance investigation using supervisor
      const investigationResult = await supervisorAgent.investigate(
        address,
        "full",
      );

      // 6. Generate compliance status
      const complianceStatus = this.buildComplianceStatus(investigationResult);

      // 7. Generate recommendations
      const recommendations = this.generateRecommendations(
        riskAssessment,
        tracingResults,
        complianceStatus,
      );

      return {
        address,
        chain,
        isConnectedWallet: true,
        walletMetadata,
        riskAssessment,
        tracingResults,
        realTimeData,
        recommendations,
        complianceStatus,
      };
    } catch (error) {
      console.error("Wallet analysis failed:", error);
      throw error;
    }
  }

  async analyzeDisconnectedWallet(
    address: string,
  ): Promise<WalletAnalysisResult> {
    console.log(`🔍 Wallet Analysis: Analyzing disconnected wallet ${address}`);

    const chain = this.detectChain(address);
    const tracingResults = await blockchainTracerAgent.traceAddress(address);
    const investigationResult = await supervisorAgent.investigate(
      address,
      "full",
    );

    return {
      address,
      chain,
      isConnectedWallet: false,
      walletMetadata: {
        walletType: "unknown",
        connectionTime: new Date(),
        balance: "0",
        tokenBalances: [],
        nftHoldings: [],
      },
      riskAssessment: {
        overallScore: investigationResult.riskScore,
        factors: [],
        confidenceLevel: 0.7,
        lastUpdated: new Date(),
      },
      tracingResults,
      realTimeData: {
        currentBalance: "0",
        lastTransaction: null,
        activeConnections: 0,
        networkActivity: {
          last24h: { transactions: 0, volume: "0", uniqueCounterparties: 0 },
          last7d: { transactions: 0, volume: "0", uniqueCounterparties: 0 },
        },
      },
      recommendations: [],
      complianceStatus: this.buildComplianceStatus(investigationResult),
    };
  }

  private async buildWalletMetadata(
    address: string,
    chain: "solana" | "ethereum",
    walletType: string,
    connectionData: any,
  ): Promise<WalletMetadata> {
    return {
      walletType,
      connectionTime: new Date(),
      balance: connectionData.balance || "0",
      tokenBalances: await this.getTokenBalances(address, chain),
      nftHoldings: await this.getNFTHoldings(address, chain),
    };
  }

  private async getTokenBalances(
    address: string,
    chain: "solana" | "ethereum",
  ): Promise<TokenBalance[]> {
    // In production, this would fetch real token balances
    // For now, return mock data
    return [
      {
        symbol: chain === "solana" ? "SOL" : "ETH",
        amount: "10.5",
        value: "$2,100",
        contract: chain === "solana" ? undefined : "0x...",
      },
    ];
  }

  private async getNFTHoldings(
    address: string,
    chain: "solana" | "ethereum",
  ): Promise<NFTHolding[]> {
    // In production, this would fetch real NFT holdings
    return [];
  }

  private async getRealTimeData(
    address: string,
    chain: "solana" | "ethereum",
  ): Promise<RealTimeData> {
    // In production, this would fetch real-time data from blockchain APIs
    return {
      currentBalance: "10.5",
      lastTransaction: null,
      activeConnections: 1,
      networkActivity: {
        last24h: { transactions: 2, volume: "$500", uniqueCounterparties: 2 },
        last7d: { transactions: 15, volume: "$3,200", uniqueCounterparties: 8 },
      },
    };
  }

  private async performWalletRiskAssessment(
    address: string,
    tracingResults: TracingResult,
    walletMetadata: WalletMetadata,
    realTimeData: RealTimeData,
  ): Promise<RiskAssessment> {
    const factors: RiskFactor[] = [];
    let totalScore = 0;

    // Factor 1: Transaction patterns
    const patternScore = Math.min(tracingResults.flowPatterns.length * 20, 80);
    factors.push({
      category: "transaction_patterns",
      score: patternScore,
      weight: 0.3,
      description: `${tracingResults.flowPatterns.length} suspicious patterns detected`,
      evidence: tracingResults.flowPatterns,
    });
    totalScore += patternScore * 0.3;

    // Factor 2: Risk indicators
    const riskScore = Math.min(tracingResults.riskIndicators.length * 15, 70);
    factors.push({
      category: "risk_indicators",
      score: riskScore,
      weight: 0.25,
      description: `${tracingResults.riskIndicators.length} risk indicators found`,
      evidence: tracingResults.riskIndicators,
    });
    totalScore += riskScore * 0.25;

    // Factor 3: Connected entities risk
    const entityScore = Math.min(
      tracingResults.connectedEntities.reduce(
        (sum, e) => sum + e.riskScore,
        0,
      ) / tracingResults.connectedEntities.length || 0,
      80,
    );
    factors.push({
      category: "connected_entities",
      score: entityScore,
      weight: 0.2,
      description: `Average risk score of connected entities: ${entityScore.toFixed(1)}`,
      evidence: tracingResults.connectedEntities.slice(0, 5),
    });
    totalScore += entityScore * 0.2;

    // Factor 4: Velocity metrics
    const velocityScore = Math.min(
      tracingResults.temporalAnalysis.velocityMetrics.velocityScore,
      60,
    );
    factors.push({
      category: "transaction_velocity",
      score: velocityScore,
      weight: 0.15,
      description: `Transaction velocity score: ${velocityScore}`,
      evidence: tracingResults.temporalAnalysis.velocityMetrics,
    });
    totalScore += velocityScore * 0.15;

    // Factor 5: Wallet connection risk (lower risk for connected wallets)
    const connectionScore = walletMetadata.walletType === "unknown" ? 30 : 10;
    factors.push({
      category: "wallet_connection",
      score: connectionScore,
      weight: 0.1,
      description: `Wallet type: ${walletMetadata.walletType}`,
      evidence: { walletType: walletMetadata.walletType },
    });
    totalScore += connectionScore * 0.1;

    return {
      overallScore: Math.round(totalScore),
      factors,
      confidenceLevel: tracingResults.confidence,
      lastUpdated: new Date(),
    };
  }

  private buildComplianceStatus(investigationResult: any): ComplianceStatus {
    return {
      sanctionsCheck: {
        status: investigationResult.compliance?.sanctionsStatus?.isMatch
          ? "flagged"
          : "clear",
        confidence:
          investigationResult.compliance?.sanctionsStatus?.confidence || 0,
        lastChecked: new Date(),
      },
      pepCheck: {
        status: investigationResult.compliance?.pepStatus?.isMatch
          ? "flagged"
          : "clear",
        confidence: investigationResult.compliance?.pepStatus?.confidence || 0,
        lastChecked: new Date(),
      },
      amlRating:
        investigationResult.riskScore >= 70
          ? "critical"
          : investigationResult.riskScore >= 50
            ? "high"
            : investigationResult.riskScore >= 30
              ? "medium"
              : "low",
      jurisdictionRisk: "unknown",
    };
  }

  private generateRecommendations(
    riskAssessment: RiskAssessment,
    tracingResults: TracingResult,
    complianceStatus: ComplianceStatus,
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // High risk score recommendations
    if (riskAssessment.overallScore >= 70) {
      recommendations.push({
        type: "investigation",
        priority: "critical",
        title: "Enhanced Due Diligence Required",
        description: "High risk score detected requiring immediate attention",
        suggestedAction:
          "Conduct manual investigation and consider transaction monitoring",
      });
    }

    // Sanctions check recommendations
    if (complianceStatus.sanctionsCheck.status === "flagged") {
      recommendations.push({
        type: "action",
        priority: "critical",
        title: "Sanctions Match Detected",
        description: "Address matches sanctions list",
        suggestedAction:
          "Immediately freeze any transactions and report to compliance team",
      });
    }

    // Pattern-based recommendations
    if (
      tracingResults.flowPatterns.some(
        (p) => p.type === "mixing" || p.type === "layering",
      )
    ) {
      recommendations.push({
        type: "monitoring",
        priority: "high",
        title: "Money Laundering Patterns Detected",
        description: "Suspicious transaction patterns identified",
        suggestedAction:
          "Enable continuous monitoring and flag future transactions",
      });
    }

    return recommendations;
  }

  private detectChain(address: string): "solana" | "ethereum" {
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return "solana";
    }
    return "ethereum";
  }

  getConnectedWallet(address: string): WalletMetadata | null {
    return this.connectedWallets.get(address) || null;
  }

  isWalletConnected(address: string): boolean {
    return this.connectedWallets.has(address);
  }
}

export const walletAnalysisService = new WalletAnalysisService();
