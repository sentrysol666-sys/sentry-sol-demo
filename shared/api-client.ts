// Client-side API service for MCP operations
export interface MCPStatus {
  serverStatus: Record<string, boolean>;
  availableTools: Record<string, any[]>;
  timestamp: number;
}

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
  type: "sanctions" | "aml" | "suspicious_activity" | "pattern_detection";
  severity: "low" | "medium" | "high" | "critical";
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
    sentiment: "positive" | "neutral" | "negative";
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

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

class MCPApiClient {
  private baseUrl = "/api/mcp";
  private walletBaseUrl = "/api/wallet";
  private amlBaseUrl = "/api/aml";

  async getMCPStatus(): Promise<MCPStatus> {
    const response = await fetch(`${this.baseUrl}/status`);
    const result: APIResponse<MCPStatus> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get MCP status");
    }

    return result.data!;
  }

  async investigateAddressWithAgents(
    address: string,
    investigationType:
      | "full"
      | "sanctions"
      | "tracing"
      | "media"
      | "visualization" = "full",
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/investigate-agents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, investigationType }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Multi-agent investigation failed");
    }

    return result.data!;
  }

  async performBlockchainTracing(address: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/trace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Blockchain tracing failed");
    }

    return result.data!;
  }

  async generateFlowVisualization(
    address: string,
    transactionData: any[] = [],
    connectedEntities: any[] = [],
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/visualize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, transactionData, connectedEntities }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Flow visualization failed");
    }

    return result.data!;
  }

  async investigateAddress(address: string): Promise<InvestigationResult> {
    const response = await fetch(`${this.baseUrl}/investigate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    const result: APIResponse<InvestigationResult> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Investigation failed");
    }

    return result.data!;
  }

  async retryConnection(serverKey: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/retry/${serverKey}`, {
      method: "POST",
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to retry connection");
    }
  }

  async getTools(serverKey: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/tools/${serverKey}`);
    const result: APIResponse<{ tools: any[] }> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get tools");
    }

    return result.data!.tools;
  }

  async callTool(
    serverKey: string,
    toolName: string,
    parameters: any = {},
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/call/${serverKey}/${toolName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parameters }),
      },
    );

    const result: APIResponse<{ result: any }> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to call tool");
    }

    return result.data!.result;
  }

  // Wallet Analysis Methods
  async analyzeConnectedWallet(
    address: string,
    chain: "solana" | "ethereum",
    walletType: string,
    connectionData: any = {},
  ): Promise<any> {
    const response = await fetch(`${this.walletBaseUrl}/analyze-connected`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, chain, walletType, connectionData }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Connected wallet analysis failed");
    }

    return result.data!;
  }

  async analyzeWalletAddress(address: string): Promise<any> {
    const response = await fetch(`${this.walletBaseUrl}/analyze-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Wallet address analysis failed");
    }

    return result.data!;
  }

  async getWalletConnectionStatus(address: string): Promise<any> {
    const response = await fetch(
      `${this.walletBaseUrl}/connection-status/${address}`,
    );
    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get wallet connection status");
    }

    return result.data!;
  }

  async startLiveMonitoring(addresses: string[]): Promise<any> {
    const response = await fetch(`${this.walletBaseUrl}/live-monitoring`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addresses }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to start live monitoring");
    }

    return result.data!;
  }

  async performEnhancedInvestigation(
    address: string,
    investigationType: string = "full",
  ): Promise<any> {
    const response = await fetch(
      `${this.walletBaseUrl}/enhanced-investigation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, investigationType }),
      },
    );

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Enhanced investigation failed");
    }

    return result.data!;
  }

  async getWalletRiskFactors(address: string): Promise<any> {
    const response = await fetch(
      `${this.walletBaseUrl}/risk-factors/${address}`,
    );
    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get wallet risk factors");
    }

    return result.data!;
  }

  // Comprehensive AML Investigation Methods
  async comprehensiveInvestigation(
    address: string,
    investigationType: string = "full",
    userQuery?: string,
  ): Promise<any> {
    const response = await fetch(`${this.amlBaseUrl}/investigate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, investigationType, userQuery }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Comprehensive investigation failed");
    }

    return result.data!;
  }

  async screenWalletComprehensive(
    address: string,
    chain: string = "ethereum",
  ): Promise<any> {
    const response = await fetch(`${this.amlBaseUrl}/screen-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, chain }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Wallet screening failed");
    }

    return result.data!;
  }

  async analyzeTransactionsDetailed(
    address: string,
    chain: string = "ethereum",
    limit: number = 100,
  ): Promise<any> {
    const response = await fetch(`${this.amlBaseUrl}/analyze-transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, chain, limit }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Transaction analysis failed");
    }

    return result.data!;
  }

  async checkPEPStatus(
    name: string,
    dateOfBirth?: string,
    nationality?: string,
  ): Promise<any> {
    const response = await fetch(`${this.amlBaseUrl}/check-pep`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, dateOfBirth, nationality }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "PEP check failed");
    }

    return result.data!;
  }

  async bulkScreenAddresses(
    addresses: string[],
    chain: string = "ethereum",
  ): Promise<any> {
    const response = await fetch(`${this.amlBaseUrl}/bulk-screen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addresses, chain }),
    });

    const result: APIResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Bulk screening failed");
    }

    return result.data!;
  }
}

export const mcpApiClient = new MCPApiClient();
