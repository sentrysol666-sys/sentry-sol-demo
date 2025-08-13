import { ChatMistralAI } from "@langchain/mistralai";

export interface VisualizationData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  metadata: VisualizationMetadata;
  config: D3Config;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'target' | 'source' | 'sink' | 'exchange' | 'mixer' | 'bridge' | 'unknown';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  transactionCount: number;
  firstSeen: Date;
  lastSeen: Date;
  metadata: NodeMetadata;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  frequency: number;
  riskScore: number;
  type: 'direct' | 'indirect' | 'suspicious';
  timespan: {
    start: Date;
    end: Date;
  };
  transactions: string[];
}

export interface NodeMetadata {
  address: string;
  label?: string;
  category?: string;
  isExchange: boolean;
  isMixer: boolean;
  isContract: boolean;
  reputation?: number;
}

export interface VisualizationMetadata {
  targetAddress: string;
  depth: number;
  totalNodes: number;
  totalLinks: number;
  riskDistribution: Record<string, number>;
  timeRange: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
}

export interface D3Config {
  layout: 'force' | 'hierarchical' | 'circular' | 'tree';
  width: number;
  height: number;
  nodeRadius: {
    min: number;
    max: number;
  };
  linkDistance: number;
  chargeStrength: number;
  colorScheme: ColorScheme;
  legend: LegendConfig;
}

export interface ColorScheme {
  nodes: {
    target: string;
    source: string;
    sink: string;
    exchange: string;
    mixer: string;
    bridge: string;
    unknown: string;
  };
  links: {
    direct: string;
    indirect: string;
    suspicious: string;
  };
  risk: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
}

export interface LegendConfig {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  nodeTypes: boolean;
  riskLevels: boolean;
  linkTypes: boolean;
}

export class FlowVisualizerAgent {
  private model: ChatMistralAI;

