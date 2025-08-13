import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SolanaWalletConnector: React.FC = () => {
  const { connected, publicKey, wallet, connecting, disconnecting } =
    useWallet();
  const { toast } = useToast();

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast({
        title: "Address Copied",
        description: "Solana wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toString()}`,
        "_blank",
      );
    }
  };

  if (!connected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            Connect Solana Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your Solana wallet to start analyzing transactions and
              checking compliance.
            </p>
            <WalletMultiButton className="w-full" />
            {connecting && (
              <div className="text-center text-sm text-muted-foreground">
                Connecting...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          Solana Wallet
          <Badge variant="outline" className="ml-auto">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallet && (
            <div className="flex items-center gap-2">
              <img
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                className="w-6 h-6"
              />
              <span className="font-medium">{wallet.adapter.name}</span>
            </div>
          )}

          {publicKey && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wallet Address:</p>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="text-xs flex-1 truncate">
                  {publicKey.toString()}
                </code>
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

          <div className="flex gap-2">
            <WalletDisconnectButton
              className="flex-1"
              disabled={disconnecting}
            />
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

export default SolanaWalletConnector;
