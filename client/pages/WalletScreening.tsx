import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMCPInvestigation } from '@/hooks/useMCPServices';
import { mcpApiClient } from '@shared/api-client';
import FlowVisualization from '@/components/FlowVisualization';
import { 
  Search, Shield, AlertTriangle, CheckCircle, XCircle, 
  Eye, Clock, TrendingUp, Activity, Network, FileText,
  RefreshCw, Zap, Info
} from 'lucide-react';

export default function WalletScreening() {
  const [address, setAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [investigationType, setInvestigationType] = useState<'full' | 'sanctions' | 'tracing' | 'media' | 'visualization'>('full');
  const [tracingData, setTracingData] = useState<any>(null);
  const [visualizationData, setVisualizationData] = useState<any>(null);
  const [isTracingLoading, setIsTracingLoading] = useState(false);
  const [isVisualizationLoading, setIsVisualizationLoading] = useState(false);
  const { investigation, runInvestigation, isReady } = useMCPInvestigation();

  const validateAddress = (addr: string) => {
    // Basic validation for Solana/Ethereum addresses
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
    const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(addr);
    return isSolanaAddress || isEthereumAddress;
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setIsValidAddress(validateAddress(value));
  };

  const handleScreening = async () => {
    if (!isValidAddress || !isReady) return;

    try {
      if (investigationType === 'full') {
        // Use multi-agent investigation
        const result = await mcpApiClient.investigateAddressWithAgents(address, 'full');
        console.log('Multi-agent investigation result:', result);
      } else {
        // Use specific investigation type
        await runInvestigation(address);
      }
    } catch (error) {
      console.error('Investigation failed:', error);
    }
  };

  const handleBlockchainTracing = async () => {
    if (!isValidAddress) return;

    setIsTracingLoading(true);
    try {
      const result = await mcpApiClient.performBlockchainTracing(address);
      setTracingData(result);
      console.log('Blockchain tracing result:', result);
    } catch (error) {
      console.error('Blockchain tracing failed:', error);
    } finally {
      setIsTracingLoading(false);
    }
  };

  const handleGenerateVisualization = async () => {
    if (!isValidAddress) return;

    setIsVisualizationLoading(true);
    try {
      const transactionData = tracingData?.transactionHistory || [];
      const connectedEntities = tracingData?.connectedEntities || [];

      const result = await mcpApiClient.generateFlowVisualization(
        address,
        transactionData,
        connectedEntities
      );
      setVisualizationData(result);
      console.log('Flow visualization result:', result);
    } catch (error) {
      console.error('Flow visualization failed:', error);
    } finally {
      setIsVisualizationLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-risk-red';
    if (score >= 40) return 'text-warning-amber';
    return 'text-success-green';
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 70) return 'bg-risk-red/10 text-risk-red border-risk-red/20';
    if (score >= 40) return 'bg-warning-amber/10 text-warning-amber border-warning-amber/20';
    return 'bg-success-green/10 text-success-green border-success-green/20';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-risk-red" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-warning-amber" />;
      case 'medium': return <Info className="h-4 w-4 text-brand-light" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-success-green" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-light/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-foreground">Wallet Screening</h1>
            <p className="text-muted-foreground">AI-powered wallet risk assessment and compliance screening</p>
          </div>
          {!isReady && (
            <Badge variant="outline" className="border-warning-amber text-warning-amber">
              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
              Initializing Services
            </Badge>
          )}
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-brand-light" />
              <span>Address Investigation</span>
            </CardTitle>
            <CardDescription>
              Enter a Solana or Ethereum address for comprehensive AML/compliance analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter wallet address (e.g., 0x742d35Cc6aF1cD6c... or DRiP2Pn2K6...)"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className={`${
                      address && !isValidAddress
                        ? 'border-risk-red focus:border-risk-red'
                        : address && isValidAddress
                          ? 'border-success-green focus:border-success-green'
                          : ''
                    }`}
                  />
                  {address && !isValidAddress && (
                    <p className="text-sm text-risk-red mt-1">Please enter a valid Solana or Ethereum address</p>
                  )}
                </div>
              </div>

              {/* Multi-Agent Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Button
                  onClick={handleScreening}
                  disabled={!isValidAddress || investigation.isLoading || !isReady}
                  className="bg-brand-light hover:bg-brand-light/90"
                >
                  {investigation.isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Full Investigation
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleBlockchainTracing}
                  disabled={!isValidAddress || isTracingLoading}
                  variant="outline"
                  className="border-brand-light text-brand-light hover:bg-brand-light/10"
                >
                  {isTracingLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Tracing...
                    </>
                  ) : (
                    <>
                      <Network className="mr-2 h-4 w-4" />
                      Blockchain Trace
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleGenerateVisualization}
                  disabled={!isValidAddress || isVisualizationLoading}
                  variant="outline"
                  className="border-success-green text-success-green hover:bg-success-green/10"
                >
                  {isVisualizationLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Visualize Flow
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  disabled={!isValidAddress}
                  className="border-warning-amber text-warning-amber hover:bg-warning-amber/10"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Media Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investigation Error */}
        {investigation.error && (
          <Alert className="border-risk-red bg-risk-red/5">
            <XCircle className="h-4 w-4 text-risk-red" />
            <AlertDescription className="text-risk-red">
              {investigation.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Investigation Results */}
        {investigation.result && (
          <div className="space-y-6">
            {/* Risk Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-brand-light" />
                    <span>Risk Assessment</span>
                  </div>
                  <Badge className={getRiskBadgeColor(investigation.result.riskScore)}>
                    Risk Score: {investigation.result.riskScore}/100
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Address: {investigation.result.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Risk Level</span>
                      <span className={getRiskColor(investigation.result.riskScore)}>
                        {investigation.result.riskScore >= 70 ? 'High Risk' : 
                         investigation.result.riskScore >= 40 ? 'Medium Risk' : 'Low Risk'}
                      </span>
                    </div>
                    <Progress 
                      value={investigation.result.riskScore} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-card border rounded-lg">
                      <div className="text-lg font-bold text-brand-light">
                        {investigation.result.findings.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Findings</div>
                    </div>
                    <div className="text-center p-3 bg-card border rounded-lg">
                      <div className="text-lg font-bold text-warning-amber">
                        {investigation.result.findings.filter(f => f.severity === 'high' || f.severity === 'critical').length}
                      </div>
                      <div className="text-sm text-muted-foreground">High Priority</div>
                    </div>
                    <div className="text-center p-3 bg-card border rounded-lg">
                      <div className="text-lg font-bold text-success-green">
                        {investigation.result.compliance.sanctionsStatus.isMatch ? 'MATCH' : 'CLEAR'}
                      </div>
                      <div className="text-sm text-muted-foreground">Sanctions Status</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="findings" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="tracing">Tracing</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="findings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investigation Findings</CardTitle>
                    <CardDescription>
                      Detailed analysis results from multiple intelligence sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {investigation.result.findings.length > 0 ? (
                      <div className="space-y-4">
                        {investigation.result.findings.map((finding: any, index: number) => (
                          <div key={finding.id || index} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getSeverityIcon(finding.severity)}
                                <span className="font-medium">{finding.description}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {finding.confidence}% confidence
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {finding.source}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Type: {finding.type.replace(/_/g, ' ')} • 
                              Severity: {finding.severity} • 
                              Time: {new Date(finding.timestamp).toLocaleString()}
                            </div>
                            {finding.evidence && finding.evidence.length > 0 && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-sm text-brand-light">
                                  View Evidence
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                  {JSON.stringify(finding.evidence, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="mx-auto h-12 w-12 text-success-green mb-4" />
                        <h3 className="text-lg font-medium">No Issues Found</h3>
                        <p className="text-muted-foreground">This address passed all screening checks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Status</CardTitle>
                    <CardDescription>Regulatory and sanctions screening results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Sanctions Screening</h4>
                          <div className="flex items-center space-x-2 mb-1">
                            {investigation.result.compliance.sanctionsStatus.isMatch ? (
                              <XCircle className="h-4 w-4 text-risk-red" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-success-green" />
                            )}
                            <span className={investigation.result.compliance.sanctionsStatus.isMatch ? 'text-risk-red' : 'text-success-green'}>
                              {investigation.result.compliance.sanctionsStatus.isMatch ? 'SANCTIONS MATCH' : 'CLEAR'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {investigation.result.compliance.sanctionsStatus.confidence}%
                          </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">PEP Screening</h4>
                          <div className="flex items-center space-x-2 mb-1">
                            {investigation.result.compliance.pepStatus.isMatch ? (
                              <AlertTriangle className="h-4 w-4 text-warning-amber" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-success-green" />
                            )}
                            <span className={investigation.result.compliance.pepStatus.isMatch ? 'text-warning-amber' : 'text-success-green'}>
                              {investigation.result.compliance.pepStatus.isMatch ? 'PEP MATCH' : 'CLEAR'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {investigation.result.compliance.pepStatus.confidence}%
                          </p>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Adverse Media</h4>
                        <div className="flex items-center space-x-2 mb-1">
                          <Activity className="h-4 w-4 text-brand-light" />
                          <span>
                            {investigation.result.compliance.adverseMedia.articles.length} articles found
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Sentiment: {investigation.result.compliance.adverseMedia.sentiment} • 
                          Risk Score: {investigation.result.compliance.adverseMedia.riskScore}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Tracing Results</CardTitle>
                    <CardDescription>
                      Detailed transaction flow analysis and pattern detection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tracingData ? (
                      <div className="space-y-6">
                        {/* Flow Patterns */}
                        <div>
                          <h4 className="font-medium mb-3">Flow Patterns Detected</h4>
                          {tracingData.flowPatterns && tracingData.flowPatterns.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {tracingData.flowPatterns.map((pattern: any, index: number) => (
                                <div key={index} className="p-3 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline">{pattern.type}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {Math.round(pattern.confidence * 100)}% confidence
                                    </span>
                                  </div>
                                  <p className="text-sm">{pattern.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Amount: ${pattern.amount?.toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No suspicious patterns detected</p>
                          )}
                        </div>

                        {/* Risk Indicators */}
                        <div>
                          <h4 className="font-medium mb-3">Risk Indicators</h4>
                          {tracingData.riskIndicators && tracingData.riskIndicators.length > 0 ? (
                            <div className="space-y-2">
                              {tracingData.riskIndicators.map((indicator: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    {getSeverityIcon(indicator.severity)}
                                    <span>{indicator.description}</span>
                                  </div>
                                  <Badge variant="outline">{indicator.type}</Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No risk indicators found</p>
                          )}
                        </div>

                        {/* Temporal Analysis */}
                        {tracingData.temporalAnalysis && (
                          <div>
                            <h4 className="font-medium mb-3">Temporal Analysis</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-3 bg-muted rounded-lg text-center">
                                <div className="text-lg font-bold text-brand-light">
                                  {tracingData.temporalAnalysis.velocityMetrics?.avgTxPerDay?.toFixed(1) || 'N/A'}
                                </div>
                                <div className="text-sm text-muted-foreground">Avg Tx/Day</div>
                              </div>
                              <div className="p-3 bg-muted rounded-lg text-center">
                                <div className="text-lg font-bold text-warning-amber">
                                  {tracingData.temporalAnalysis.velocityMetrics?.maxTxPerDay || 'N/A'}
                                </div>
                                <div className="text-sm text-muted-foreground">Max Tx/Day</div>
                              </div>
                              <div className="p-3 bg-muted rounded-lg text-center">
                                <div className="text-lg font-bold text-success-green">
                                  {tracingData.temporalAnalysis.velocityMetrics?.velocityScore?.toFixed(0) || 'N/A'}
                                </div>
                                <div className="text-sm text-muted-foreground">Velocity Score</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Network className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No Tracing Data</h3>
                        <p className="text-muted-foreground mb-4">
                          Run blockchain tracing to see detailed transaction analysis
                        </p>
                        <Button
                          onClick={handleBlockchainTracing}
                          disabled={!isValidAddress || isTracingLoading}
                          className="bg-brand-light hover:bg-brand-light/90"
                        >
                          {isTracingLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Tracing...
                            </>
                          ) : (
                            <>
                              <Network className="mr-2 h-4 w-4" />
                              Start Tracing
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visualization" className="space-y-4">
                {visualizationData ? (
                  <FlowVisualization data={visualizationData} width={800} height={600} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Fund Flow Visualization</CardTitle>
                      <CardDescription>Interactive network graph of transaction flows</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No Visualization Data</h3>
                        <p className="text-muted-foreground mb-4">
                          Generate flow visualization to see interactive network graph
                        </p>
                        <Button
                          onClick={handleGenerateVisualization}
                          disabled={!isValidAddress || isVisualizationLoading}
                          className="bg-success-green hover:bg-success-green/90"
                        >
                          {isVisualizationLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Generate Visualization
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="network">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Analysis</CardTitle>
                    <CardDescription>Transaction patterns and network connections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Network className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Network Analysis</h3>
                      <p className="text-muted-foreground">
                        Advanced network analysis and cluster detection
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metadata">
                <Card>
                  <CardHeader>
                    <CardTitle>Address Metadata</CardTitle>
                    <CardDescription>Additional information about this address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="font-mono text-sm">{investigation.result.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Label:</span>
                        <span>{investigation.result.metadata.label || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{investigation.result.metadata.category || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verified:</span>
                        <span>{investigation.result.metadata.verified ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{new Date(investigation.result.metadata.lastUpdated).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
