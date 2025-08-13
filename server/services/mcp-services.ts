import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createSmitheryUrl } from "@smithery/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

// MCP Configuration
const SMITHERY_API_KEY =
  process.env.SMITHERY_API_KEY || "a02e2920-c6fc-4120-81e4-b4d15e8f4389";
const SMITHERY_PROFILE =
  process.env.SMITHERY_PROFILE || "autonomous-hummingbird-dOxIG5";

export interface MCPServerConfig {
  name: string;
  url: string;
  profile?: string;
  description: string;
  capabilities: string[];
}

export const MCP_SERVERS: Record<string, MCPServerConfig> = {
  github: {
    name: "GitHub MCP Server",
    url: "https://server.smithery.ai/@smithery-ai/github",
    profile: SMITHERY_PROFILE,
    description: "Access GitHub repositories, issues, and code analysis",
    capabilities: [
      "repo_search",
      "code_analysis",
      "issue_tracking",
      "commit_history",
    ],
  },
  helius: {
    name: "Helius MCP Server",
    url: "https://server.smithery.ai/@dcSpark/mcp-server-helius",
    profile: SMITHERY_PROFILE,
    description: "Solana blockchain data and transaction analysis",
    capabilities: [
      "transaction_parsing",
      "account_info",
      "token_metadata",
      "nft_data",
    ],
  },
  sherlock: {
    name: "Sherlock MCP Server",
    url: "https://server.smithery.ai/@qKitNp/sherlock_mcp",
    description: "Advanced blockchain investigation and forensics",
    capabilities: [
      "address_clustering",
      "transaction_tracing",
      "risk_analysis",
      "pattern_detection",
    ],
  },
  etherscan: {
    name: "Etherscan MCP Server",
    url: "https://server.smithery.ai/@xiaok/etherscan-mcp-server",
    profile: SMITHERY_PROFILE,
    description: "Ethereum blockchain data and analytics",
    capabilities: [
      "eth_transactions",
      "contract_verification",
      "token_transfers",
      "gas_analytics",
    ],
  },
};

export class MCPServiceManager {
  private clients: Map<string, Client> = new Map();
  private transports: Map<string, StreamableHTTPClientTransport> = new Map();
  private initPromise: Promise<void> | null = null;

  async initializeServer(serverKey: keyof typeof MCP_SERVERS): Promise<Client> {
    const config = MCP_SERVERS[serverKey];

    if (this.clients.has(serverKey)) {
      return this.clients.get(serverKey)!;
    }

    try {
      const serverUrl = config.profile
        ? createSmitheryUrl(config.url, {
            apiKey: SMITHERY_API_KEY,
            profile: config.profile,
          })
        : createSmitheryUrl(config.url, { apiKey: SMITHERY_API_KEY });

      const transport = new StreamableHTTPClientTransport(serverUrl);
      this.transports.set(serverKey, transport);

      const client = new Client({
        name: "Sentrysol AML Platform",
        version: "1.0.0",
      });

      await client.connect(transport);
      this.clients.set(serverKey, client);

      console.log(`✅ Connected to ${config.name}`);
      return client;
    } catch (error) {
      console.error(`❌ Failed to connect to ${config.name}:`, error);
      throw error;
    }
  }

  async initializeAllServers(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const promises = Object.keys(MCP_SERVERS).map((key) =>
        this.initializeServer(key as keyof typeof MCP_SERVERS).catch(
          (error) => {
            console.warn(`Failed to initialize ${key}:`, error);
            return null;
          },
        ),
      );

      await Promise.allSettled(promises);
    })();

    return this.initPromise;
  }

  getClient(serverKey: keyof typeof MCP_SERVERS): Client | null {
    return this.clients.get(serverKey) || null;
  }

  async getAvailableTools(serverKey: keyof typeof MCP_SERVERS): Promise<any[]> {
    const client = this.getClient(serverKey);
    if (!client) {
      throw new Error(`Client for ${serverKey} not initialized`);
    }

    try {
      const tools = await client.listTools();
      return tools;
    } catch (error) {
      console.error(`Error listing tools for ${serverKey}:`, error);
      return [];
    }
  }

  async getAllAvailableTools(): Promise<Record<string, any[]>> {
    const tools: Record<string, any[]> = {};

    for (const serverKey of Object.keys(MCP_SERVERS)) {
      try {
        tools[serverKey] = await this.getAvailableTools(
          serverKey as keyof typeof MCP_SERVERS,
        );
      } catch (error) {
        tools[serverKey] = [];
      }
    }

    return tools;
  }

  async disconnect(): Promise<void> {
    for (const [key, transport] of this.transports) {
      try {
        await transport.close();
        console.log(`Disconnected from ${key}`);
      } catch (error) {
        console.error(`Error disconnecting from ${key}:`, error);
      }
    }

    this.clients.clear();
    this.transports.clear();
    this.initPromise = null;
  }

  getServerStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const serverKey of Object.keys(MCP_SERVERS)) {
      status[serverKey] = this.clients.has(serverKey);
    }
    return status;
  }

  async callTool(
    serverKey: keyof typeof MCP_SERVERS,
    toolName: string,
    parameters: any = {},
  ): Promise<any> {
    const client = this.getClient(serverKey);
    if (!client) {
      throw new Error(`Client for ${serverKey} not initialized`);
    }

    try {
      const result = await client.callTool(toolName, parameters);
      return result;
    } catch (error) {
      console.error(`Error calling tool ${toolName} on ${serverKey}:`, error);
      throw error;
    }
  }
}

// Global instance
export const mcpManager = new MCPServiceManager();
