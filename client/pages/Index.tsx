import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, TrendingUp, Bell, Eye, Zap, BarChart3, AlertTriangle, Wallet, Globe } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
              🚀 Beta Version - Advanced Solana Monitoring
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Monitor Solana Like a{" "}
              <span className="bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
                Pro Trader
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Real-time alerts, volume spike detection, and smart wallet tracking for the Solana blockchain. 
              Get the edge you need to stay ahead in the market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90">
                  Start Monitoring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Monitor Solana
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and analytics designed for serious Solana traders and investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Volume Spike Detection */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Volume Spike Detection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Get instant alerts when tokens experience unusual volume spikes. Never miss a potential breakout again.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Real-time Alerts */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-solana-green/10 rounded-lg">
                    <Bell className="h-6 w-6 text-solana-green" />
                  </div>
                  <CardTitle className="text-xl">Real-time Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Custom notifications delivered instantly to your devices. Set up alerts for price movements, liquidity changes, and more.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Smart Wallet Tracking */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Wallet className="h-6 w-6 text-warning" />
                  </div>
                  <CardTitle className="text-xl">Smart Wallet Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Follow the moves of successful traders and whales. Copy strategies from the most profitable wallets.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Liquidity Analysis */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle className="text-xl">Liquidity Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Deep dive into token liquidity metrics. Understand market depth and identify optimal entry/exit points.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Security Monitoring */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <Shield className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="text-xl">Security Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Advanced threat detection and suspicious activity alerts. Protect your investments from rug pulls and scams.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Lightning Fast */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Lightning Fast</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Sub-second data updates and millisecond-precise alerts. Speed is everything in crypto trading.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10M+</div>
              <div className="text-sm text-muted-foreground">Transactions Monitored</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-solana-green">50K+</div>
              <div className="text-sm text-muted-foreground">Active Tokens Tracked</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-warning">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-success">5ms</div>
              <div className="text-sm text-muted-foreground">Average Alert Speed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-solana-green/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Start Monitoring?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of traders who trust Sentrysol for their Solana monitoring needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
