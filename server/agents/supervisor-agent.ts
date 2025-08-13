import { ChatMistralAI } from "@langchain/mistralai";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { Client } from "langsmith";
import { metaSleuthService } from "../services/metasleuth-service";
import { chainabuseService } from "../services/chainabuse-service";
import { coinstatsService } from "../services/coinstats-service";
import { pepCheckerService } from "../services/pep-checker-service";
import { heliusEnhancedService } from "../services/helius-enhanced-service";

// Initialize LangSmith for tracing
const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
  apiUrl: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com"
});

// Define the agent state
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  next: Annotation<string>(),
  investigation_data: Annotation<any>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  agent_outputs: Annotation<Record<string, any>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  final_report: Annotation<any>(),
});

// Initialize Mistral AI model
const model = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: process.env.MISTRAL_MODEL || "ft:mistral-medium-latest:b319469f:20250807:b80c0dce",
  temperature: 0.1,
});

export interface AgentInput {
  address: string;
  investigationType: 'full' | 'sanctions' | 'tracing' | 'media' | 'visualization';
  userQuery?: string;
}

export interface AgentOutput {
  agent: string;
  result: any;
  confidence: number;
  findings: any[];
  timestamp: number;
}

export class SupervisorAgent {
  private graph: StateGraph<any>;

  constructor() {
    this.graph = new StateGraph(AgentState);
    this.setupAgentGraph();
  }

  private setupAgentGraph() {
    // Add agent nodes
    this.graph.addNode("supervisor", this.supervisorNode.bind(this));
    this.graph.addNode("blockchain_tracer", this.blockchainTracerNode.bind(this));
    this.graph.addNode("sanctions_screener", this.sanctionsScreenerNode.bind(this));
    this.graph.addNode("media_analyzer", this.mediaAnalyzerNode.bind(this));
    this.graph.addNode("flow_visualizer", this.flowVisualizerNode.bind(this));
    this.graph.addNode("coordinator", this.coordinatorNode.bind(this));

    // Define the workflow
    this.graph.addEdge(START, "supervisor");
    
    // Conditional edges from supervisor to agents
    this.graph.addConditionalEdges(
      "supervisor",
      this.routeAgent.bind(this),
      {
        "blockchain_tracer": "blockchain_tracer",
        "sanctions_screener": "sanctions_screener", 
        "media_analyzer": "media_analyzer",
        "flow_visualizer": "flow_visualizer",
        "coordinator": "coordinator",
        "end": END,
      }
    );

    // All agents route back to coordinator
    this.graph.addEdge("blockchain_tracer", "coordinator");
    this.graph.addEdge("sanctions_screener", "coordinator");
    this.graph.addEdge("media_analyzer", "coordinator");
    this.graph.addEdge("flow_visualizer", "coordinator");
    
    // Coordinator can loop back to supervisor or end
    this.graph.addConditionalEdges(
      "coordinator",
      this.shouldContinue.bind(this),
      {
        "supervisor": "supervisor",
        "end": END,
      }
    );
  }

  private async supervisorNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
    const lastMessage = state.messages[state.messages.length - 1];
    
    const systemPrompt = `You are the Supervisor Agent for Sentrysol AML platform. 
    You coordinate blockchain compliance investigations using specialized agents:
    
    1. blockchain_tracer - Traces transaction flows and patterns
    2. sanctions_screener - Screens against global sanctions lists  
    3. media_analyzer - Analyzes adverse media and news
    4. flow_visualizer - Creates fund flow visualizations
    5. coordinator - Combines all results and makes decisions
    
    Based on the investigation request, decide which agent should handle it next.
    If this is a new investigation, start with blockchain_tracer.
    If you have enough information, route to coordinator.`;

