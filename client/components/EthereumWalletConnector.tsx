import React from "react";
import { useEthereumWallet } from "@/contexts/EthereumWalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentCopy as Copy, OpenInNew as ExternalLink, ErrorOutline as AlertCircle } from "@mui/icons-material";
import { useToast } from "@/hooks/use-toast";
import { CHAIN_CONFIGS } from "@/types/wallet";

const SUPPORTED_CHAINS = [
  { id: 1, name: "Ethereum", icon: "🟦" },
  { id: 137, name: "Polygon", icon: "🟣" },
  { id: 56, name: "BNB Chain", icon: "🟡" },
  { id: 42161, name: "Arbitrum", icon: "🔵" },
];

export const EthereumWalletConnector: React.FC = () => {
  const {
    isConnected,
    account,
    chainId,
    balance,
    connect,
    disconnect,
    switchNetwork,
  } = useEthereumWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error: any) {
      let errorMessage = "Failed to connect wallet";

      if (error && typeof error === 'object') {
        if (error.code === 4001) {
          errorMessage = "Connection cancelled by user";
        } else if (error.code === -32002) {
          errorMessage = "Connection request already pending";
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.reason) {
          errorMessage = error.reason;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error("Wallet connection error:", error);

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleNetworkSwitch = async (networkId: string) => {
    try {
      await switchNetwork(parseInt(networkId));
      toast({
        title: "Network Switched",
        description: `Switched to ${SUPPORTED_CHAINS.find((c) => c.id.toString() === networkId)?.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Network Switch Failed",
        description: error.message || "Failed to switch network",
        variant: "destructive",
      });
    }
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Address Copied",
        description: "Ethereum wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (account && chainId) {
      const chain = Object.values(CHAIN_CONFIGS).find(
        (c) => c.chainId === chainId,
      );
      if (chain) {
        window.open(`${chain.blockExplorer}/address/${account}`, "_blank");
      }
    }
  };

  const getCurrentChain = () => {
    return SUPPORTED_CHAINS.find((c) => c.id === chainId);
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            Connect Ethereum Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your MetaMask or other Ethereum wallet to analyze
              transactions across multiple chains.
            </p>

            {typeof window !== "undefined" && !window.ethereum && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  MetaMask not detected. Please install MetaMask to continue.
                </span>
              </div>
            )}

            <Button
              onClick={handleConnect}
              className="w-full"
              disabled={typeof window !== "undefined" && !window.ethereum}
            >
              Connect MetaMask
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentChain = getCurrentChain();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          Ethereum Wallet
          <Badge variant="outline" className="ml-auto">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iI0Y2ODUxQiIvPgo8cGF0aCBkPSJNMTYuMjYyIDIuOTM2OUwxNS44MzE4IDQuMjE2NjRWMjEuNjY4M0wxNi4yNjIgMjIuMDkxOEwyMy45MzA2IDE3LjM3MzVMMTYuMjYyIDIuOTM2OVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNi4yNjI0IDIuOTM2OUw4LjU5Mzc1IDE3LjM3MzVMMTYuMjYyNCAyMi4wOTE4VjEyLjcxNzdWMi45MzY5WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+CjxwYXRoIGQ9Ik0xNi4yNjI0IDIzLjcyNThMMTYuMDQ1OCAyMy45ODI3VjI5LjA0MkwxNi4yNjI0IDI5LjYzMjZMMjMuOTM0NSAxOS4wMDVMMTYuMjYyNCAyMy43MjU4WiIgZmlsbD0id2hpdGUiLz4KPHA="
              alt="MetaMask"
              className="w-6 h-6"
            />
            <span className="font-medium">MetaMask</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Network:</p>
            <Select
              value={chainId?.toString()}
              onValueChange={handleNetworkSwitch}
            >
              <SelectTrigger>
                <SelectValue>
                  {currentChain ? (
                    <div className="flex items-center gap-2">
                      <span>{currentChain.icon}</span>
                      <span>{currentChain.name}</span>
                    </div>
                  ) : (
                    `Chain ID: ${chainId}`
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{chain.icon}</span>
                      <span>{chain.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {account && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wallet Address:</p>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="text-xs flex-1 truncate">{account}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openExplorer}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {balance && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Balance:</p>
              <div className="p-2 bg-muted rounded-md">
                <span className="text-sm font-mono">
                  {parseFloat(balance).toFixed(4)}{" "}
                  {currentChain
                    ? CHAIN_CONFIGS[
                        Object.keys(CHAIN_CONFIGS).find(
                          (k) => CHAIN_CONFIGS[k].chainId === chainId,
                        ) || "ethereum"
                      ]?.nativeCurrency.symbol
                    : "ETH"}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={disconnect} className="flex-1">
              Disconnect
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => (window.location.href = "/wallet-screening")}
            >
              Analyze Wallet
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EthereumWalletConnector;
