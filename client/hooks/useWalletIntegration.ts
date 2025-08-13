import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEthereumWallet } from '@/contexts/EthereumWalletContext';
import { SolanaWalletInfo, EthereumWalletInfo, WalletAnalysis } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';
import { mcpApiClient } from '@shared/api-client';

interface WalletIntegrationState {
  connectedWallets: {
    solana?: SolanaWalletInfo;
    ethereum?: EthereumWalletInfo;
  };
  isConnected: boolean;
  activeWallet: 'solana' | 'ethereum' | null;
  walletAnalyses: Record<string, WalletAnalysis>;
  autoAnalyzeWallet: (address: string, chain: 'solana' | 'ethereum') => Promise<void>;
  getWalletAnalysis: (address: string) => WalletAnalysis | null;
  fillAddressFromConnectedWallet: () => string | null;
}

export const useWalletIntegration = (): WalletIntegrationState => {
  const { connected: solanaConnected, publicKey } = useWallet();
  const { isConnected: ethereumConnected, account, chainId, balance } = useEthereumWallet();
  const { toast } = useToast();
  
  const [connectedWallets, setConnectedWallets] = useState<{
    solana?: SolanaWalletInfo;
    ethereum?: EthereumWalletInfo;
  }>({});
  
  const [activeWallet, setActiveWallet] = useState<'solana' | 'ethereum' | null>(null);
  const [walletAnalyses, setWalletAnalyses] = useState<Record<string, WalletAnalysis>>({});

  // Update connected wallets state
  useEffect(() => {
    const newConnectedWallets: typeof connectedWallets = {};

    if (solanaConnected && publicKey) {
      newConnectedWallets.solana = {
        address: publicKey.toString(),
        publicKey: publicKey.toString(),
        isConnected: true,
      };
      if (!activeWallet) setActiveWallet('solana');
    }

    if (ethereumConnected && account) {
      newConnectedWallets.ethereum = {
        address: account,
        chainId: chainId || 1,
        balance: balance || '0',
        isConnected: true,
      };
      if (!activeWallet) setActiveWallet('ethereum');
    }

    setConnectedWallets(newConnectedWallets);

    // Clear active wallet if no wallets are connected
    if (!solanaConnected && !ethereumConnected) {
      setActiveWallet(null);
    }
  }, [solanaConnected, publicKey, ethereumConnected, account, chainId, balance, activeWallet]);

  const autoAnalyzeWallet = useCallback(async (address: string, chain: 'solana' | 'ethereum') => {
    try {
      toast({
        title: "Analyzing Wallet",
        description: `Starting automated analysis for ${chain} wallet`,
      });

      // Run full investigation using the existing API
      const result = await mcpApiClient.investigateAddressWithAgents(address, 'full');
      
      // Transform the result into our WalletAnalysis format
      const analysis: WalletAnalysis = {
        address,
        chain,
        riskScore: result.riskScore || 0,
        flags: result.findings?.map((f: any) => f.type) || [],
        transactions: {
          total: result.metadata?.transactionCount || 0,
          suspicious: result.findings?.filter((f: any) => f.severity === 'high' || f.severity === 'critical').length || 0,
          volume: result.metadata?.totalValue || '0',
        },
        sanctions: {
          isListed: result.compliance?.sanctionsStatus?.isMatch || false,
          source: result.compliance?.sanctionsStatus?.source,
          details: result.compliance?.sanctionsStatus?.details,
        },
        adverseMedia: {
          mentions: result.compliance?.adverseMedia?.articles?.length || 0,
          risk: result.compliance?.adverseMedia?.riskScore > 70 ? 'high' : 
                result.compliance?.adverseMedia?.riskScore > 40 ? 'medium' : 'low',
          sources: result.compliance?.adverseMedia?.articles?.map((a: any) => a.source) || [],
        },
      };

      setWalletAnalyses(prev => ({
        ...prev,
        [address]: analysis,
      }));

      toast({
        title: "Analysis Complete",
        description: `Wallet analysis completed with risk score: ${analysis.riskScore}`,
      });
    } catch (error) {
      console.error('Auto-analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to automatically analyze wallet",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getWalletAnalysis = useCallback((address: string): WalletAnalysis | null => {
    return walletAnalyses[address] || null;
  }, [walletAnalyses]);

  const fillAddressFromConnectedWallet = useCallback((): string | null => {
    if (activeWallet === 'solana' && connectedWallets.solana) {
      return connectedWallets.solana.address;
    }
    if (activeWallet === 'ethereum' && connectedWallets.ethereum) {
      return connectedWallets.ethereum.address;
    }
    return null;
  }, [activeWallet, connectedWallets]);

  return {
    connectedWallets,
    isConnected: solanaConnected || ethereumConnected,
    activeWallet,
    walletAnalyses,
    autoAnalyzeWallet,
    getWalletAnalysis,
    fillAddressFromConnectedWallet,
  };
};

export default useWalletIntegration;