    const response = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: lastMessage.content }
    ]);

    return {
      messages: [new AIMessage(response.content as string)],
      next: this.determineNextAgent(state, response.content as string)
    };
  }

  private async blockchainTracerNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
    console.log("🔍 Blockchain Tracer Agent activated");

    const address = this.extractAddress(state);
    const chain = this.detectChain(address);

    try {
      let tracingResult: any = {};

      if (chain === 'solana') {
        // Use Helius for Solana data
        const [transactionHistory, addressInfo, nfts] = await Promise.all([
          heliusEnhancedService.getTransactionHistory(address, 100),
          heliusEnhancedService.getAddressInfo(address),
          heliusEnhancedService.getNFTsByOwner(address)
        ]);

        tracingResult = {
          address,
          chain,
          transactionCount: transactionHistory.length,
          transactionHistory: transactionHistory.slice(0, 20), // Keep recent 20 for analysis
          addressInfo,
          nftHoldings: nfts,
          riskPatterns: this.analyzeTransactionPatterns(transactionHistory),
          connectedAddresses: this.extractConnectedAddresses(transactionHistory),
          timeframeAnalysis: this.analyzeTimeframes(transactionHistory),
          confidence: 0.9
        };
      } else {
        // Use Coinstats for Ethereum and other EVM chains
        const [balance, transactions, chart] = await Promise.all([
          coinstatsService.getWalletBalance(address, chain),
          coinstatsService.getWalletTransactions(address, chain, 100),
          coinstatsService.getWalletChart(address, chain, '30d')
        ]);

        tracingResult = {
          address,
          chain,
          transactionCount: transactions.length,
          balance,
          transactionHistory: transactions.slice(0, 20),
          priceChart: chart,
          riskPatterns: this.analyzeTransactionPatterns(transactions),
          connectedAddresses: this.extractConnectedAddresses(transactions),
          timeframeAnalysis: this.analyzeTimeframes(transactions),
          confidence: 0.85
        };
      }

      return {
        agent_outputs: {
          blockchain_tracer: {
            agent: "blockchain_tracer",
            result: tracingResult,
            confidence: Math.round(tracingResult.confidence * 100),
            findings: this.generateTracingFindings(tracingResult),
            timestamp: Date.now()
          }
        },
        investigation_data: { tracing: tracingResult }
      };
    } catch (error) {
      console.error("Blockchain Tracer error:", error);
      return {
        agent_outputs: {
          blockchain_tracer: {
            agent: "blockchain_tracer",
            result: { error: "Tracing analysis failed", address, details: error },
            confidence: 0,
            findings: [],
            timestamp: Date.now()
          }
        }
      };
    }
  }

  private async sanctionsScreenerNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
    console.log("🛡️ Sanctions Screener Agent activated");

    const address = this.extractAddress(state);
    const chain = this.detectChain(address);

    try {
      // Use multiple real sanctions screening APIs
      const [chainabuseResult, metasleuthResult] = await Promise.all([
        chainabuseService.checkSanctionedAddress(address),
        metaSleuthService.screenWallet(address, chain)
      ]);

      // Get address labels for additional context
      const addressLabels = await metaSleuthService.getAddressLabels(address);

      const screeningResult = {
        address,
        chain,
        // Chainabuse results
        sanctionsMatch: chainabuseResult.data.sanctioned,
        sanctionsDetails: chainabuseResult.data.details,
        sanctionsSource: chainabuseResult.data.source,
        // MetaSleuth results
        riskLevel: metasleuthResult.data.riskLevel,
        blacklistMatch: metasleuthResult.data.blacklistMatch,
        mixerServices: metasleuthResult.data.mixerServices,
        exchanges: metasleuthResult.data.exchanges,
        illicitServices: metasleuthResult.data.illicitServices,
        // Address labels
        labels: addressLabels.data.labels,
        // Combined confidence
        confidence: Math.max(chainabuseResult.data.confidence, metasleuthResult.data.confidence),
        timestamp: Date.now()
      };

      return {
        agent_outputs: {
          sanctions_screener: {
            agent: "sanctions_screener",
            result: screeningResult,
            confidence: Math.round(screeningResult.confidence * 100),
            findings: this.generateSanctionsFindings(screeningResult),
            timestamp: Date.now()
          }
        },
        investigation_data: { sanctions: screeningResult }
      };
    } catch (error) {
      console.error("Sanctions Screener error:", error);
      return {
        agent_outputs: {
          sanctions_screener: {
            agent: "sanctions_screener",
            result: { error: "Sanctions screening failed", address, details: error },
            confidence: 0,
            findings: [],
            timestamp: Date.now()
          }
        }
      };
    }
  }

  private async mediaAnalyzerNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
    console.log("📰 Media Analyzer Agent activated");
    
    const address = this.extractAddress(state);
    
    try {
      // Simulate adverse media analysis using LLM
      const mediaPrompt = `Analyze adverse media for blockchain address ${address}. 
      Look for mentions in news articles, social media, and public records.
      Focus on criminal activity, sanctions violations, and reputational risks.`;

      const mediaResponse = await model.invoke([
        { role: "system", content: "You are an expert in adverse media analysis for AML compliance." },
        { role: "user", content: mediaPrompt }
      ]);

      const mediaResult = {
        address,
        articlesFound: Math.floor(Math.random() * 10),
        sentiment: Math.random() > 0.7 ? 'negative' : 'neutral',
        riskScore: Math.floor(Math.random() * 50) + 25,
        analysis: mediaResponse.content,
        confidence: 0.75
      };

      return {
        agent_outputs: {
          media_analyzer: {
            agent: "media_analyzer",
            result: mediaResult,
            confidence: 75,
            findings: this.generateMediaFindings(mediaResult),
            timestamp: Date.now()
          }
        },
        investigation_data: { media: mediaResult }
      };
    } catch (error) {
      console.error("Media Analyzer error:", error);
      return {
        agent_outputs: {
          media_analyzer: {
            agent: "media_analyzer",
            result: { error: "Media analysis failed" },
            confidence: 0,
            findings: [],
            timestamp: Date.now()
          }
        }
      };
    }
  }

  private async flowVisualizerNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
    console.log("📊 Flow Visualizer Agent activated");
    
    const address = this.extractAddress(state);
    const tracingData = state.investigation_data.tracing;
    
    try {
      // Generate D3.js compatible visualization data
      const visualizationData = {
        address,
        nodes: this.generateVisualizationNodes(address, tracingData),
        links: this.generateVisualizationLinks(tracingData),
        layout: "force-directed",
        config: {
          width: 800,
          height: 600,
          nodeRadius: 10,
          linkDistance: 100
        }
      };

      return {
        agent_outputs: {
          flow_visualizer: {
            agent: "flow_visualizer",
            result: visualizationData,
            confidence: 90,
            findings: this.generateVisualizationFindings(visualizationData),
            timestamp: Date.now()
          }
        },
        investigation_data: { visualization: visualizationData }
      };
    } catch (error) {
      console.error("Flow Visualizer error:", error);
      return {
        agent_outputs: {
          flow_visualizer: {
            agent: "flow_visualizer",
            result: { error: "Visualization generation failed" },
            confidence: 0,
            findings: [],
            timestamp: Date.now()
          }
        }
      };
    }
  }

  private async coordinatorNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
    console.log("🧠 Coordinator Agent activated");
    
    const agentOutputs = Object.values(state.agent_outputs);
    const allFindings = agentOutputs.flatMap(output => output.findings || []);
    
    // Use LLM to generate comprehensive final report
    const reportPrompt = `Generate a comprehensive AML investigation report based on these agent findings:
    
    Agent Outputs: ${JSON.stringify(agentOutputs, null, 2)}
    
    Provide:
    1. Executive summary
    2. Risk assessment (Low/Medium/High)
    3. Key findings prioritized by severity
    4. Compliance recommendations
    5. Next steps`;

    const reportResponse = await model.invoke([
      { role: "system", content: "You are an expert AML compliance analyst generating investigation reports." },
      { role: "user", content: reportPrompt }
    ]);

    const finalReport = {
      investigationId: `INV-${Date.now()}`,
      address: this.extractAddress(state),
      timestamp: Date.now(),
      riskScore: this.calculateOverallRiskScore(agentOutputs),
      riskLevel: this.determineRiskLevel(agentOutputs),
      agentResults: state.agent_outputs,
      findings: allFindings,
      executiveSummary: reportResponse.content,
      recommendations: this.generateRecommendations(agentOutputs),
      nextSteps: this.generateNextSteps(agentOutputs)
    };

    return {
      final_report: finalReport,
      messages: [new AIMessage(`Investigation completed. Final report generated with risk level: ${finalReport.riskLevel}`)]
    };
  }

  // Helper methods
  private detectChain(address: string): string {
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return 'solana';
    } else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return 'ethereum';
    }
    return 'ethereum'; // Default to Ethereum for unknown formats
  }

  private analyzeTransactionPatterns(transactions: any[]): any[] {
    const patterns = [];

    if (transactions.length === 0) return patterns;

    // Check for rapid fire transactions (multiple txs in short time)
    const rapidFire = this.detectRapidFirePattern(transactions);
    if (rapidFire.detected) {
      patterns.push({
        type: 'rapid_fire',
        confidence: rapidFire.confidence,
        description: `${rapidFire.count} transactions within ${rapidFire.timeWindow} minutes`,
        severity: 'medium'
      });
    }

    // Check for circular transactions
    const circular = this.detectCircularPattern(transactions);
    if (circular.detected) {
      patterns.push({
        type: 'circular',
        confidence: circular.confidence,
        description: 'Circular transaction pattern detected',
        severity: 'high'
      });
    }

    // Check for mixer-like patterns (many small inputs/outputs)
    const mixing = this.detectMixingPattern(transactions);
    if (mixing.detected) {
      patterns.push({
        type: 'mixing',
        confidence: mixing.confidence,
        description: 'Potential mixing service usage',
        severity: 'high'
      });
    }

    return patterns;
  }

  private detectRapidFirePattern(transactions: any[]): any {
    if (transactions.length < 5) return { detected: false };

    const timeWindow = 10 * 60 * 1000; // 10 minutes
    let maxCount = 0;

    for (let i = 0; i < transactions.length - 1; i++) {
      const startTime = transactions[i].timestamp || transactions[i].blockTime * 1000;
      let count = 1;

      for (let j = i + 1; j < transactions.length; j++) {
        const txTime = transactions[j].timestamp || transactions[j].blockTime * 1000;
        if (txTime - startTime <= timeWindow) {
          count++;
        } else {
          break;
        }
      }

      maxCount = Math.max(maxCount, count);
    }

    return {
      detected: maxCount >= 5,
      count: maxCount,
      timeWindow: 10,
      confidence: Math.min(maxCount / 10, 1)
    };
  }

  private detectCircularPattern(transactions: any[]): any {
    const addressMap = new Map();

    transactions.forEach(tx => {
      const from = tx.from || tx.feePayer;
      const to = tx.to || tx.accountKeys?.[1];

      if (!addressMap.has(from)) addressMap.set(from, new Set());
      if (!addressMap.has(to)) addressMap.set(to, new Set());

      addressMap.get(from).add(to);
    });

    // Simple circular detection: check if A -> B and B -> A
    let circularCount = 0;
    for (const [from, toSet] of addressMap) {
      for (const to of toSet) {
        if (addressMap.has(to) && addressMap.get(to).has(from)) {
          circularCount++;
        }
      }
    }

    return {
      detected: circularCount > 0,
      confidence: Math.min(circularCount / 3, 1),
      count: circularCount
    };
  }

  private detectMixingPattern(transactions: any[]): any {
    if (transactions.length < 10) return { detected: false };

    const amounts = transactions.map(tx => parseFloat(tx.value || '0'));
    const uniqueAmounts = new Set(amounts).size;
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    // Check for many small, similar amounts (mixing pattern)
    const smallAmounts = amounts.filter(amt => amt < avgAmount * 0.1).length;
    const similarAmounts = amounts.length - uniqueAmounts;

    const mixingScore = (smallAmounts + similarAmounts) / amounts.length;

    return {
      detected: mixingScore > 0.6,
      confidence: mixingScore,
      smallAmountRatio: smallAmounts / amounts.length,
      uniqueAmountRatio: uniqueAmounts / amounts.length
    };
  }

  private extractConnectedAddresses(transactions: any[]): string[] {
    const addresses = new Set<string>();

    transactions.forEach(tx => {
      if (tx.from) addresses.add(tx.from);
      if (tx.to) addresses.add(tx.to);
      if (tx.feePayer) addresses.add(tx.feePayer);
      if (tx.accountKeys) {
        tx.accountKeys.forEach((addr: string) => addresses.add(addr));
      }
    });

    return Array.from(addresses).slice(0, 20); // Limit to top 20
  }

  private analyzeTimeframes(transactions: any[]): any {
    if (transactions.length === 0) {
      return {
        last24h: 0,
        last7d: 0,
        last30d: 0,
        activity_pattern: 'no_activity'
      };
    }

    const now = Date.now();
    const hour24 = 24 * 60 * 60 * 1000;
    const day7 = 7 * hour24;
    const day30 = 30 * hour24;

    const last24h = transactions.filter(tx => {
      const txTime = tx.timestamp || tx.blockTime * 1000;
      return now - txTime <= hour24;
    }).length;

    const last7d = transactions.filter(tx => {
      const txTime = tx.timestamp || tx.blockTime * 1000;
      return now - txTime <= day7;
    }).length;

    const last30d = transactions.filter(tx => {
      const txTime = tx.timestamp || tx.blockTime * 1000;
      return now - txTime <= day30;
    }).length;

    // Determine activity pattern
    let activityPattern = 'normal';
    if (last24h > 20) activityPattern = 'high_frequency';
    else if (last24h === 0 && last7d === 0) activityPattern = 'dormant';
    else if (last7d > last30d * 0.8) activityPattern = 'recent_surge';

    return {
      last24h,
      last7d,
      last30d,
      activity_pattern: activityPattern,
      avgDailyTxs: last30d / 30
    };
  }

  private determineNextAgent(state: typeof AgentState.State, response: string): string {
    // Simple routing logic - in production this would be more sophisticated
    const completedAgents = Object.keys(state.agent_outputs);
    
    if (!completedAgents.includes("blockchain_tracer")) return "blockchain_tracer";
    if (!completedAgents.includes("sanctions_screener")) return "sanctions_screener";
    if (!completedAgents.includes("media_analyzer")) return "media_analyzer";
    if (!completedAgents.includes("flow_visualizer")) return "flow_visualizer";
    
    return "coordinator";
  }

  private routeAgent(state: typeof AgentState.State): string {
    return state.next || "blockchain_tracer";
  }

  private shouldContinue(state: typeof AgentState.State): string {
    // If we have a final report, end the investigation
    if (state.final_report) return "end";
    
    // Otherwise continue
    return "supervisor";
  }

  private extractAddress(state: typeof AgentState.State): string {
    const lastMessage = state.messages[state.messages.length - 1];
    // Extract address from message content - simple regex for demo
    const addressMatch = lastMessage.content.match(/[a-zA-Z0-9]{32,44}/);
    return addressMatch ? addressMatch[0] : "unknown";
  }

  private generateRiskPatterns(): any[] {
    const patterns = ["mixing", "layering", "rapid_fire", "circular"];
    return patterns.filter(() => Math.random() > 0.7).map(pattern => ({
      type: pattern,
      confidence: Math.random() * 0.5 + 0.5,
      description: `${pattern} pattern detected`
    }));
  }

  private generateConnectedAddresses(): string[] {
    const count = Math.floor(Math.random() * 10) + 1;
    return Array(count).fill(0).map(() => 
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  private generateTimeframeAnalysis(): any {
    return {
      last24h: Math.floor(Math.random() * 50),
      last7d: Math.floor(Math.random() * 200),
      last30d: Math.floor(Math.random() * 500),
      activity_pattern: Math.random() > 0.5 ? "normal" : "suspicious"
    };
  }

  private generateTracingFindings(result: any): any[] {
    const findings = [];
    if (result.transactionCount > 500) {
      findings.push({
        type: "high_volume",
        severity: "medium",
        description: `High transaction volume: ${result.transactionCount} transactions`
      });
    }
    return findings;
  }

  private generateSanctionsFindings(result: any): any[] {
    const findings = [];

    if (result.sanctionsMatch) {
      findings.push({
        type: "sanctions_match",
        severity: "critical",
        description: `Address matches sanctions list: ${result.sanctionsSource}`,
        evidence: result.sanctionsDetails
      });
    }

    if (result.blacklistMatch) {
      findings.push({
        type: "blacklist_match",
        severity: "high",
        description: "Address found on blacklist databases"
      });
    }

    if (result.mixerServices && result.mixerServices.length > 0) {
      findings.push({
        type: "mixer_usage",
        severity: "high",
        description: `Connected to mixing services: ${result.mixerServices.join(', ')}`
      });
    }

    if (result.illicitServices && result.illicitServices.length > 0) {
      findings.push({
        type: "illicit_services",
        severity: "critical",
        description: `Connected to illicit services: ${result.illicitServices.join(', ')}`
      });
    }

    if (result.riskLevel === 'high' || result.riskLevel === 'critical') {
      findings.push({
        type: "high_risk_rating",
        severity: result.riskLevel === 'critical' ? 'critical' : 'high',
        description: `MetaSleuth risk assessment: ${result.riskLevel}`
      });
    }

    // Check for concerning labels
    if (result.labels && result.labels.length > 0) {
      const concerningLabels = result.labels.filter((label: any) =>
        label.type === 'sanctions' || label.type === 'scam' || label.type === 'hack'
      );

      if (concerningLabels.length > 0) {
        findings.push({
          type: "concerning_labels",
          severity: "high",
          description: `Concerning labels found: ${concerningLabels.map((l: any) => l.label).join(', ')}`
        });
      }
    }

    return findings;
  }

  private generateMediaFindings(result: any): any[] {
    const findings = [];
    if (result.sentiment === 'negative') {
      findings.push({
        type: "adverse_media",
        severity: "medium",
        description: `Negative media coverage found (${result.articlesFound} articles)`
      });
    }
    return findings;
  }

  private generateVisualizationNodes(address: string, tracingData: any): any[] {
    const nodes = [{ id: address, type: "target", label: address.substring(0, 8) + "..." }];
    
    if (tracingData?.connectedAddresses) {
      tracingData.connectedAddresses.forEach((addr: string, index: number) => {
        nodes.push({
          id: addr,
          type: "connected",
          label: addr.substring(0, 8) + "...",
          risk: Math.random() > 0.7 ? "high" : "low"
        });
      });
    }
    
    return nodes;
  }

  private generateVisualizationLinks(tracingData: any): any[] {
    if (!tracingData?.connectedAddresses) return [];
    
    return tracingData.connectedAddresses.map((addr: string) => ({
      source: tracingData.address,
      target: addr,
      value: Math.random() * 1000000,
      type: "transaction"
    }));
  }

  private generateVisualizationFindings(visualizationData: any): any[] {
    const findings = [];
    if (visualizationData.nodes.length > 10) {
      findings.push({
        type: "complex_network",
        severity: "medium", 
        description: `Complex transaction network with ${visualizationData.nodes.length} connected addresses`
      });
    }
    return findings;
  }

  private calculateOverallRiskScore(agentOutputs: any[]): number {
    const scores = agentOutputs.map(output => output.confidence || 0);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  private determineRiskLevel(agentOutputs: any[]): 'Low' | 'Medium' | 'High' {
    const overallScore = this.calculateOverallRiskScore(agentOutputs);
    if (overallScore >= 80) return 'High';
    if (overallScore >= 50) return 'Medium';
    return 'Low';
  }

  private generateRecommendations(agentOutputs: any[]): string[] {
    const recommendations = [];
    
    // Check for high-risk findings
    const hasHighRisk = agentOutputs.some(output => 
      output.findings?.some((f: any) => f.severity === 'critical' || f.severity === 'high')
    );
    
    if (hasHighRisk) {
      recommendations.push("Immediate escalation to compliance team required");
      recommendations.push("Consider filing SAR (Suspicious Activity Report)");
    } else {
      recommendations.push("Continue monitoring for unusual activity");
      recommendations.push("Schedule periodic review in 30 days");
    }
    
    return recommendations;
  }

  private generateNextSteps(agentOutputs: any[]): string[] {
    return [
      "Document all findings in case management system",
      "Share report with relevant stakeholders", 
      "Set up ongoing monitoring alerts",
      "Review similar addresses for patterns"
    ];
  }

  // Public method to run investigation
  async runInvestigation(input: AgentInput): Promise<any> {
    const compiledGraph = this.graph.compile();
    
    const initialState = {
      messages: [new HumanMessage(`Investigate address: ${input.address}. Type: ${input.investigationType}. ${input.userQuery || ''}`)],
      next: "blockchain_tracer",
      investigation_data: {},
      agent_outputs: {},
      final_report: null
    };

    const result = await compiledGraph.invoke(initialState);
    return result.final_report;
  }
}

// Export singleton instance
export const supervisorAgent = new SupervisorAgent();
