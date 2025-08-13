import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWalletIntegration } from '@/hooks/useWalletIntegration';
import WalletConnector from '@/components/WalletConnector';
import { WalletIcon, SecurityIcon, InfoIcon } from '@/components/ui/material-icons';

interface WalletGuardProps {
  children: React.ReactNode;
  requireConnection?: boolean;
  showConnectPrompt?: boolean;
  title?: string;
  description?: string;
}

export const WalletGuard: React.FC<WalletGuardProps> = ({
  children,
  requireConnection = true,
  showConnectPrompt = true,
  title = "Wallet Connection Required",
  description = "Please connect your wallet to access AML investigation features"
}) => {
  const { isConnected, connectedWallets } = useWalletIntegration();

  // If wallet connection is not required, render children
  if (!requireConnection) {
    return <>{children}</>;
  }

  // If wallet is connected, render children
  if (isConnected) {
    return <>{children}</>;
  }

  // Show wallet connection prompt
  if (showConnectPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-light/5 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-poppins text-foreground flex items-center justify-center gap-3">
              <WalletIcon className="h-8 w-8 text-brand-light" />
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Security Notice */}
          <Alert className="border-brand-light bg-brand-light/5">
            <SecurityIcon className="h-4 w-4 text-brand-light" />
            <AlertDescription className="text-foreground">
              <strong>Secure Connection:</strong> Your wallet connection is encrypted and secure. 
              We never store your private keys or have access to your funds.
            </AlertDescription>
          </Alert>

          {/* Main Connection Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <WalletConnector />
            </div>
          </div>

          {/* Benefits Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-brand-light" />
                Why Connect Your Wallet?
              </CardTitle>
              <CardDescription>
                Connecting your wallet unlocks enhanced AML investigation features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Enhanced Analysis</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time balance monitoring</li>
                    <li>• Automatic address population</li>
                    <li>• Transaction history analysis</li>
                    <li>• Connected wallet risk scoring</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Security Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Live sanctions screening</li>
                    <li>• Pattern detection alerts</li>
                    <li>• Compliance monitoring</li>
                    <li>• Fraud prevention tools</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supported Networks */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Networks & Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-medium">Solana</div>
                  <div className="text-xs text-muted-foreground">Phantom, Solflare</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-medium">Ethereum</div>
                  <div className="text-xs text-muted-foreground">MetaMask</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-medium">Polygon</div>
                  <div className="text-xs text-muted-foreground">Layer 2 Support</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm font-medium">Arbitrum</div>
                  <div className="text-xs text-muted-foreground">Fast & Cheap</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Don't render anything if connection required but not showing prompt
  return null;
};

export default WalletGuard;
