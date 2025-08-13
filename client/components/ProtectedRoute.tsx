import React from 'react';
import { useWalletIntegration } from '@/hooks/useWalletIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WalletIcon, SecurityIcon, LockIcon } from '@/components/ui/material-icons';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWallet?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireWallet = true,
  fallbackPath = '/wallet-screening'
}) => {
  const { isConnected } = useWalletIntegration();

  if (!requireWallet || isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-light/5 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="border-2 border-dashed border-warning-amber/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-warning-amber/10 rounded-full flex items-center justify-center mb-4">
              <LockIcon className="h-8 w-8 text-warning-amber" />
            </div>
            <CardTitle className="text-xl">Wallet Connection Required</CardTitle>
            <CardDescription>
              This feature requires a connected wallet to access advanced AML capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <SecurityIcon className="h-4 w-4 text-brand-light" />
                <span className="text-sm font-medium">Security Features</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Real-time transaction monitoring</li>
                <li>• Enhanced risk assessment</li>
                <li>• Automated compliance checking</li>
                <li>• Pattern detection alerts</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-xs">Solana</Badge>
              <Badge variant="outline" className="text-xs">Ethereum</Badge>
              <Badge variant="outline" className="text-xs">Polygon</Badge>
              <Badge variant="outline" className="text-xs">Arbitrum</Badge>
            </div>

            <div className="space-y-2">
              <Link to={fallbackPath} className="w-full">
                <Button className="w-full bg-brand-light hover:bg-brand-light/90">
                  <WalletIcon className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </Link>
              
              <Link to="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProtectedRoute;
