import { useState, useEffect, useCallback } from "react";
import {
  mcpApiClient,
  MCPStatus,
  InvestigationResult,
} from "@shared/api-client";

export interface MCPServiceStatus {
  isInitialized: boolean;
  connectedServers: string[];
  failedServers: string[];
  availableTools: Record<string, any[]>;
  isLoading: boolean;
  error: string | null;
}

const MCP_SERVERS = {
  github: {
    name: "GitHub MCP Server",
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
    description: "Ethereum blockchain data and analytics",
    capabilities: [
      "eth_transactions",
      "contract_verification",
      "token_transfers",
      "gas_analytics",
    ],
  },
};

export function useMCPServices() {
  const [status, setStatus] = useState<MCPServiceStatus>({
    isInitialized: false,
    connectedServers: [],
    failedServers: [],
    availableTools: {},
    isLoading: true,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));

      console.log("🚀 Fetching MCP status from server...");

      const mcpStatus: MCPStatus = await mcpApiClient.getMCPStatus();

      const connectedServers = Object.entries(mcpStatus.serverStatus)
        .filter(([_, connected]) => connected)
        .map(([server, _]) => server);

      const failedServers = Object.entries(mcpStatus.serverStatus)
        .filter(([_, connected]) => !connected)
        .map(([server, _]) => server);

      console.log("✅ MCP Status received");
      console.log("Connected servers:", connectedServers);
      console.log("Failed servers:", failedServers);

      setStatus({
        isInitialized: true,
        connectedServers,
        failedServers,
        availableTools: mcpStatus.availableTools,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Failed to fetch MCP status:", error);
      setStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, []);

  const getServerInfo = useCallback(() => {
    return Object.entries(MCP_SERVERS).map(([key, config]) => ({
      key,
      ...config,
      connected: status.connectedServers.includes(key),
      tools: status.availableTools[key] || [],
    }));
  }, [status.connectedServers, status.availableTools]);

  const investigateAddress = useCallback(
    async (address: string) => {
      if (!status.isInitialized) {
        throw new Error("MCP services not initialized");
      }

      return mcpApiClient.investigateAddress(address);
    },
    [status.isInitialized],
  );

  const retryConnection = useCallback(
    async (serverKey: string) => {
      try {
        setStatus((prev) => ({
          ...prev,
          isLoading: true,
          failedServers: prev.failedServers.filter((s) => s !== serverKey),
        }));

        await mcpApiClient.retryConnection(serverKey);

        // Refresh status after retry
        await fetchStatus();
      } catch (error) {
        console.error(`Failed to retry connection to ${serverKey}:`, error);
        setStatus((prev) => ({
          ...prev,
          isLoading: false,
          failedServers: [...new Set([...prev.failedServers, serverKey])],
        }));
      }
    },
    [fetchStatus],
  );

  // Initialize on mount
  useEffect(() => {
    fetchStatus();

    // Set up periodic status refresh
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, [fetchStatus]);

  return {
    status,
    fetchStatus,
    getServerInfo,
    investigateAddress,
    retryConnection,
  };
}

// Custom hook for specific MCP operations
export function useMCPInvestigation() {
  const { status, investigateAddress } = useMCPServices();
  const [investigation, setInvestigation] = useState<{
    isLoading: boolean;
    result: InvestigationResult | null;
    error: string | null;
  }>({
    isLoading: false,
    result: null,
    error: null,
  });

  const runInvestigation = useCallback(
    async (address: string) => {
      if (!status.isInitialized) {
        setInvestigation({
          isLoading: false,
          result: null,
          error: "MCP services not initialized",
        });
        return;
      }

      setInvestigation({ isLoading: true, result: null, error: null });

      try {
        const result = await investigateAddress(address);
        setInvestigation({ isLoading: false, result, error: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Investigation failed";
        setInvestigation({
          isLoading: false,
          result: null,
          error: errorMessage,
        });
        throw error;
      }
    },
    [status.isInitialized, investigateAddress],
  );

  return {
    investigation,
    runInvestigation,
    isReady: status.isInitialized,
  };
}
