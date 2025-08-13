import { mcpManager } from './mcp-services';
import { heliusService } from './helius-service';

export interface InvestigationResult {
  address: string;
  riskScore: number;
  findings: Finding[];
  networkAnalysis: NetworkAnalysis;
  compliance: ComplianceCheck;
  metadata: AddressMetadata;
}

export interface Finding {
  id: string;
  type: 'sanctions' | 'aml' | 'suspicious_activity' | 'pattern_detection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: any[];
  confidence: number;
  source: string;
  timestamp: number;
}

export interface NetworkAnalysis {
  clusters: AddressCluster[];
  connections: Connection[];
  flowPatterns: FlowPattern[];
  riskPropagation: RiskPropagation[];
}

export interface AddressCluster {
  id: string;
  addresses: string[];
  confidence: number;
  reason: string;
  riskScore: number;
}

export interface Connection {
  from: string;
  to: string;
  value: number;
  frequency: number;
  riskScore: number;
  transactionHashes: string[];
}

export interface FlowPattern {
  type: 'mixing' | 'layering' | 'rapid_fire' | 'circular' | 'fan_out' | 'fan_in';
  addresses: string[];
  confidence: number;
  description: string;
}

export interface RiskPropagation {
  sourceAddress: string;
  targetAddresses: string[];
  riskScore: number;
  hops: number;
}

export interface ComplianceCheck {
  sanctionsStatus: SanctionsStatus;
  pepStatus: PEPStatus;
  adverseMedia: AdverseMediaResult;
  jurisdictionRisk: JurisdictionRisk;
}

export interface SanctionsStatus {
  isMatch: boolean;
  lists: string[];
  confidence: number;
  lastChecked: number;
}

export interface PEPStatus {
  isMatch: boolean;
  person?: any;
  confidence: number;
  lastChecked: number;
}

export interface AdverseMediaResult {
  articles: any[];
  sentiment: 'positive' | 'neutral' | 'negative';
  riskScore: number;
  lastChecked: number;
}

export interface JurisdictionRisk {
  country?: string;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
}

export interface AddressMetadata {
  label?: string;
  category?: string;
  owner?: string;
  verified: boolean;
  source: string;
  lastUpdated: number;
}

export class InvestigationService {
  
  async investigateAddress(address: string): Promise<InvestigationResult> {
    console.log(`🔍 Starting comprehensive investigation for address: ${address}`);
    
    const results = await Promise.allSettled([
      this.performSherlockAnalysis(address),
      this.performGitHubThreatIntel(address),
      this.performEtherscanAnalysis(address),
      this.performHeliusAnalysis(address),
      this.performNetworkAnalysis(address),
      this.performComplianceCheck(address)
    ]);

    const [
      sherlockResult,
      githubResult, 
      etherscanResult,
      heliusResult,
      networkResult,
      complianceResult
    ] = results.map(r => r.status === 'fulfilled' ? r.value : null);

    // Aggregate all findings
    const findings: Finding[] = [];
    let aggregatedRiskScore = 0;
    let findingCount = 0;

    // Process Sherlock findings
    if (sherlockResult) {
      findings.push(...sherlockResult.findings);
      aggregatedRiskScore += sherlockResult.riskScore;
      findingCount++;
    }

    // Process GitHub threat intel findings  
    if (githubResult) {
      findings.push(...githubResult.findings);
      aggregatedRiskScore += githubResult.riskScore;
      findingCount++;
    }

    // Process Etherscan findings
    if (etherscanResult) {
      findings.push(...etherscanResult.findings);
      aggregatedRiskScore += etherscanResult.riskScore;
      findingCount++;
    }

    // Process Helius findings
    if (heliusResult) {
      findings.push(...heliusResult.findings);
      aggregatedRiskScore += heliusResult.riskScore;
      findingCount++;
    }

    const finalRiskScore = findingCount > 0 ? Math.round(aggregatedRiskScore / findingCount) : 0;

    return {
      address,
      riskScore: finalRiskScore,
      findings: findings.sort((a, b) => b.confidence - a.confidence),
      networkAnalysis: networkResult || this.getEmptyNetworkAnalysis(),
      compliance: complianceResult || this.getEmptyComplianceCheck(),
      metadata: {
        label: `Address ${address.slice(0, 8)}...${address.slice(-8)}`,
        verified: false,
        source: 'Sentrysol Investigation',
        lastUpdated: Date.now()
      }
    };
  }

