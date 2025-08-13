import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import {
  AccountBalanceWallet as Wallet,
  Security as Shield,
  CheckCircle,
  ErrorOutline,
  Bolt as Zap,
  ArrowForward,
  OpenInNew,
} from "@mui/icons-material";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export default function SignIn() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { 
    isConnected, 
    connectedWallets, 
    connectSolana, 
    connectEthereum,
    disconnectAll 
  } = useWalletIntegration();
  const navigate = useNavigate();

  const walletOptions = [
    {
      id: "phantom",
      name: "Phantom",
      description: "The trusted crypto wallet for Solana",
      icon: "🟣",
      gradient: "from-purple-500 to-purple-700",
      type: "solana",
      url: "https://phantom.app",
    },
    {
      id: "solflare",
      name: "Solflare",
      description: "Powerful wallet for Solana ecosystem",
      icon: "🌞",
      gradient: "from-orange-500 to-yellow-600",
      type: "solana",
      url: "https://solflare.com",
    },
    {
      id: "metamask",
      name: "MetaMask",
      description: "Gateway to blockchain apps",
      icon: "🦊",
      gradient: "from-orange-600 to-red-500",
      type: "ethereum",
      url: "https://metamask.io",
    },
  ];

  const handleWalletConnect = async (walletType: string, walletId: string) => {
    setIsConnecting(true);
    setSelectedWallet(walletId);

    try {
      if (walletType === "solana") {
        await connectSolana();
      } else if (walletType === "ethereum") {
        await connectEthereum();
      }
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to dashboard after successful connection
      navigate("/dashboard");
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-32 w-48 h-48 bg-brand-light/10 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-24 h-24 bg-success-green/10 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center space-x-3 mb-6"
              variants={pulseVariants}
              animate="animate"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-brand-light rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-primary to-brand-light bg-clip-text text-transparent">
                Sentrysol
              </h1>
            </motion.div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Connect Your Wallet
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Secure access to your AML compliance dashboard
            </p>
          </motion.div>

          {/* Wallet Options */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {walletOptions.map((wallet) => (
              <motion.div
                key={wallet.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Card className="h-full cursor-pointer group overflow-hidden border-2 hover:border-primary/30 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-r ${wallet.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{wallet.icon}</div>
                      <motion.div
                        animate={selectedWallet === wallet.id && isConnecting ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        {selectedWallet === wallet.id && isConnecting ? (
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <OpenInNew className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </motion.div>
                    </div>
                    
                    <CardTitle className="flex items-center space-x-2">
                      <span>{wallet.name}</span>
                      {wallet.type === "solana" && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          Solana
                        </Badge>
                      )}
                      {wallet.type === "ethereum" && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Ethereum
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <CardDescription className="mb-4">
                      {wallet.description}
                    </CardDescription>
                    
                    <Button
                      onClick={() => handleWalletConnect(wallet.type, wallet.id)}
                      disabled={isConnecting}
                      className="w-full group-hover:shadow-lg transition-all duration-300"
                      variant={selectedWallet === wallet.id ? "default" : "outline"}
                    >
                      {selectedWallet === wallet.id && isConnecting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Zap className="h-4 w-4" />
                          </motion.div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect Wallet
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success-green/10 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-success-green" />
                    </div>
                    <div>
                      <h4 className="font-medium">Secure Authentication</h4>
                      <p className="text-sm text-muted-foreground">Non-custodial wallet connection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Instant Access</h4>
                      <p className="text-sm text-muted-foreground">Quick connection process</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-light/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-brand-light" />
                    </div>
                    <div>
                      <h4 className="font-medium">Multi-Chain Support</h4>
                      <p className="text-sm text-muted-foreground">Solana & Ethereum networks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have a wallet?{" "}
              <Link to="/help" className="text-primary hover:underline">
                Learn how to get started
              </Link>
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/" className="hover:text-foreground transition-colors">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Connection Status Toast */}
      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-success-green text-white p-4 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Wallet connected successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
