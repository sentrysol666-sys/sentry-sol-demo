import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, Shield, Brain, Network, Search, BarChart3, 
  TrendingUp, TrendingDown, Activity, Clock, CheckCircle, 
  XCircle, Eye, Users, FileText, Settings, Zap, 
  AlertCircle, Info, RefreshCw 
} from "lucide-react";

export default function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Mock data for demonstration
  const agents = [
    {
      id: "blockchain_trace",
      name: "Blockchain Tracing Agent",
      status: "active",
      icon: Network,
      color: "text-aml-blue",
      bgColor: "bg-aml-blue/10",
      description: "Analyzing transaction flows and mapping fund movements",
      lastAction: "Traced 847 transactions in the last hour",
      confidence: 94,
      activities: [
        "Mapped transaction flow from 0x742d35Cc6aF1cD6c...89BA",
        "Detected multi-hop pattern across 15 addresses",
        "Identified potential mixing service usage"
      ]
    },
    {
      id: "sanctions_screen",
      name: "Sanctions Screening Agent",
      status: "active",
      icon: Shield,
      color: "text-risk-red",
      bgColor: "bg-risk-red/10",
      description: "Screening against global sanctions lists",
      lastAction: "Screened 1,247 addresses against OFAC database",
      confidence: 99,
      activities: [
        "OFAC match found: 0x1a2b3c4d5e6f7g8h...ABCD",
        "EU sanctions list updated and re-screened",
        "PEP database cross-reference completed"
      ]
    },
    {
      id: "adverse_media",
      name: "Adverse Media Agent",
      status: "processing",
      icon: Search,
      color: "text-warning-amber",
      bgColor: "bg-warning-amber/10",
      description: "Analyzing news and media for negative associations",
      lastAction: "Processing 156 media articles for entity mentions",
      confidence: 87,
      activities: [
        "Analyzed 45 news articles mentioning target entity",
        "Detected negative sentiment in 12 publications",
        "Cross-referenced with social media mentions"
      ]
    },
    {
      id: "graph_analysis",
      name: "Graph Analysis Agent",
      status: "active",
      icon: BarChart3,
      color: "text-compliance-green",
      bgColor: "bg-compliance-green/10",
      description: "Using GCN for network pattern recognition",
      lastAction: "Analyzed network topology for 2,341 addresses",
      confidence: 91,
      activities: [
        "Detected clustering pattern in transaction network",
        "Identified 23 potential intermediary addresses",
        "Generated D3.js visualization of fund flow"
      ]
    },
    {
      id: "coordinator",
      name: "AI Coordinator",
      status: "active",
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Orchestrating multi-agent insights and decisions",
      lastAction: "Synthesized findings from 4 active agents",
      confidence: 96,
      activities: [
        "Prioritized 7 high-risk alerts for investigation",
        "Generated comprehensive risk assessment",
        "Coordinated agent task assignment"
      ]
    }
  ];

  const alerts = [
    {
      id: "1",
      severity: "critical",
      type: "sanctions",
      title: "OFAC Sanctions Match Detected",
      description: "Wallet 0x742d35Cc6aF1cD6c...89BA matches OFAC SDN list",
      timestamp: "2 minutes ago",
      confidence: 99
    },
    {
      id: "2",
      severity: "high",
      type: "suspicious_activity",
      title: "Unusual Transaction Pattern",
      description: "Rapid-fire transactions detected across 15 addresses",
      timestamp: "8 minutes ago",
      confidence: 94
    },
    {
      id: "3",
      severity: "medium",
      type: "aml",
      title: "PEP Association Found",
      description: "Transaction link to politically exposed person identified",
      timestamp: "15 minutes ago",
      confidence: 87
    }
  ];

  const stats = [
    { label: "Active Alerts", value: "47", change: "+12%", trend: "up", color: "text-risk-red" },
    { label: "Addresses Monitored", value: "12.4K", change: "+8%", trend: "up", color: "text-aml-blue" },
    { label: "Risk Score Avg", value: "23.7", change: "-5%", trend: "down", color: "text-compliance-green" },
    { label: "Cases Active", value: "156", change: "+3%", trend: "up", color: "text-warning-amber" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-risk-red bg-risk-red/10 border-risk-red/20";
      case "high": return "text-warning-amber bg-warning-amber/10 border-warning-amber/20";
      case "medium": return "text-aml-blue bg-aml-blue/10 border-aml-blue/20";
      default: return "text-muted-foreground bg-muted/10 border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-compliance-green" />;
      case "processing": return <Clock className="h-4 w-4 text-warning-amber" />;
      case "error": return <XCircle className="h-4 w-4 text-risk-red" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-aml-blue/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AML Intelligence Dashboard</h1>
            <p className="text-muted-foreground">Multi-agent AI monitoring and compliance analysis</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" className="bg-aml-blue hover:bg-aml-blue/90">
              <Search className="mr-2 h-4 w-4" />
              Screen Address
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${stat.color}`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Status */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Multi-Agent System Status</span>
                </CardTitle>
                <CardDescription>
                  Real-time status and performance of AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <div
                        key={agent.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedAgent === agent.id
                            ? "border-aml-blue/30 bg-aml-blue/5"
                            : "border-border hover:border-border/60"
                        }`}
                        onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${agent.bgColor}`}>
                              <Icon className={`h-5 w-5 ${agent.color}`} />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">{agent.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(agent.status)}
                            <Badge variant="secondary" className="text-xs">
                              {agent.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{agent.lastAction}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={agent.confidence} className="w-16 h-2" />
                          </div>
                        </div>

                        {selectedAgent === agent.id && (
                          <div className="mt-4 pt-3 border-t border-border">
                            <h4 className="font-medium text-sm mb-2">Recent Activities:</h4>
                            <ul className="space-y-1">
                              {agent.activities.map((activity, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-start">
                                  <div className="w-1 h-1 bg-aml-blue rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning-amber" />
                  <span>Active Alerts</span>
                </CardTitle>
                <CardDescription>
                  Priority compliance and risk alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{alert.timestamp}</span>
                        <span className="font-medium">{alert.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-aml-blue" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input placeholder="Enter wallet address to screen..." className="text-sm" />
                  <Button size="sm" className="w-full bg-aml-blue hover:bg-aml-blue/90">
                    Screen Address
                  </Button>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-1 h-3 w-3" />
                      New Case
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-1 h-3 w-3" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-compliance-green" />
              <span>Recent System Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Activity</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="screening">Screening</TabsTrigger>
                <TabsTrigger value="cases">Cases</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="space-y-3">
                  {[
                    "Sanctions screening completed for 1,247 addresses",
                    "New high-risk case created: Case #AML-2024-0156",
                    "Transaction pattern analysis detected suspicious activity",
                    "Adverse media agent found 3 new negative mentions",
                    "Graph analysis identified potential mixing service usage"
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-aml-blue rounded-full"></div>
                      <span className="text-muted-foreground">{activity}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {Math.floor(Math.random() * 60) + 1} min ago
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="alerts">
                <p className="text-muted-foreground">Alert-specific activity would be shown here.</p>
              </TabsContent>
              <TabsContent value="screening">
                <p className="text-muted-foreground">Screening activity would be shown here.</p>
              </TabsContent>
              <TabsContent value="cases">
                <p className="text-muted-foreground">Case management activity would be shown here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