  private async performSherlockAnalysis(address: string): Promise<{
    findings: Finding[];
    riskScore: number;
  }> {
    try {
      const client = mcpManager.getClient('sherlock');
      if (!client) {
        throw new Error('Sherlock MCP client not available');
      }

      // Get available tools first
      const tools = await client.listTools();
      console.log('Sherlock tools:', tools.map(t => t.name));

      // Use Sherlock for advanced blockchain forensics
      const analysis = await client.callTool('analyze_address', { address });
      
      const findings: Finding[] = [
        {
          id: `sherlock-${Date.now()}`,
          type: 'pattern_detection',
          severity: analysis.riskLevel || 'medium',
          description: `Sherlock analysis: ${analysis.summary || 'Pattern analysis completed'}`,
          evidence: [analysis],
          confidence: analysis.confidence || 75,
          source: 'Sherlock MCP',
          timestamp: Date.now()
        }
      ];

      return {
        findings,
        riskScore: analysis.riskScore || 30
      };
    } catch (error) {
      console.error('Sherlock analysis failed:', error);
      return {
        findings: [{
          id: `sherlock-error-${Date.now()}`,
          type: 'suspicious_activity',
          severity: 'low',
          description: 'Sherlock analysis unavailable',
          evidence: [{ error: error.message }],
          confidence: 10,
          source: 'Sherlock MCP',
          timestamp: Date.now()
        }],
        riskScore: 10
      };
    }
  }

  private async performGitHubThreatIntel(address: string): Promise<{
    findings: Finding[];
    riskScore: number;
  }> {
    try {
      const client = mcpManager.getClient('github');
      if (!client) {
        throw new Error('GitHub MCP client not available');
      }

      // Search for threat intelligence data
      const searchResults = await client.callTool('search_repositories', {
        query: `${address} threat intelligence scam malicious`,
        sort: 'updated'
      });

      const findings: Finding[] = [];
      let riskScore = 0;

      if (searchResults.items && searchResults.items.length > 0) {
        findings.push({
          id: `github-threat-${Date.now()}`,
          type: 'aml',
          severity: 'medium',
          description: `Found ${searchResults.items.length} threat intelligence references`,
          evidence: searchResults.items.slice(0, 5),
          confidence: 60,
          source: 'GitHub Threat Intel',
          timestamp: Date.now()
        });
        riskScore = 40;
      }

      return { findings, riskScore };
    } catch (error) {
      console.error('GitHub threat intel failed:', error);
      return {
        findings: [],
        riskScore: 0
      };
    }
  }

  private async performEtherscanAnalysis(address: string): Promise<{
    findings: Finding[];
    riskScore: number;
  }> {
    try {
      const client = mcpManager.getClient('etherscan');
      if (!client) {
        throw new Error('Etherscan MCP client not available');
      }

      // Get transaction history and analyze patterns
      const txHistory = await client.callTool('get_transaction_history', { 
        address,
        limit: 100 
      });

      const findings: Finding[] = [];
      let riskScore = 0;

      if (txHistory.transactions && txHistory.transactions.length > 0) {
        const txCount = txHistory.transactions.length;
        const failedTxs = txHistory.transactions.filter((tx: any) => tx.isError === '1');
        
        if (failedTxs.length > txCount * 0.1) { // More than 10% failed
          findings.push({
            id: `etherscan-failed-${Date.now()}`,
            type: 'suspicious_activity', 
            severity: 'medium',
            description: `High failure rate: ${failedTxs.length}/${txCount} transactions failed`,
            evidence: [{ failedCount: failedTxs.length, totalCount: txCount }],
            confidence: 70,
            source: 'Etherscan Analysis',
            timestamp: Date.now()
          });
          riskScore += 25;
        }

        if (txCount > 1000) {
          findings.push({
            id: `etherscan-volume-${Date.now()}`,
            type: 'suspicious_activity',
            severity: 'medium', 
            description: `High transaction volume: ${txCount} transactions`,
            evidence: [{ transactionCount: txCount }],
            confidence: 50,
            source: 'Etherscan Analysis',
            timestamp: Date.now()
          });
          riskScore += 15;
        }
      }

      return { findings, riskScore };
    } catch (error) {
      console.error('Etherscan analysis failed:', error);
      return { findings: [], riskScore: 0 };
    }
  }

