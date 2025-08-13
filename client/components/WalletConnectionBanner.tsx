import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import { WalletIcon, InfoIcon } from "@/components/ui/material-icons";
import { Link } from "react-router-dom";

export const WalletConnectionBanner: React.FC = () => {
  const { isConnected } = useWalletIntegration();

  if (isConnected) {
    return null; // Don't show banner if wallet is connected
  }

  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 mb-6">
      <InfoIcon className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-yellow-800 dark:text-yellow-200">
            <strong>Wallet Required:</strong> Connect your wallet to access all
            AML investigation features.
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Link to="/wallet-screening">
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-600 text-yellow-800 hover:bg-yellow-100 dark:text-yellow-200 dark:hover:bg-yellow-800/20"
            >
              <WalletIcon className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default WalletConnectionBanner;
