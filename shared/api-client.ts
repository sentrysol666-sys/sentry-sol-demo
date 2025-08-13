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

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

class MCPApiClient {
  private baseUrl = '/api/mcp';

  async getMCPStatus(): Promise<MCPStatus> {
    const response = await fetch(`${this.baseUrl}/status`);
    const result: APIResponse<MCPStatus> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get MCP status');
    }
    
    return result.data!;
  }

  async investigateAddress(address: string): Promise<InvestigationResult> {
    const response = await fetch(`${this.baseUrl}/investigate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    const result: APIResponse<InvestigationResult> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Investigation failed');
    }
    
    return result.data!;
  }

  async retryConnection(serverKey: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/retry/${serverKey}`, {
      method: 'POST',
    });

    const result: APIResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to retry connection');
    }
  }

  async getTools(serverKey: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/tools/${serverKey}`);
    const result: APIResponse<{ tools: any[] }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get tools');
    }
    
    return result.data!.tools;
  }

  async callTool(serverKey: string, toolName: string, parameters: any = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}/call/${serverKey}/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parameters }),
    });

    const result: APIResponse<{ result: any }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to call tool');
    }
    
    return result.data!.result;
  }
}

export const mcpApiClient = new MCPApiClient();
