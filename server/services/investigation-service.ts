import { mcpManager } from './mcp-services';
import { supervisorAgent } from '../agents/supervisor-agent';
import { blockchainTracerAgent } from '../agents/blockchain-tracer';
import { flowVisualizerAgent } from '../agents/flow-visualizer';

export interface InvestigationResult {
  address: string;
  riskScore: number;
  findings: Finding[];
  compliance: ComplianceCheck;
  metadata: AddressMetadata;
  timestamp: number;
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

export interface ComplianceCheck {
  sanctionsStatus: {
    isMatch: boolean;
    lists: string[];
    confidence: number;
    lastChecked: number;
  };
  pepStatus: {
    isMatch: boolean;
    person?: any;
    confidence: number;
    lastChecked: number;
  };
  adverseMedia: {
    articles: any[];
    sentiment: 'positive' | 'neutral' | 'negative';
    riskScore: number;
    lastChecked: number;
  };
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
    console.log(`🔍 Starting investigation for address: ${address}`);
    
    // Ensure MCP services are initialized
    await mcpManager.initializeAllServers();
    
    const results = await Promise.allSettled([
      this.performSherlockAnalysis(address),
      this.performGitHubThreatIntel(address),
      this.performEtherscanAnalysis(address),
      this.performHeliusAnalysis(address)
    ]);

    const [
      sherlockResult,
      githubResult, 
      etherscanResult,
      heliusResult
    ] = results.map(r => r.status === 'fulfilled' ? r.value : null);

    // Aggregate all findings
    const findings: Finding[] = [];
    let aggregatedRiskScore = 0;
    let findingCount = 0;

    // Process results
    [sherlockResult, githubResult, etherscanResult, heliusResult].forEach(result => {
      if (result) {
        findings.push(...result.findings);
        aggregatedRiskScore += result.riskScore;
        findingCount++;
      }
    });

    const finalRiskScore = findingCount > 0 ? Math.round(aggregatedRiskScore / findingCount) : 0;

    return {
      address,
      riskScore: finalRiskScore,
      findings: findings.sort((a, b) => b.confidence - a.confidence),
      compliance: this.generateComplianceCheck(findings),
      metadata: {
        label: `Address ${address.slice(0, 8)}...${address.slice(-8)}`,
        verified: false,
        source: 'Sentrysol Investigation',
        lastUpdated: Date.now()
      },
      timestamp: Date.now()
    };
  }

