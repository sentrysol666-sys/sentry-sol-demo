import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, XCircle, RefreshCw, Activity, 
  Server, Database, Code, Search 
} from 'lucide-react';
import { useMCPServices } from '@/hooks/useMCPServices';

const getServerIcon = (serverKey: string) => {
  switch (serverKey) {
    case 'github': return Code;
    case 'helius': return Database;
    case 'sherlock': return Search;
    case 'etherscan': return Activity;
    default: return Server;
  }
};

const getServerDescription = (serverKey: string) => {
  switch (serverKey) {
    case 'github': return 'Code analysis & threat intelligence';
    case 'helius': return 'Solana blockchain data & transactions';
    case 'sherlock': return 'Advanced blockchain forensics';
    case 'etherscan': return 'Ethereum blockchain analytics';
    default: return 'MCP Server';
  }
};

export default function MCPServicesStatus() {
  const { status, getServerInfo, retryConnection } = useMCPServices();

  const serverInfo = getServerInfo();

  if (status.isLoading && !status.isInitialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-brand-light" />
            <span>Initializing MCP Services...</span>
          </CardTitle>
          <CardDescription>
            Connecting to blockchain intelligence servers
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-brand-light" />
            <span>MCP Intelligence Network</span>
          </div>
          <Badge 
            variant={status.connectedServers.length > 0 ? 'default' : 'destructive'}
            className={status.connectedServers.length > 0 ? 'bg-success-green/10 text-success-green border-success-green/20' : ''}
          >
            {status.connectedServers.length}/{Object.keys(serverInfo).length} Connected
          </Badge>
        </CardTitle>
        <CardDescription>
          Multi-agent protocol servers for comprehensive blockchain analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {status.error && (
            <div className="p-3 bg-risk-red/10 border border-risk-red/20 rounded-lg">
              <p className="text-sm text-risk-red">{status.error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serverInfo.map((server) => {
              const Icon = getServerIcon(server.key);
              const isConnected = server.connected;
              
              return (
                <div 
                  key={server.key}
                  className={`p-4 rounded-lg border transition-colors ${
                    isConnected 
                      ? 'border-success-green/20 bg-success-green/5' 
                      : 'border-risk-red/20 bg-risk-red/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${isConnected ? 'text-success-green' : 'text-risk-red'}`} />
                      <span className="font-medium text-sm capitalize">{server.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <CheckCircle className="h-4 w-4 text-success-green" />
                      ) : (
                        <XCircle className="h-4 w-4 text-risk-red" />
                      )}
                      {!isConnected && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryConnection(server.key)}
                          disabled={status.isLoading}
                          className="h-6 px-2 text-xs"
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${status.isLoading ? 'animate-spin' : ''}`} />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {getServerDescription(server.key)}
                  </p>

                  {isConnected && server.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {server.tools.slice(0, 3).map((tool: any, index: number) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-brand-light/10 text-brand-light border-brand-light/20"
                        >
                          {tool.name}
                        </Badge>
                      ))}
                      {server.tools.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{server.tools.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {isConnected && (
                    <div className="mt-2 text-xs text-success-green">
                      ✓ {server.capabilities?.length || 0} capabilities available
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {status.connectedServers.length > 0 && (
            <div className="mt-4 p-3 bg-brand-light/5 border border-brand-light/20 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 text-brand-light" />
                <span className="font-medium">Network Status:</span>
                <span className="text-success-green">Operational</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All connected services are ready for blockchain intelligence operations
              </p>
            </div>
          )}

          {status.failedServers.length > 0 && (
            <div className="mt-4 p-3 bg-warning-amber/5 border border-warning-amber/20 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <XCircle className="h-4 w-4 text-warning-amber" />
                <span className="font-medium">Degraded Performance:</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {status.failedServers.length} service(s) unavailable: {status.failedServers.join(', ')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