  constructor() {
    this.model = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      model: process.env.MISTRAL_MODEL || "ft:mistral-medium-latest:b319469f:20250807:b80c0dce",
      temperature: 0.1,
    });
  }

  async generateVisualization(
    targetAddress: string,
    transactionData: any[],
    connectedEntities: any[],
    depth: number = 2
  ): Promise<VisualizationData> {
    console.log(`📊 Flow Visualizer: Creating visualization for ${targetAddress}`);

    try {
      // Step 1: Analyze transaction patterns with AI
      const analysisPrompt = `Analyze these blockchain transactions for visualization:
      
      Target Address: ${targetAddress}
      Connected Entities: ${connectedEntities.length}
      Transaction Count: ${transactionData.length}
      
      Identify:
      1. Node types (exchange, mixer, bridge, regular wallet)
      2. Risk levels for each address
      3. Transaction flow patterns
      4. Suspicious connections
      
      Provide structured analysis for network visualization.`;

      const analysis = await this.model.invoke([
        { role: "system", content: "You are an expert in blockchain network analysis and visualization." },
        { role: "user", content: analysisPrompt }
      ]);

      // Step 2: Generate nodes
      const nodes = await this.generateNodes(targetAddress, connectedEntities, transactionData);
      
      // Step 3: Generate links
      const links = await this.generateLinks(transactionData, nodes);
      
      // Step 4: Create metadata
      const metadata = this.generateMetadata(targetAddress, nodes, links, depth);
      
      // Step 5: Configure D3 settings
      const config = this.generateD3Config(nodes.length, links.length);

      return {
        nodes,
        links,
        metadata,
        config
      };
    } catch (error) {
      console.error('Flow visualization generation failed:', error);
      throw error;
    }
  }

  private async generateNodes(
    targetAddress: string,
    connectedEntities: any[],
    transactionData: any[]
  ): Promise<NetworkNode[]> {
    const nodes: NetworkNode[] = [];
    const addressSet = new Set<string>();

    // Add target node
    nodes.push({
      id: targetAddress,
      label: this.truncateAddress(targetAddress),
      type: 'target',
      riskLevel: 'medium', // Will be determined by analysis
      value: this.calculateAddressValue(targetAddress, transactionData),
      transactionCount: this.getTransactionCount(targetAddress, transactionData),
      firstSeen: this.getFirstTransaction(targetAddress, transactionData),
      lastSeen: this.getLastTransaction(targetAddress, transactionData),
      metadata: {
        address: targetAddress,
        isExchange: false,
        isMixer: false,
        isContract: false
      }
    });
    addressSet.add(targetAddress);

    // Add connected entity nodes
    connectedEntities.forEach(entity => {
      if (!addressSet.has(entity.address)) {
        const nodeType = this.determineNodeType(entity.address, entity);
        const riskLevel = this.determineRiskLevel(entity.riskScore);
        
        nodes.push({
          id: entity.address,
          label: this.truncateAddress(entity.address),
          type: nodeType,
          riskLevel,
          value: entity.totalValue || 0,
          transactionCount: entity.transactionCount || 0,
          firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastSeen: new Date(),
          metadata: {
            address: entity.address,
            isExchange: nodeType === 'exchange',
            isMixer: nodeType === 'mixer',
            isContract: nodeType === 'bridge',
            reputation: entity.riskScore
          }
        });
        addressSet.add(entity.address);
      }
    });

    // Add intermediate nodes from transaction data
    transactionData.forEach(tx => {
      [tx.from, tx.to].forEach(address => {
        if (address && !addressSet.has(address)) {
          nodes.push({
            id: address,
            label: this.truncateAddress(address),
            type: 'unknown',
            riskLevel: 'low',
            value: parseFloat(tx.value || '0'),
            transactionCount: 1,
            firstSeen: new Date(tx.timestamp),
            lastSeen: new Date(tx.timestamp),
            metadata: {
              address,
              isExchange: false,
              isMixer: false,
              isContract: false
            }
          });
          addressSet.add(address);
        }
      });
    });

    return nodes.slice(0, 50); // Limit nodes for performance
  }

  private async generateLinks(transactionData: any[], nodes: NetworkNode[]): Promise<NetworkLink[]> {
    const links: NetworkLink[] = [];
    const linkMap = new Map<string, NetworkLink>();

    transactionData.forEach(tx => {
      const linkKey = `${tx.from}-${tx.to}`;
      const reverseKey = `${tx.to}-${tx.from}`;
      
      // Check if nodes exist for this transaction
      const sourceExists = nodes.find(n => n.id === tx.from);
      const targetExists = nodes.find(n => n.id === tx.to);
      
      if (!sourceExists || !targetExists) return;

      if (linkMap.has(linkKey)) {
        // Update existing link
        const link = linkMap.get(linkKey)!;
        link.value += parseFloat(tx.value || '0');
        link.frequency += 1;
        link.transactions.push(tx.hash);
        link.timespan.end = new Date(Math.max(link.timespan.end.getTime(), tx.timestamp));
      } else if (linkMap.has(reverseKey)) {
        // Update reverse link
        const link = linkMap.get(reverseKey)!;
        link.value += parseFloat(tx.value || '0');
        link.frequency += 1;
        link.transactions.push(tx.hash);
      } else {
        // Create new link
        const riskScore = this.calculateLinkRiskScore(tx, sourceExists, targetExists);
        const linkType = this.determineLinkType(riskScore, tx);
        
        linkMap.set(linkKey, {
          source: tx.from,
          target: tx.to,
          value: parseFloat(tx.value || '0'),
          frequency: 1,
          riskScore,
          type: linkType,
          timespan: {
            start: new Date(tx.timestamp),
            end: new Date(tx.timestamp)
          },
          transactions: [tx.hash]
        });
      }
    });

    return Array.from(linkMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 100); // Limit links for performance
  }

  private generateMetadata(
    targetAddress: string,
    nodes: NetworkNode[],
    links: NetworkLink[],
    depth: number
  ): VisualizationMetadata {
    const riskDistribution = {
      low: nodes.filter(n => n.riskLevel === 'low').length,
      medium: nodes.filter(n => n.riskLevel === 'medium').length,
      high: nodes.filter(n => n.riskLevel === 'high').length,
      critical: nodes.filter(n => n.riskLevel === 'critical').length
    };

    const timeRange = {
      start: new Date(Math.min(...nodes.map(n => n.firstSeen.getTime()))),
      end: new Date(Math.max(...nodes.map(n => n.lastSeen.getTime())))
    };

    return {
      targetAddress,
      depth,
      totalNodes: nodes.length,
      totalLinks: links.length,
      riskDistribution,
      timeRange,
      generatedAt: new Date()
    };
  }

  private generateD3Config(nodeCount: number, linkCount: number): D3Config {
    // Adjust canvas size based on number of nodes
    const width = Math.max(800, Math.min(1200, nodeCount * 20));
    const height = Math.max(600, Math.min(900, nodeCount * 15));

    return {
      layout: nodeCount > 30 ? 'force' : 'hierarchical',
      width,
      height,
      nodeRadius: {
        min: 8,
        max: 25
      },
      linkDistance: 100,
      chargeStrength: -300,
      colorScheme: {
        nodes: {
          target: '#FF6B6B',
          source: '#4ECDC4',
          sink: '#45B7D1',
          exchange: '#96CEB4',
          mixer: '#FECA57',
          bridge: '#DDA0DD',
          unknown: '#95A5A6'
        },
        links: {
          direct: '#34495E',
          indirect: '#BDC3C7',
          suspicious: '#E74C3C'
        },
        risk: {
          low: '#2ECC71',
          medium: '#F39C12',
          high: '#E67E22',
          critical: '#E74C3C'
        }
      },
      legend: {
        position: 'top-right',
        nodeTypes: true,
        riskLevels: true,
        linkTypes: true
      }
    };
  }

  // Helper methods
  private truncateAddress(address: string): string {
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  private determineNodeType(address: string, entity: any): NetworkNode['type'] {
    // Simple heuristics - in production this would use comprehensive address labeling
    if (entity.transactionCount > 1000) return 'exchange';
    if (entity.relationship === 'mixer') return 'mixer';
    if (address.includes('bridge')) return 'bridge';
    if (entity.transactionCount > 100) return 'source';
    if (entity.transactionCount < 5) return 'sink';
    return 'unknown';
  }

  private determineRiskLevel(riskScore: number): NetworkNode['riskLevel'] {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  private calculateAddressValue(address: string, transactions: any[]): number {
    return transactions
      .filter(tx => tx.from === address || tx.to === address)
      .reduce((sum, tx) => sum + parseFloat(tx.value || '0'), 0);
  }

  private getTransactionCount(address: string, transactions: any[]): number {
    return transactions.filter(tx => tx.from === address || tx.to === address).length;
  }

  private getFirstTransaction(address: string, transactions: any[]): Date {
    const addressTxs = transactions.filter(tx => tx.from === address || tx.to === address);
    if (addressTxs.length === 0) return new Date();
    return new Date(Math.min(...addressTxs.map(tx => tx.timestamp)));
  }

  private getLastTransaction(address: string, transactions: any[]): Date {
    const addressTxs = transactions.filter(tx => tx.from === address || tx.to === address);
    if (addressTxs.length === 0) return new Date();
    return new Date(Math.max(...addressTxs.map(tx => tx.timestamp)));
  }

  private calculateLinkRiskScore(tx: any, sourceNode: NetworkNode, targetNode: NetworkNode): number {
    let riskScore = 0;

    // High-value transactions are riskier
    const value = parseFloat(tx.value || '0');
    if (value > 1000000) riskScore += 30;
    else if (value > 100000) riskScore += 20;
    else if (value > 10000) riskScore += 10;

    // Connections to high-risk nodes
    if (sourceNode.riskLevel === 'high' || targetNode.riskLevel === 'high') riskScore += 25;
    if (sourceNode.riskLevel === 'critical' || targetNode.riskLevel === 'critical') riskScore += 40;

    // Mixer connections
    if (sourceNode.metadata.isMixer || targetNode.metadata.isMixer) riskScore += 35;

    return Math.min(riskScore, 100);
  }

  private determineLinkType(riskScore: number, tx: any): NetworkLink['type'] {
    if (riskScore >= 50) return 'suspicious';
    if (tx.gasUsed && tx.gasUsed > 50000) return 'indirect'; // Contract interaction
    return 'direct';
  }

  // Method to generate client-side D3.js code
  generateD3Code(visualizationData: VisualizationData): string {
    return `
// D3.js Fund Flow Visualization
const data = ${JSON.stringify(visualizationData, null, 2)};

const svg = d3.select("#visualization")
  .append("svg")
  .attr("width", data.config.width)
  .attr("height", data.config.height);

const simulation = d3.forceSimulation(data.nodes)
  .force("link", d3.forceLink(data.links).id(d => d.id).distance(data.config.linkDistance))
  .force("charge", d3.forceManyBody().strength(data.config.chargeStrength))
  .force("center", d3.forceCenter(data.config.width / 2, data.config.height / 2));

// Create links
const link = svg.append("g")
  .selectAll("line")
  .data(data.links)
  .enter().append("line")
  .attr("stroke", d => data.config.colorScheme.links[d.type])
  .attr("stroke-width", d => Math.sqrt(d.value / 100000))
  .attr("stroke-opacity", 0.6);

// Create nodes
const node = svg.append("g")
  .selectAll("circle")
  .data(data.nodes)
  .enter().append("circle")
  .attr("r", d => Math.max(data.config.nodeRadius.min, 
    Math.min(data.config.nodeRadius.max, Math.sqrt(d.value / 10000))))
  .attr("fill", d => data.config.colorScheme.nodes[d.type])
  .attr("stroke", d => data.config.colorScheme.risk[d.riskLevel])
  .attr("stroke-width", 2)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

// Add labels
const label = svg.append("g")
  .selectAll("text")
  .data(data.nodes)
  .enter().append("text")
  .text(d => d.label)
  .attr("font-size", 10)
  .attr("dx", 15)
  .attr("dy", 4);

// Add tooltips
node.append("title")
  .text(d => \`Address: \${d.metadata.address}\\nRisk: \${d.riskLevel}\\nTransactions: \${d.transactionCount}\`);

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
    
  label
    .attr("x", d => d.x)
    .attr("y", d => d.y);
});

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
`;
  }
}

export const flowVisualizerAgent = new FlowVisualizerAgent();
