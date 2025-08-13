import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mcpApiClient } from "@shared/api-client";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import WalletConnector from "@/components/WalletConnector";
import WalletGuard from "@/components/WalletGuard";
import {
  DashboardIcon,
  SearchIcon,
  SecurityIcon,
  AssessmentIcon,
  WalletIcon,
  CheckCircleIcon,
  CancelIcon,
  WarningIcon,
  InfoIcon,
  RefreshIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  VerifiedIcon,
  BlockIcon,
} from "@/components/ui/material-icons";

export default function AMLDashboard() {
  const [address, setAddress] = useState("");
  const [investigationType, setInvestigationType] = useState("full");
  const [chain, setChain] = useState("ethereum");
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [bulkAddresses, setBulkAddresses] = useState("");
  const [bulkResults, setBulkResults] = useState<any>(null);
  const [pepName, setPepName] = useState("");
  const [pepResults, setPepResults] = useState<any>(null);

  const { fillAddressFromConnectedWallet, isConnected } =
    useWalletIntegration();

  const validateAddress = (addr: string) => {
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
    const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(addr);
    return isSolanaAddress || isEthereumAddress;
  };

  const handleUseConnectedWallet = () => {
    const walletAddress = fillAddressFromConnectedWallet();
    if (walletAddress) {
      setAddress(walletAddress);
      setChain(walletAddress.startsWith("0x") ? "ethereum" : "solana");
    }
  };

  const handleInvestigation = async () => {
    if (!validateAddress(address)) {
      setError("Please enter a valid wallet address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await mcpApiClient.comprehensiveInvestigation(
        address,
        investigationType,
        userQuery,
      );
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Investigation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletScreening = async () => {
    if (!validateAddress(address)) {
      setError("Please enter a valid wallet address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await mcpApiClient.screenWalletComprehensive(
        address,
        chain,
      );
      setResults({ ...results, screening: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet screening failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionAnalysis = async () => {
    if (!validateAddress(address)) {
      setError("Please enter a valid wallet address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await mcpApiClient.analyzeTransactionsDetailed(
        address,
        chain,
        100,
      );
      setResults({ ...results, transactions: result });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Transaction analysis failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkScreening = async () => {
    const addresses = bulkAddresses.split("\n").filter((addr) => addr.trim());
    if (addresses.length === 0) {
      setError("Please enter at least one address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await mcpApiClient.bulkScreenAddresses(addresses, chain);
      setBulkResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk screening failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePEPCheck = async () => {
    if (!pepName.trim()) {
      setError("Please enter a name to check");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await mcpApiClient.checkPEPStatus(pepName);
      setPepResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PEP check failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-red-400 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
        return <BlockIcon className="h-4 w-4" />;
      case "high":
        return <WarningIcon className="h-4 w-4" />;
      case "medium":
        return <InfoIcon className="h-4 w-4" />;
      case "low":
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-light/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
              <DashboardIcon className="h-8 w-8 text-brand-light" />
              AML Investigation Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive blockchain compliance analysis powered by AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-brand-light text-brand-light"
            >
              <VerifiedIcon className="mr-1 h-3 w-3" />
              Live Data Sources
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
            <WarningIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Investigation Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-brand-light" />
              Address Investigation
            </CardTitle>
            <CardDescription>
              Comprehensive AML analysis using MetaSleuth, Chainabuse, Helius,
              Coinstats, and PEP databases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Wallet Connection */}
                <div className="lg:col-span-1">
                  <WalletConnector className="h-fit" />
                </div>

                {/* Investigation Controls */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter wallet address (0x... or Solana address)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex-1"
                    />
                    {isConnected && (
                      <Button
                        variant="outline"
                        onClick={handleUseConnectedWallet}
                      >
                        <WalletIcon className="mr-2 h-4 w-4" />
                        Use Connected
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={chain} onValueChange={setChain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={investigationType}
                      onValueChange={setInvestigationType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Investigation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Investigation</SelectItem>
                        <SelectItem value="sanctions">
                          Sanctions Only
                        </SelectItem>
                        <SelectItem value="tracing">
                          Transaction Tracing
                        </SelectItem>
                        <SelectItem value="media">Media Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    placeholder="Additional investigation notes or specific areas of concern..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    rows={2}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button
                      onClick={handleInvestigation}
                      disabled={isLoading}
                      className="bg-brand-light"
                    >
                      {isLoading ? (
                        <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SearchIcon className="mr-2 h-4 w-4" />
                      )}
                      Full Investigation
                    </Button>
                    <Button
                      onClick={handleWalletScreening}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <SecurityIcon className="mr-2 h-4 w-4" />
                      Screen Wallet
                    </Button>
                    <Button
                      onClick={handleTransactionAnalysis}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <AssessmentIcon className="mr-2 h-4 w-4" />
                      Analyze Transactions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        {results && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investigation Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.riskLevel && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          {getRiskIcon(results.riskLevel)}
                          <span className="ml-2 text-lg font-bold">
                            Risk Level
                          </span>
                        </div>
                        <Badge className={getRiskBadgeColor(results.riskLevel)}>
                          {results.riskLevel}
                        </Badge>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-lg font-bold text-brand-light">
                          {results.riskScore || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Risk Score
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-lg font-bold text-warning-amber">
                          {results.findings?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Findings
                        </div>
                      </div>
                    </div>
                  )}

                  {results.executiveSummary && (
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Executive Summary</h4>
                      <p>{results.executiveSummary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sanctions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sanctions & Compliance Screening</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.screening ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>Sanctions Match</span>
                            {results.screening.riskAssessment.sanctionsMatch ? (
                              <Badge className="bg-red-500 text-white">
                                MATCH
                              </Badge>
                            ) : (
                              <Badge className="bg-green-500 text-white">
                                CLEAR
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>Blacklist Status</span>
                            {results.screening.riskAssessment.blacklistMatch ? (
                              <Badge className="bg-red-500 text-white">
                                LISTED
                              </Badge>
                            ) : (
                              <Badge className="bg-green-500 text-white">
                                CLEAR
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {results.screening.recommendations && (
                        <div>
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <ul className="space-y-1">
                            {results.screening.recommendations.map(
                              (rec: string, index: number) => (
                                <li
                                  key={index}
                                  className="text-sm flex items-start gap-2"
                                >
                                  <InfoIcon className="h-4 w-4 mt-0.5 text-brand-light flex-shrink-0" />
                                  {rec}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Run wallet screening to see sanctions results
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.transactions ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">
                            {results.transactions.summary.totalTransactions}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Transactions
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">
                            {results.transactions.summary.uniqueCounterparties}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Unique Counterparties
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">
                            {results.transactions.summary.totalVolume}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Volume
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">
                            {results.transactions.summary.timespan?.spanDays ||
                              "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Active Days
                          </div>
                        </div>
                      </div>

                      {results.transactions.patterns &&
                        results.transactions.patterns.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">
                              Detected Patterns
                            </h4>
                            <div className="space-y-2">
                              {results.transactions.patterns.map(
                                (pattern: any, index: number) => (
                                  <div
                                    key={index}
                                    className="p-3 border rounded-lg"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">
                                        {pattern.type
                                          .replace("_", " ")
                                          .toUpperCase()}
                                      </span>
                                      <Badge
                                        variant={
                                          pattern.risk === "high"
                                            ? "destructive"
                                            : "secondary"
                                        }
                                      >
                                        {pattern.risk}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {pattern.description}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Run transaction analysis to see detailed results
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Patterns & Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.findings && results.findings.length > 0 ? (
                    <div className="space-y-3">
                      {results.findings.map((finding: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getRiskIcon(finding.severity)}
                              <span className="font-medium">
                                {finding.description}
                              </span>
                            </div>
                            <Badge
                              variant={
                                finding.severity === "critical"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {finding.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Type: {finding.type} • Source:{" "}
                            {finding.source || "AI Analysis"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium">
                        No Risk Patterns Detected
                      </h3>
                      <p className="text-muted-foreground">
                        This address appears to have normal transaction patterns
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations & Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.recommendations ? (
                    <div className="space-y-3">
                      {results.recommendations.map(
                        (rec: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                          >
                            <InfoIcon className="h-5 w-5 text-brand-light mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <InfoIcon className="h-5 w-5 text-brand-light mt-0.5 flex-shrink-0" />
                        <span>
                          Continue monitoring for unusual activity patterns
                        </span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <InfoIcon className="h-5 w-5 text-brand-light mt-0.5 flex-shrink-0" />
                        <span>Schedule periodic review in 30 days</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <InfoIcon className="h-5 w-5 text-brand-light mt-0.5 flex-shrink-0" />
                        <span>Document findings in case management system</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Additional Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bulk Screening */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Address Screening</CardTitle>
              <CardDescription>
                Screen multiple addresses simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter addresses (one per line)&#10;0x1234...&#10;0x5678...&#10;BC1QXY..."
                value={bulkAddresses}
                onChange={(e) => setBulkAddresses(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleBulkScreening}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SecurityIcon className="mr-2 h-4 w-4" />
                )}
                Screen Addresses
              </Button>
              {bulkResults && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-bold">
                        {bulkResults.summary.totalAddresses}
                      </div>
                      <div className="text-xs">Total</div>
                    </div>
                    <div className="text-center p-2 bg-red-100 dark:bg-red-900/20 rounded">
                      <div className="font-bold text-red-600">
                        {bulkResults.summary.highRisk}
                      </div>
                      <div className="text-xs">High Risk</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PEP Check */}
          <Card>
            <CardHeader>
              <CardTitle>PEP & Sanctions Check</CardTitle>
              <CardDescription>
                Check names against PEP databases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter full name to check"
                value={pepName}
                onChange={(e) => setPepName(e.target.value)}
              />
              <Button
                onClick={handlePEPCheck}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SearchIcon className="mr-2 h-4 w-4" />
                )}
                Check PEP Status
              </Button>
              {pepResults && (
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">PEP Status</span>
                    {pepResults.isPEP ? (
                      <Badge className="bg-red-500 text-white">PEP MATCH</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white">CLEAR</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {Math.round(pepResults.confidence * 100)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
