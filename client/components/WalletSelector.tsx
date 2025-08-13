import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import { useEthereumWallet } from "@/contexts/EthereumWalletContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { logWalletError, getUserFriendlyErrorMessage, shouldShowErrorToUser } from "@/utils/errorUtils";
import {
  CheckCircle,
  Error as ErrorIcon,
  AccountBalanceWallet as Wallet,
  Launch as OpenInNew,
  Warning as AlertTriangle,
  Refresh as RefreshCw,
} from "@mui/icons-material";

interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "solana" | "ethereum";
  installed: boolean;
  downloadUrl?: string;
  features: string[];
  recommended?: boolean;
}

export default function WalletSelector() {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { isConnected: isAnyConnected } = useWalletIntegration();
  const { connect: connectEthereum, isConnected: isEthereumConnected } = useEthereumWallet();
  const { connected: isSolanaConnected, connecting, wallet } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  // Detect installed wallets
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);

  useEffect(() => {
    const detectWallets = () => {
      const options: WalletOption[] = [
        {
          id: "phantom",
          name: "Phantom",
          description: "The trusted crypto wallet for Solana",
          icon: "https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2Fbcfcd0361d994ea9ae259653b4705288?format=webp&width=800",
          type: "solana",
          installed: typeof window !== "undefined" && !!window.phantom?.solana,
          downloadUrl: "https://phantom.app",
          features: ["Easy to use", "Built for Solana", "Mobile & Desktop"],
          recommended: true,
        },
        {
          id: "metamask",
          name: "MetaMask",
          description: "Gateway to blockchain apps",
          icon: "https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2Fed7437292971473ea3d69203802c3382?format=webp&width=800",
          type: "ethereum",
          installed: typeof window !== "undefined" && !!window.ethereum,
          downloadUrl: "https://metamask.io",
          features: ["Most popular", "Ethereum focused", "DeFi ready"],
          recommended: true,
        },
        {
          id: "solflare",
          name: "Solflare",
          description: "Powerful wallet for Solana ecosystem",
          icon: "https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2Fbcfcd0361d994ea9ae259653b4705288?format=webp&width=800",
          type: "solana",
          installed: typeof window !== "undefined" && !!window.solflare,
          downloadUrl: "https://solflare.com",
          features: ["Advanced features", "Hardware wallet support", "Web3 ready"],
        },
        {
          id: "backpack",
          name: "Backpack",
          description: "The native crypto wallet for xNFTs",
          icon: "🎒",
          type: "solana",
          installed: typeof window !== "undefined" && !!window.backpack,
          downloadUrl: "https://backpack.app",
          features: ["xNFT support", "Built for web3", "Native integration"],
        },
      ];

      setWalletOptions(options);
    };

    detectWallets();
    
    // Re-detect when window loads
    if (typeof window !== "undefined") {
      window.addEventListener("load", detectWallets);
      return () => window.removeEventListener("load", detectWallets);
    }
  }, []);

  const handleWalletConnect = async (walletId: string, type: "solana" | "ethereum") => {
    setIsConnecting(true);
    setSelectedWallet(walletId);
    setConnectionProgress(0);
    setError(null);

    try {
      // Simulate connection progress
      const progressInterval = setInterval(() => {
        setConnectionProgress(prev => Math.min(prev + 20, 80));
      }, 200);

      if (type === "ethereum") {
        await connectEthereum();
      } else {
        setWalletModalVisible(true);
      }

      setConnectionProgress(100);
      clearInterval(progressInterval);
      
      // Small delay to show completion
      setTimeout(() => {
        const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
        if (hasCompletedOnboarding) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }, 500);

    } catch (error: any) {
      setConnectionProgress(0);

      const walletError = logWalletError("WalletSelector.handleWalletConnect", error, {
        walletId,
        type,
        userAgent: navigator.userAgent
      });

      // Only show errors that should be visible to users
      if (shouldShowErrorToUser(walletError)) {
        const friendlyMessage = getUserFriendlyErrorMessage(walletError);
        setError(friendlyMessage);
      } else {
        // For user rejections, just clear the connection state without showing error
        console.log("Connection cancelled by user");
      }
    } finally {
      setTimeout(() => {
        setIsConnecting(false);
        setSelectedWallet(null);
      }, 2000);
    }
  };

  const openWalletDownload = (url: string) => {
    window.open(url, "_blank");
  };

  if (isAnyConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Wallet Connected</h3>
          <p className="text-muted-foreground">
            {isSolanaConnected ? "Solana" : "Ethereum"} wallet is connected and ready
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="w-full">
          Continue to Dashboard
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
        <p className="text-muted-foreground">
          Choose your preferred wallet to get started with SentrySol
        </p>
      </div>

      {/* Connection Progress */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span>Connecting to {selectedWallet}...</span>
              <span>{connectionProgress}%</span>
            </div>
            <Progress value={connectionProgress} className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg"
          >
            <ErrorIcon className="w-4 h-4" />
            <span className="text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto h-6 w-6 p-0 hover:bg-destructive/20"
            >
              ×
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Options */}
      <div className="grid gap-4">
        {walletOptions.map((walletOption) => (
          <motion.div
            key={walletOption.id}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card className={`cursor-pointer transition-all duration-200 ${
              walletOption.installed 
                ? "hover:border-primary/50 hover:shadow-md" 
                : "opacity-75"
            } ${selectedWallet === walletOption.id && isConnecting ? "border-primary bg-primary/5" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{walletOption.icon}</div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{walletOption.name}</span>
                        {walletOption.recommended && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                        {walletOption.type === "solana" && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            Solana
                          </Badge>
                        )}
                        {walletOption.type === "ethereum" && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            Ethereum
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{walletOption.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {walletOption.installed ? (
                      <Badge variant="outline" className="text-green-700 bg-green-50">
                        Installed
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openWalletDownload(walletOption.downloadUrl!);
                        }}
                      >
                        <OpenInNew className="w-3 h-3 mr-1" />
                        Install
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {walletOption.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {walletOption.installed ? (
                    <Button
                      onClick={() => handleWalletConnect(walletOption.id, walletOption.type)}
                      disabled={isConnecting}
                      className="w-full"
                      variant={selectedWallet === walletOption.id ? "default" : "outline"}
                    >
                      {selectedWallet === walletOption.id && isConnecting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Connecting...</span>
                        </div>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect {walletOption.name}
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Please install {walletOption.name} to continue
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Help Section */}
      <div className="text-center space-y-2 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          New to crypto wallets?{" "}
          <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate("/help")}>
            Learn how to get started
          </Button>
        </p>
      </div>
    </div>
  );
}
