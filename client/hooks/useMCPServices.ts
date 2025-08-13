import { useState, useEffect, useCallback } from 'react';
import { mcpManager, MCP_SERVERS } from '@shared/mcp-services';
import { investigationService } from '@shared/investigation-service';

export interface MCPServiceStatus {
  isInitialized: boolean;
  connectedServers: string[];
  failedServers: string[];
  availableTools: Record<string, any[]>;
  isLoading: boolean;
  error: string | null;
}

export function useMCPServices() {
  const [status, setStatus] = useState<MCPServiceStatus>({
    isInitialized: false,
    connectedServers: [],
    failedServers: [],
    availableTools: {},
    isLoading: true,
    error: null
  });

  const initializeServices = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('🚀 Initializing MCP services...');
      
      // Initialize all MCP servers
      await mcpManager.initializeAllServers();
      
      // Get server status
      const serverStatus = mcpManager.getServerStatus();
      const connectedServers = Object.entries(serverStatus)
        .filter(([_, connected]) => connected)
        .map(([server, _]) => server);
      
      const failedServers = Object.entries(serverStatus)
        .filter(([_, connected]) => !connected)
        .map(([server, _]) => server);

      // Get available tools
      const availableTools = await mcpManager.getAllAvailableTools();

      console.log('✅ MCP Services initialized');
      console.log('Connected servers:', connectedServers);
      console.log('Failed servers:', failedServers);
      console.log('Available tools:', Object.keys(availableTools));

      setStatus({
        isInitialized: true,
        connectedServers,
        failedServers,
        availableTools,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('❌ Failed to initialize MCP services:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  const getServerInfo = useCallback(() => {
    return Object.entries(MCP_SERVERS).map(([key, config]) => ({
      key,
      ...config,
      connected: status.connectedServers.includes(key),
      tools: status.availableTools[key] || []
    }));
  }, [status.connectedServers, status.availableTools]);

  const investigateAddress = useCallback(async (address: string) => {
    if (!status.isInitialized) {
      throw new Error('MCP services not initialized');
    }
    
    return investigationService.investigateAddress(address);
  }, [status.isInitialized]);

  const retryConnection = useCallback(async (serverKey: string) => {
    try {
      setStatus(prev => ({ 
        ...prev, 
        isLoading: true,
        failedServers: prev.failedServers.filter(s => s !== serverKey)
      }));

      await mcpManager.initializeServer(serverKey as keyof typeof MCP_SERVERS);
      
      // Update status
      const serverStatus = mcpManager.getServerStatus();
      const connectedServers = Object.entries(serverStatus)
        .filter(([_, connected]) => connected)
        .map(([server, _]) => server);
      
      const failedServers = Object.entries(serverStatus)
        .filter(([_, connected]) => !connected)
        .map(([server, _]) => server);

      setStatus(prev => ({
        ...prev,
        connectedServers,
        failedServers,
        isLoading: false
      }));

    } catch (error) {
      console.error(`Failed to retry connection to ${serverKey}:`, error);
      setStatus(prev => ({ 
        ...prev, 
        isLoading: false,
        failedServers: [...prev.failedServers, serverKey]
      }));
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeServices();
    
    // Cleanup on unmount
    return () => {
      mcpManager.disconnect().catch(console.error);
    };
  }, [initializeServices]);

  return {
    status,
    initializeServices,
    getServerInfo,
    investigateAddress,
    retryConnection,
    mcpManager
  };
}

// Custom hook for specific MCP operations
export function useMCPInvestigation() {
  const { status, investigateAddress } = useMCPServices();
  const [investigation, setInvestigation] = useState<{
    isLoading: boolean;
    result: any | null;
    error: string | null;
  }>({
    isLoading: false,
    result: null,
    error: null
  });

  const runInvestigation = useCallback(async (address: string) => {
    if (!status.isInitialized) {
      setInvestigation({
        isLoading: false,
        result: null,
        error: 'MCP services not initialized'
      });
      return;
    }

    setInvestigation({ isLoading: true, result: null, error: null });
    
    try {
      const result = await investigateAddress(address);
      setInvestigation({ isLoading: false, result, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Investigation failed';
      setInvestigation({ isLoading: false, result: null, error: errorMessage });
      throw error;
    }
  }, [status.isInitialized, investigateAddress]);

  return {
    investigation,
    runInvestigation,
    isReady: status.isInitialized
  };
}