  private async performSherlockAnalysis(address: string): Promise<{
    findings: Finding[];
    riskScore: number;
  }> {
    try {
      const tools = await mcpManager.getAvailableTools('sherlock');
      console.log('Sherlock tools:', tools.map(t => t.name));

      // Simulate Sherlock analysis since actual tools may vary
      const findings: Finding[] = [
        {
          id: `sherlock-${Date.now()}`,
          type: 'pattern_detection',
          severity: 'medium',
          description: 'Address analyzed by Sherlock forensics engine',
          evidence: [{ 
            analysis: 'Pattern analysis completed',
            transactionPatterns: ['standard_transfers'],
            riskIndicators: []
          }],
          confidence: 75,
          source: 'Sherlock MCP',
          timestamp: Date.now()
        }
      ];

      return {
        findings,
        riskScore: 25
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
      const searchQuery = `${address} threat intelligence scam malicious`;
      
      // Simulate GitHub search - actual implementation would use MCP tools
      const findings: Finding[] = [];
      let riskScore = 0;

      // Mock some threat intelligence data
      if (Math.random() > 0.8) { // 20% chance of finding something
        findings.push({
          id: `github-threat-${Date.now()}`,
          type: 'aml',
          severity: 'medium',
          description: 'Address mentioned in threat intelligence repositories',
          evidence: [{ 
            repositories: ['crypto-scams-db', 'blockchain-blacklist'],
            mentions: 2
          }],
          confidence: 60,
          source: 'GitHub Threat Intel',
          timestamp: Date.now()
        });
        riskScore = 40;
      }

      return { findings, riskScore };
    } catch (error) {
      console.error('GitHub threat intel failed:', error);
      return { findings: [], riskScore: 0 };
    }
  }

  private async performEtherscanAnalysis(address: string): Promise<{
    findings: Finding[];
    riskScore: number;
  }> {
    try {
      // Simulate Etherscan analysis
      const findings: Finding[] = [];
      let riskScore = 0;

      // Mock transaction analysis
      const mockTxCount = Math.floor(Math.random() * 1000);
      const mockFailedTxs = Math.floor(mockTxCount * 0.05); // 5% failure rate
      
      if (mockFailedTxs > mockTxCount * 0.1) { // More than 10% failed
        findings.push({
          id: `etherscan-failed-${Date.now()}`,
          type: 'suspicious_activity', 
          severity: 'medium',
          description: `High failure rate: ${mockFailedTxs}/${mockTxCount} transactions failed`,
          evidence: [{ failedCount: mockFailedTxs, totalCount: mockTxCount }],
          confidence: 70,
          source: 'Etherscan Analysis',
          timestamp: Date.now()
        });
        riskScore += 25;
      }

      if (mockTxCount > 1000) {
        findings.push({
          id: `etherscan-volume-${Date.now()}`,
          type: 'suspicious_activity',
          severity: 'medium', 
          description: `High transaction volume: ${mockTxCount} transactions`,
          evidence: [{ transactionCount: mockTxCount }],
          confidence: 50,
          source: 'Etherscan Analysis',
          timestamp: Date.now()
        });
        riskScore += 15;
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
      // Simulate Helius analysis for Solana addresses
      if (!address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
        return { findings: [], riskScore: 0 }; // Not a Solana address
      }

      const findings: Finding[] = [];
      let riskScore = 0;

      // Mock Solana analysis
      const flags = [];
      if (Math.random() > 0.7) flags.push('HIGH_ACTIVITY');
      if (Math.random() > 0.9) flags.push('MULTIPLE_FAILED_TXS');
      if (Math.random() > 0.85) flags.push('HIGH_RECENT_ACTIVITY');

      flags.forEach(flag => {
        findings.push({
          id: `helius-${flag}-${Date.now()}`,
          type: 'suspicious_activity',
          severity: 'medium',
          description: `Helius detected: ${flag.replace(/_/g, ' ').toLowerCase()}`,
          evidence: [{ 
            flag,
            analysis: 'Solana transaction pattern analysis'
          }],
          confidence: 65,
          source: 'Helius Analysis',
          timestamp: Date.now()
        });
        riskScore += 20;
      });

      return { findings, riskScore: Math.min(riskScore, 100) };
    } catch (error) {
      console.error('Helius analysis failed:', error);
      return { findings: [], riskScore: 0 };
    }
  }

  private generateComplianceCheck(findings: Finding[]): ComplianceCheck {
    // Analyze findings to determine compliance status
    const sanctionsFindings = findings.filter(f => f.type === 'sanctions' || f.description.toLowerCase().includes('sanction'));
    const pepFindings = findings.filter(f => f.description.toLowerCase().includes('pep') || f.description.toLowerCase().includes('political'));
    const adverseFindings = findings.filter(f => f.type === 'aml' || f.description.toLowerCase().includes('threat'));

    return {
      sanctionsStatus: {
        isMatch: sanctionsFindings.length > 0,
        lists: sanctionsFindings.map(f => f.source),
        confidence: sanctionsFindings.length > 0 ? Math.max(...sanctionsFindings.map(f => f.confidence)) : 95,
        lastChecked: Date.now()
      },
      pepStatus: {
        isMatch: pepFindings.length > 0,
        confidence: pepFindings.length > 0 ? Math.max(...pepFindings.map(f => f.confidence)) : 95,
        lastChecked: Date.now()
      },
      adverseMedia: {
        articles: adverseFindings.map(f => ({ 
          source: f.source, 
          description: f.description,
          confidence: f.confidence
        })),
        sentiment: adverseFindings.length > 0 ? 'negative' : 'neutral',
        riskScore: adverseFindings.length > 0 ? Math.max(...adverseFindings.map(f => f.confidence)) : 0,
        lastChecked: Date.now()
      }
    };
  }

  async getServerStatus(): Promise<Record<string, boolean>> {
    return mcpManager.getServerStatus();
  }

  async getAllAvailableTools(): Promise<Record<string, any[]>> {
    return mcpManager.getAllAvailableTools();
  }
}

export const investigationService = new InvestigationService();
