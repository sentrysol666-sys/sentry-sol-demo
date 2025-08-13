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
    
    try {
      // Simulate blockchain tracing analysis
      const tracingResult = {
        address,
        transactionCount: Math.floor(Math.random() * 1000) + 100,
        riskPatterns: this.generateRiskPatterns(),
        connectedAddresses: this.generateConnectedAddresses(),
        timeframeAnalysis: this.generateTimeframeAnalysis(),
        confidence: 0.85
      };

      return {
        agent_outputs: {
          blockchain_tracer: {
            agent: "blockchain_tracer",
            result: tracingResult,
            confidence: 85,
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
            result: { error: "Tracing analysis failed" },
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
    
    try {
      // Simulate sanctions screening
      const screeningResult = {
        address,
        sanctionsMatch: Math.random() > 0.9, // 10% chance of match
        lists: ["OFAC", "EU", "UN"],
        pepMatch: Math.random() > 0.95, // 5% chance of PEP match
        confidence: 0.98
      };

      return {
        agent_outputs: {
          sanctions_screener: {
            agent: "sanctions_screener",
            result: screeningResult,
            confidence: 98,
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
            result: { error: "Sanctions screening failed" },
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
        description: "Address matches sanctions list"
      });
    }
    if (result.pepMatch) {
      findings.push({
        type: "pep_match", 
        severity: "high",
        description: "Address linked to politically exposed person"
      });
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