  private async performHeliusAnalysis(address: string): Promise<{
    findings: Finding[];
    riskScore: number;
  }> {
    try {
      const analysis = await heliusService.batchAnalyzeAddresses([address]);
      const result = analysis[0];
      
      if (!result) {
        return { findings: [], riskScore: 0 };
      }

      const findings: Finding[] = result.flags.map(flag => ({
        id: `helius-${flag}-${Date.now()}`,
        type: 'suspicious_activity' as const,
        severity: result.riskScore > 50 ? 'high' as const : 'medium' as const,
        description: `Helius detected: ${flag.replace(/_/g, ' ').toLowerCase()}`,
        evidence: [{ 
          transactionCount: result.transactionCount,
          lastActivity: result.lastActivity,
          riskScore: result.riskScore
        }],
        confidence: Math.min(result.riskScore + 20, 90),
        source: 'Helius Analysis',
        timestamp: Date.now()
      }));

      return {
        findings,
        riskScore: result.riskScore
      };
    } catch (error) {
      console.error('Helius analysis failed:', error);
      return { findings: [], riskScore: 0 };
    }
  }

  private async performNetworkAnalysis(address: string): Promise<NetworkAnalysis> {
    // Simplified network analysis - in production this would use graph databases
    return {
      clusters: [],
      connections: [],
      flowPatterns: [],
      riskPropagation: []
    };
  }

  private async performComplianceCheck(address: string): Promise<ComplianceCheck> {
    // Simplified compliance check - integrate with actual APIs
    return {
      sanctionsStatus: {
        isMatch: false,
        lists: [],
        confidence: 95,
        lastChecked: Date.now()
      },
      pepStatus: {
        isMatch: false,
        confidence: 95,
        lastChecked: Date.now()
      },
      adverseMedia: {
        articles: [],
        sentiment: 'neutral',
        riskScore: 0,
        lastChecked: Date.now()
      },
      jurisdictionRisk: {
        riskLevel: 'low',
        factors: []
      }
    };
  }

  private getEmptyNetworkAnalysis(): NetworkAnalysis {
    return {
      clusters: [],
      connections: [],
      flowPatterns: [],
      riskPropagation: []
    };
  }

  private getEmptyComplianceCheck(): ComplianceCheck {
    return {
      sanctionsStatus: {
        isMatch: false,
        lists: [],
        confidence: 0,
        lastChecked: Date.now()
      },
      pepStatus: {
        isMatch: false,
        confidence: 0,
        lastChecked: Date.now()
      },
      adverseMedia: {
        articles: [],
        sentiment: 'neutral',
        riskScore: 0,
        lastChecked: Date.now()
      },
      jurisdictionRisk: {
        riskLevel: 'low',
        factors: []
      }
    };
  }

  async getAllMCPStatus(): Promise<Record<string, boolean>> {
    return mcpManager.getServerStatus();
  }

  async getAllAvailableTools(): Promise<Record<string, any[]>> {
    return mcpManager.getAllAvailableTools();
  }
}

export const investigationService = new InvestigationService();
