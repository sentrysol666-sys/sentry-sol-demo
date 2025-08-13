import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Spline from '@splinetool/react-spline';
import {
  ArrowRight, Shield, Brain, Network, AlertTriangle,
  Eye, Database, TrendingUp, Users, Lock,
  FileText, CheckCircle, Search, BarChart3
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-light/5">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-brand-light/10 text-brand-light border-brand-light/20">
              🧠 AI-Powered AML/Compliance Platform - Beta
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins tracking-tight text-foreground mb-6">
              Next-Gen{" "}
              <span className="bg-gradient-to-r from-brand-light to-brand-accent bg-clip-text text-transparent">
                AML Intelligence
              </span>
              {" "}for Blockchain
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Advanced Graph Neural Networks (GCN) and LLM analysis for comprehensive blockchain compliance. 
              Multi-agent architecture for sanctions screening, transaction monitoring, and risk assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-brand-light hover:bg-brand-light/90">
                  Launch AML Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/wallet-screening">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-brand-light text-brand-light hover:bg-brand-light/10">
                  Screen Wallet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-foreground mb-4">
              Multi-Agent AI Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Specialized AI agents working in coordination for comprehensive blockchain analysis and compliance monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blockchain Tracing Agent */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-brand-light/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-light/10 rounded-lg">
                    <Network className="h-6 w-6 text-brand-light" />
                  </div>
                  <CardTitle className="text-xl">Blockchain Tracing Agent</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Advanced graph analysis for transaction flow mapping. Traces fund movements across multiple hops with GCN-powered pattern recognition.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Sanctions Screening Agent */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-risk-red/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-risk-red/10 rounded-lg">
                    <Shield className="h-6 w-6 text-risk-red" />
                  </div>
                  <CardTitle className="text-xl">Sanctions Screening</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Real-time screening against OFAC, EU, and global sanctions lists. Automated compliance checks with confidence scoring.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Adverse Media Agent */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-warning-amber/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning-amber/10 rounded-lg">
                    <Search className="h-6 w-6 text-warning-amber" />
                  </div>
                  <CardTitle className="text-xl">Adverse Media Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  LLM-powered analysis of news, social media, and public records. Identifies negative associations and reputational risks.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Fund Flow Visualization */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-success-green/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success-green/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-success-green" />
                  </div>
                  <CardTitle className="text-xl">Fund Flow Visualization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Interactive D3.js visualizations of transaction networks. Dynamic graph rendering for investigative analysis.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Coordination Agent */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">AI Coordinator</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Central orchestration of all agents. Combines insights, prioritizes alerts, and generates comprehensive risk assessments.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Real-time Processing */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-brand-dark/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-dark/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-brand-dark" />
                  </div>
                  <CardTitle className="text-xl">Real-time Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Stream processing for live transaction monitoring. Instant alerts for suspicious activities and compliance violations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-foreground mb-4">
              Enterprise-Grade Compliance Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete AML/KYC solution with advanced analytics and regulatory reporting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-brand-light/30 transition-colors">
              <div className="mx-auto w-12 h-12 bg-brand-light/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-brand-light" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Case Management</h3>
              <p className="text-muted-foreground text-sm">Comprehensive investigation workflow and documentation</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-success-green/30 transition-colors">
              <div className="mx-auto w-12 h-12 bg-success-green/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-success-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Automated Reports</h3>
              <p className="text-muted-foreground text-sm">SAR, CTR, and regulatory filing automation</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-warning-amber/30 transition-colors">
              <div className="mx-auto w-12 h-12 bg-warning-amber/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-warning-amber" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Risk Scoring</h3>
              <p className="text-muted-foreground text-sm">Dynamic risk assessment with ML-powered scoring</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-risk-red/30 transition-colors">
              <div className="mx-auto w-12 h-12 bg-risk-red/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-risk-red" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Compliance Rules</h3>
              <p className="text-muted-foreground text-sm">Configurable rule engine for regulatory requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Integrated Data Sources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            <div className="text-sm font-medium">Helius RPC</div>
            <div className="text-sm font-medium">MetaSleuth</div>
            <div className="text-sm font-medium">Chainabuse</div>
            <div className="text-sm font-medium">CoinStats</div>
            <div className="text-sm font-medium">PEP Checker</div>
            <div className="text-sm font-medium">Etherscan</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-brand-light">99.7%</div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-success-green">500M+</div>
              <div className="text-sm text-muted-foreground">Transactions Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-warning-amber">&lt;100ms</div>
              <div className="text-sm text-muted-foreground">Alert Response Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-risk-red">24/7</div>
              <div className="text-sm text-muted-foreground">Continuous Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-light/10 via-brand-light/5 to-success-green/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-foreground mb-4">
            Ready for Enterprise Compliance?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join leading financial institutions using Sentrysol for blockchain AML compliance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-brand-light hover:bg-brand-light/90">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-brand-light text-brand-light hover:bg-brand-light/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
