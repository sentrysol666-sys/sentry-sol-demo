import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getMCPStatus,
  investigateAddress,
  investigateAddressWithAgents,
  performBlockchainTracing,
  generateFlowVisualization,
  retryMCPConnection,
  getMCPTools,
  callMCPTool
} from "./routes/mcp";
import walletAnalysisRoutes from "./routes/wallet-analysis";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // MCP API endpoints
  app.get("/api/mcp/status", getMCPStatus);
  app.post("/api/mcp/investigate", investigateAddress);
  app.post("/api/mcp/investigate-agents", investigateAddressWithAgents);
  app.post("/api/mcp/trace", performBlockchainTracing);
  app.post("/api/mcp/visualize", generateFlowVisualization);
  app.post("/api/mcp/retry/:serverKey", retryMCPConnection);
  app.get("/api/mcp/tools/:serverKey", getMCPTools);
  app.post("/api/mcp/call/:serverKey/:toolName", callMCPTool);

  return app;
}
