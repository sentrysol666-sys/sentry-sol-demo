import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowForward as ArrowRight,
  Security as Shield,
  Psychology as Brain,
  Hub as Network,
  Search,
  BarChart as BarChart3,
  CheckCircle,
  Bolt as Zap,
  Public as Globe,
  Groups as Users,
} from "@mui/icons-material";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full text-center">
          {/* Large Brand Title */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-4">
              Sentrysol
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
          </div>

          {/* Clean Value Proposition */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 max-w-4xl mx-auto leading-tight">
            Hold strong with the most powerful AML platform for blockchain
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Advanced AI-powered compliance tools for institutions. Comprehensive
            sanctions screening, transaction monitoring, and risk assessment.
          </p>

          {/* Clean CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/wallet-screening">
              <Button
                size="lg"
                className="px-10 py-4 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                Get started now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-4 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-full transition-all duration-200"
              >
                View dashboard
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Enterprise Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Real-time Monitoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for compliance professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay compliant with regulatory requirements
              and detect suspicious activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Analysis */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Advanced machine learning models analyze transaction patterns
                  and detect suspicious activities with 99.7% accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Real-time Screening */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Real-time Screening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Instant sanctions and PEP screening against global watchlists
                  with sub-100ms response times.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Transaction Tracing */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Transaction Tracing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Follow fund flows across multiple blockchains with advanced
                  graph analysis and visualization tools.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Investigation Tools */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Investigation Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Comprehensive case management with automated report
                  generation and regulatory filing capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-indigo-50 to-indigo-100">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Real-time insights and metrics with customizable dashboards
                  for compliance teams and executives.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Multi-chain Support */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Multi-chain Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Monitor transactions across Bitcoin, Ethereum, Solana, and
                  other major blockchain networks from one platform.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by compliance teams worldwide
          </h2>
          <p className="text-lg text-gray-600 mb-16">
            Join hundreds of financial institutions using Sentrysol for
            blockchain compliance.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900">500M+</div>
              <div className="text-sm text-gray-600">Transactions analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900">99.7%</div>
              <div className="text-sm text-gray-600">Detection accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900">&lt;100ms</div>
              <div className="text-sm text-gray-600">Response time</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-8">
            INTEGRATED DATA SOURCES
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-lg font-semibold text-gray-600">Helius</div>
            <div className="text-lg font-semibold text-gray-600">MetaSleuth</div>
            <div className="text-lg font-semibold text-gray-600">Chainabuse</div>
            <div className="text-lg font-semibold text-gray-600">Etherscan</div>
            <div className="text-lg font-semibold text-gray-600">CoinStats</div>
            <div className="text-lg font-semibold text-gray-600">OFAC</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to strengthen your compliance?
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Join the future of blockchain AML with enterprise-grade tools and
            AI-powered insights.
          </p>
          <Link to="/wallet-screening">
            <Button
              size="lg"
              className="px-10 py-4 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Get started now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
