import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import { useEthereumWallet } from "@/contexts/EthereumWalletContext";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  BugReport,
  Refresh,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
} from "@mui/icons-material";

export default function WalletDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { isConnected } = useWalletIntegration();
  const { isConnected: isEthereumConnected, account: ethAccount, chainId } = useEthereumWallet();
  const { connected: isSolanaConnected, publicKey, wallet } = useWallet();

  const checkWalletStatus = () => {
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ethereum: {
        detected: typeof window.ethereum !== "undefined",
        isMetaMask: window.ethereum?.isMetaMask,
        chainId: window.ethereum?.chainId,
        networkVersion: window.ethereum?.networkVersion,
        accounts: window.ethereum?._state?.accounts,
        isConnected: window.ethereum?.isConnected?.(),
        isUnlocked: window.ethereum?._metamask?.isUnlocked?.(),
      },
      solana: {
        phantom: !!window.phantom?.solana,
        solflare: !!window.solflare,
        backpack: !!window.backpack,
        detected: !!window.solana,
      },
      context: {
        anyConnected: isConnected,
        ethereumConnected: isEthereumConnected,
        solanaConnected: isSolanaConnected,
        ethAccount,
        chainId,
        solanaPublicKey: publicKey?.toString(),
        walletName: wallet?.adapter?.name,
      },
      localStorage: {
        hasCompletedOnboarding: localStorage.getItem('hasCompletedOnboarding'),
        walletName: localStorage.getItem('walletName'),
      }
    };
    
    setDebugInfo(info);
    console.log("Wallet Debug Info:", info);
  };

  const clearPendingConnections = async () => {
    try {
      // Clear MetaMask pending requests
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }]
        }).catch(() => {
          // Ignore errors, this is just to clear pending state
        });
      }
      
      // Reload the page to clear any stuck states
      window.location.reload();
    } catch (error) {
      console.log("Error clearing pending connections:", error);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <ErrorIcon className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BugReport className="w-5 h-5" />
          <span>Wallet Debugger</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={checkWalletStatus} variant="outline" size="sm">
            <Info className="w-4 h-4 mr-2" />
            Check Status
          </Button>
          <Button onClick={clearPendingConnections} variant="outline" size="sm">
            <Refresh className="w-4 h-4 mr-2" />
            Clear Pending
          </Button>
        </div>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Wallet Detection</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>MetaMask</span>
                {getStatusIcon(!!window.ethereum?.isMetaMask)}
              </div>
              <div className="flex items-center justify-between">
                <span>Phantom</span>
                {getStatusIcon(!!window.phantom?.solana)}
              </div>
              <div className="flex items-center justify-between">
                <span>Solflare</span>
                {getStatusIcon(!!window.solflare)}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Connection Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>Any Connected</span>
                {getStatusIcon(isConnected)}
              </div>
              <div className="flex items-center justify-between">
                <span>Ethereum</span>
                {getStatusIcon(isEthereumConnected)}
              </div>
              <div className="flex items-center justify-between">
                <span>Solana</span>
                {getStatusIcon(isSolanaConnected)}
              </div>
            </div>
          </div>
        </div>

        {debugInfo && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Debug Information</h4>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Common Issues */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
            <Warning className="w-4 h-4 mr-2" />
            Common Issues
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• If connection is pending, try clicking "Clear Pending" and refresh</li>
            <li>• Make sure your wallet is unlocked</li>
            <li>• Check if you have multiple wallets installed causing conflicts</li>
            <li>• Try connecting from the wallet extension directly</li>
            <li>• Disable other wallet extensions temporarily</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
