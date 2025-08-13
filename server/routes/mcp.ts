import { RequestHandler } from "express";
import { mcpManager } from "../services/mcp-services";
import { investigationService } from "../services/investigation-service";

// Initialize MCP services on server start
mcpManager.initializeAllServers().catch(console.error);

export const getMCPStatus: RequestHandler = async (req, res) => {
  try {
    const serverStatus = mcpManager.getServerStatus();
    const availableTools = await mcpManager.getAllAvailableTools();
    
    res.json({
      success: true,
      data: {
        serverStatus,
        availableTools,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Error getting MCP status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get MCP status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const investigateAddressWithAgents: RequestHandler = async (req, res) => {
  try {
    const { address, investigationType = 'full' } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    // Basic address validation
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

    if (!isSolanaAddress && !isEthereumAddress) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format. Please provide a valid Solana or Ethereum address.'
      });
    }

    console.log(`🧠 API: Starting multi-agent investigation for address: ${address}`);

    const result = await investigationService.investigateAddressWithAgents(address, investigationType);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error during multi-agent investigation:', error);
    res.status(500).json({
      success: false,
      error: 'Multi-agent investigation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const performBlockchainTracing: RequestHandler = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    console.log(`🔍 API: Performing blockchain tracing for address: ${address}`);

    const result = await investigationService.performBlockchainTracing(address);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error during blockchain tracing:', error);
    res.status(500).json({
      success: false,
      error: 'Blockchain tracing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const generateFlowVisualization: RequestHandler = async (req, res) => {
  try {
    const { address, transactionData = [], connectedEntities = [] } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    console.log(`📊 API: Generating flow visualization for address: ${address}`);

    const result = await investigationService.generateFlowVisualization(
      address,
      transactionData,
      connectedEntities
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error generating flow visualization:', error);
    res.status(500).json({
      success: false,
      error: 'Flow visualization generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const investigateAddress: RequestHandler = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    // Basic address validation
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    
    if (!isSolanaAddress && !isEthereumAddress) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format. Please provide a valid Solana or Ethereum address.'
      });
    }

    console.log(`🔍 API: Starting investigation for address: ${address}`);
    
    const result = await investigationService.investigateAddress(address);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error during address investigation:', error);
    res.status(500).json({
      success: false,
      error: 'Investigation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const retryMCPConnection: RequestHandler = async (req, res) => {
  try {
    const { serverKey } = req.params;
    
    if (!serverKey || !mcpManager.getServerStatus().hasOwnProperty(serverKey)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid server key'
      });
    }

    await mcpManager.initializeServer(serverKey as any);
    
    res.json({
      success: true,
      message: `Successfully reconnected to ${serverKey}`,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`Error reconnecting to ${req.params.serverKey}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to reconnect',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMCPTools: RequestHandler = async (req, res) => {
  try {
    const { serverKey } = req.params;
    
    if (!serverKey) {
      return res.status(400).json({
        success: false,
        error: 'Server key is required'
      });
    }

    const tools = await mcpManager.getAvailableTools(serverKey as any);
    
    res.json({
      success: true,
      data: {
        serverKey,
        tools,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error(`Error getting tools for ${req.params.serverKey}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tools',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const callMCPTool: RequestHandler = async (req, res) => {
  try {
    const { serverKey, toolName } = req.params;
    const { parameters = {} } = req.body;
    
    if (!serverKey || !toolName) {
      return res.status(400).json({
        success: false,
        error: 'Server key and tool name are required'
      });
    }

    const result = await mcpManager.callTool(serverKey as any, toolName, parameters);
    
    res.json({
      success: true,
      data: {
        serverKey,
        toolName,
        result,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error(`Error calling tool ${req.params.toolName} on ${req.params.serverKey}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to call tool',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
