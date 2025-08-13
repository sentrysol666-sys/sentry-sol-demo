import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
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
  StarBorder,
  TrendingUp,
  Speed,
  Timeline,
} from "@mui/icons-material";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-20, 20, -20],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const heroTextVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.03,
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -150]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const { isConnected } = useWalletIntegration();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models analyze transaction patterns with 99.7% accuracy",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: Shield,
      title: "Real-time Screening",
      description: "Instant sanctions and PEP screening against global watchlists",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.2,
    },
    {
      icon: Network,
      title: "Transaction Tracing",
      description: "Follow fund flows across multiple blockchains with advanced graph analysis",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.3,
    },
    {
      icon: Search,
      title: "Investigation Tools",
      description: "Comprehensive case management with automated report generation",
      gradient: "from-orange-500 to-red-500",
      delay: 0.4,
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights with customizable dashboards for compliance teams",
      gradient: "from-indigo-500 to-purple-500",
      delay: 0.5,
    },
    {
      icon: Globe,
      title: "Multi-chain Support",
      description: "Monitor transactions across Bitcoin, Ethereum, Solana and other networks",
      gradient: "from-pink-500 to-rose-500",
      delay: 0.6,
    },
  ];

  const stats = [
    { value: "500M+", label: "Transactions analyzed", icon: Timeline },
    { value: "99.7%", label: "Detection accuracy", icon: TrendingUp },
    { value: "<100ms", label: "Response time", icon: Speed },
    { value: "24/7", label: "Monitoring", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 overflow-hidden">
      {/* Mouse Follower */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-primary/20 rounded-full pointer-events-none z-50 mix-blend-multiply"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-60 right-32 w-64 h-64 bg-brand-light/5 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-32 h-32 bg-success-green/5 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <motion.div 
          className="max-w-6xl mx-auto w-full text-center"
          style={{ y: y1, opacity }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Badge 
                className="mb-8 px-6 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 backdrop-blur-sm hover:bg-primary/15 transition-colors cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                🚀 Next-gen AML Intelligence Platform
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              variants={heroTextVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6"
            >
              <span className="bg-gradient-to-r from-primary via-brand-light to-success-green bg-clip-text text-transparent">
                Sentrysol
              </span>
            </motion.h1>

            <motion.div 
              variants={itemVariants}
              className="w-32 h-1 bg-gradient-to-r from-primary to-brand-light mx-auto mb-8 rounded-full"
            />

            {/* Subtitle */}
            <motion.h2 
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight"
            >
              AI-powered compliance platform for{" "}
              <span className="text-primary">blockchain intelligence</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Advanced machine learning and graph neural networks for comprehensive 
              sanctions screening, transaction monitoring, and risk assessment.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link to={isConnected ? "/dashboard" : "/signin"}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Button
                    size="lg"
                    className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-brand-light hover:from-primary/90 hover:to-brand-light/90 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {isConnected ? "Open Dashboard" : "Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              
              <Link to="/wallet-screening">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-10 py-4 text-lg font-semibold border-2 border-muted-foreground/30 text-foreground hover:border-primary/50 hover:bg-primary/5 rounded-full transition-all duration-300"
                  >
                    Try Demo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
            >
              {[
                { icon: CheckCircle, text: "Enterprise Grade", color: "text-green-500" },
                { icon: Shield, text: "SOC 2 Compliant", color: "text-blue-500" },
                { icon: Zap, text: "Real-time Processing", color: "text-yellow-500" },
                { icon: Users, text: "Trusted by 500+ Teams", color: "text-purple-500" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <item.icon className={`h-4 w-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="group-hover:text-foreground transition-colors">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 backdrop-blur-sm">
        <motion.div 
          className="max-w-7xl mx-auto"
          style={{ y: y2 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
            >
              Built for compliance professionals
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Everything you need to stay compliant with regulatory requirements
              and detect suspicious activities.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
                whileHover="hover"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <CardHeader className="pb-4 relative">
                      <motion.div 
                        className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <CardDescription className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by compliance teams worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of financial institutions using Sentrysol for blockchain compliance.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary/10 to-brand-light/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary/20 group-hover:to-brand-light/20 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <stat.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Data Sources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3 
            variants={itemVariants}
            className="text-lg font-semibold text-muted-foreground mb-8"
          >
            INTEGRATED DATA SOURCES
          </motion.h3>
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-12"
          >
            {["Helius", "MetaSleuth", "Chainabuse", "Etherscan", "CoinStats", "OFAC"].map((source, index) => (
              <motion.div
                key={source}
                className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {source}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-foreground via-primary to-brand-light">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Ready to strengthen your compliance?
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-white/90 mb-10"
          >
            Join the future of blockchain AML with enterprise-grade tools and AI-powered insights.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link to={isConnected ? "/dashboard" : "/signin"}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Button
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold bg-white text-foreground hover:bg-white/90 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {isConnected ? "Open Dashboard" : "Get started now"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
