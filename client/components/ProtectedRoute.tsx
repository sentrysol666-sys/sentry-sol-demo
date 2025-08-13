import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Security as Shield,
  AccountBalanceWallet as Wallet,
  Info,
  ArrowForward,
} from "@mui/icons-material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWallet?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireWallet = true 
}: ProtectedRouteProps) {
  const { isConnected, isLoading } = useWalletIntegration();
  const location = useLocation();

  // Show loading state while checking wallet connection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Checking wallet connection...</p>
        </motion.div>
      </div>
    );
  }

  // If wallet is required but not connected, show connection prompt
  if (requireWallet && !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-primary/20">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-gradient-to-r from-primary to-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
              
              <CardTitle className="text-xl font-bold">
                Wallet Connection Required
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Info className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground text-left">
                    Connect your wallet to access compliance features and secure your account
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-success-green/10 rounded-lg">
                  <Shield className="h-5 w-5 text-success-green flex-shrink-0" />
                  <p className="text-sm text-success-green/80 text-left">
                    Non-custodial connection - we never store your private keys
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/signin" 
                  state={{ from: location }} 
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full bg-gradient-to-r from-primary to-brand-light hover:from-primary/90 hover:to-brand-light/90">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                      <ArrowForward className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // If connected or wallet not required, render children
  return <>{children}</>;
}
