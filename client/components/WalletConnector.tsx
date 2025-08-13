import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SolanaWalletConnector } from './SolanaWalletConnector';
import { EthereumWalletConnector } from './EthereumWalletConnector';
import { Badge } from '@/components/ui/badge';

interface WalletConnectorProps {
  className?: string;
  defaultTab?: 'solana' | 'ethereum';
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ 
  className,
  defaultTab = 'solana'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'solana' | 'ethereum')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solana" className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            Solana
          </TabsTrigger>
          <TabsTrigger value="ethereum" className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            Ethereum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solana" className="mt-6">
          <SolanaWalletConnector />
        </TabsContent>

        <TabsContent value="ethereum" className="mt-6">
          <EthereumWalletConnector />
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Supported Wallets & Networks</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Phantom</Badge>
          <Badge variant="secondary">Solflare</Badge>
          <Badge variant="secondary">Backpack</Badge>
          <Badge variant="secondary">MetaMask</Badge>
          <Badge variant="secondary">Ledger</Badge>
          <Badge variant="secondary">Glow</Badge>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">Solana</Badge>
          <Badge variant="outline">Ethereum</Badge>
          <Badge variant="outline">Polygon</Badge>
          <Badge variant="outline">BNB Chain</Badge>
          <Badge variant="outline">Arbitrum</Badge>
        </div>
      </div>
    </div>
  );
};

export default WalletConnector;
