import { Router } from "express";
import { walletAnalysisService } from "../services/wallet-analysis-service.ts";
import { supervisorAgent } from "../agents/supervisor-agent.ts";

const router = Router();

// Analyze connected wallet
router.post("/analyze-connected", async (req, res) => {
  try {
    const { address, chain, walletType, connectionData } = req.body;

    if (!address || !chain || !walletType) {
      return res.status(400).json({
        error: "Missing required fields: address, chain, walletType",
      });
    }

    console.log(`API: Analyzing connected wallet ${address} (${chain})`);

    const result = await walletAnalysisService.analyzeConnectedWallet(
      address,
      chain,
      walletType,
      connectionData || {},
    );

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Connected wallet analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze connected wallet",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Analyze disconnected wallet (address only)
router.post("/analyze-address", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        error: "Missing required field: address",
      });
    }

    console.log(`API: Analyzing disconnected wallet ${address}`);

    const result =
      await walletAnalysisService.analyzeDisconnectedWallet(address);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Disconnected wallet analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze wallet address",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get wallet connection status
router.get("/connection-status/:address", async (req, res) => {
  try {
    const { address } = req.params;

    const isConnected = walletAnalysisService.isWalletConnected(address);
    const metadata = walletAnalysisService.getConnectedWallet(address);

    res.json({
      success: true,
      data: {
        address,
        isConnected,
        metadata: isConnected ? metadata : null,
      },
    });
  } catch (error) {
    console.error("Connection status error:", error);
    res.status(500).json({
      error: "Failed to get connection status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Live risk monitoring for connected wallets
router.post("/live-monitoring", async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({
        error: "Missing or invalid addresses array",
      });
    }

    console.log(
      `API: Starting live monitoring for ${addresses.length} addresses`,
    );

    const results = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          if (walletAnalysisService.isWalletConnected(address)) {
            // For connected wallets, get enhanced monitoring
            const metadata = walletAnalysisService.getConnectedWallet(address);
            return {
              address,
              isConnected: true,
              walletType: metadata?.walletType,
              status: "monitoring",
              lastUpdate: new Date().toISOString(),
            };
          } else {
            // For disconnected wallets, basic monitoring
            return {
              address,
              isConnected: false,
              status: "basic_monitoring",
              lastUpdate: new Date().toISOString(),
            };
          }
        } catch (error) {
          return {
            address,
            error: error instanceof Error ? error.message : "Unknown error",
            status: "error",
          };
        }
      }),
    );

    res.json({
      success: true,
      data: {
        monitoringResults: results,
        totalAddresses: addresses.length,
        connectedWallets: results.filter((r) => r.isConnected).length,
      },
    });
  } catch (error) {
    console.error("Live monitoring error:", error);
    res.status(500).json({
      error: "Failed to start live monitoring",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Enhanced investigation for connected wallets
router.post("/enhanced-investigation", async (req, res) => {
  try {
    const { address, investigationType = "full" } = req.body;

    if (!address) {
      return res.status(400).json({
        error: "Missing required field: address",
      });
    }

    console.log(`API: Enhanced investigation for ${address}`);

    // Check if wallet is connected for enhanced analysis
    const isConnected = walletAnalysisService.isWalletConnected(address);

    let result;
    if (isConnected) {
      // Use wallet-specific analysis for connected wallets
      const metadata = walletAnalysisService.getConnectedWallet(address);
      const chain = address.startsWith("0x") ? "ethereum" : "solana";

      result = await walletAnalysisService.analyzeConnectedWallet(
        address,
        chain,
        metadata?.walletType || "unknown",
        { balance: metadata?.balance || "0" },
      );
    } else {
      // Use standard investigation for disconnected wallets
      result = await supervisorAgent.investigate(address, investigationType);
    }

    res.json({
      success: true,
      data: {
        ...result,
        isConnectedWallet: isConnected,
        enhancedAnalysis: isConnected,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Enhanced investigation error:", error);
    res.status(500).json({
      error: "Failed to conduct enhanced investigation",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get wallet risk factors breakdown
router.get("/risk-factors/:address", async (req, res) => {
  try {
    const { address } = req.params;

    // This would normally fetch cached analysis results
    // For now, we'll return a simple response
    res.json({
      success: true,
      data: {
        address,
        riskFactors: [
          {
            category: "transaction_patterns",
            score: 25,
            weight: 0.3,
            description: "Low risk transaction patterns detected",
          },
          {
            category: "connected_entities",
            score: 15,
            weight: 0.25,
            description: "Connected entities show low risk",
          },
        ],
        overallScore: 20,
        lastAnalyzed: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Risk factors error:", error);
    res.status(500).json({
      error: "Failed to get risk factors",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
