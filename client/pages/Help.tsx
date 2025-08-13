import { motion } from "framer-motion";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AccountBalanceWallet as Wallet,
  Security as Shield,
  OpenInNew,
  ArrowForward,
  CheckCircle,
  Info,
  Download,
  Smartphone,
  Computer,
} from "@mui/icons-material";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function Help() {
  const wallets = [
    {
      name: "Phantom",
      description: "The trusted crypto wallet for Solana",
      icon: "🟣",
      features: ["Easy to use", "Built for Solana", "Mobile & Desktop"],
      downloadUrl: "https://phantom.app",
      platforms: ["Chrome", "Firefox", "iOS", "Android"],
      difficulty: "Beginner Friendly",
    },
    {
      name: "Solflare",
      description: "Powerful wallet for Solana ecosystem",
      icon: "🌞",
      features: ["Advanced features", "Hardware wallet support", "Web3 ready"],
      downloadUrl: "https://solflare.com",
      platforms: ["Chrome", "Web", "iOS", "Android"],
      difficulty: "Intermediate",
    },
    {
      name: "MetaMask",
      description: "Gateway to blockchain apps",
      icon: "🦊",
      features: ["Most popular", "Ethereum focused", "DeFi ready"],
      downloadUrl: "https://metamask.io",
      platforms: ["Chrome", "Firefox", "iOS", "Android"],
      difficulty: "Beginner Friendly",
    },
  ];

  const steps = [
    {
      title: "Choose Your Wallet",
      description: "Select a wallet that supports your preferred blockchain",
      icon: Wallet,
      details: "Consider factors like ease of use, supported chains, and security features.",
    },
    {
      title: "Download & Install",
      description: "Install the wallet extension or mobile app",
      icon: Download,
      details: "Always download from official sources to avoid malicious software.",
    },
    {
      title: "Create Account",
      description: "Set up your new wallet with a secure password",
      icon: Shield,
      details: "Choose a strong password and write down your seed phrase safely.",
    },
    {
      title: "Connect to Sentrysol",
      description: "Return here and connect your wallet to get started",
      icon: CheckCircle,
      details: "Your wallet will prompt you to approve the connection.",
    },
  ];

  const faqs = [
    {
      question: "What is a crypto wallet?",
      answer: "A crypto wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. It doesn't actually store the crypto itself, but rather the private keys that give you access to your funds on the blockchain.",
    },
    {
      question: "Is it safe to connect my wallet?",
      answer: "Yes, connecting your wallet to Sentrysol is safe. We use non-custodial connections, meaning we never have access to your private keys or funds. You maintain full control of your assets.",
    },
    {
      question: "Which blockchain should I choose?",
      answer: "For AML compliance, we support both Solana and Ethereum networks. Solana offers faster transactions and lower fees, while Ethereum has the largest DeFi ecosystem. Choose based on your needs.",
    },
    {
      question: "Do I need to pay to use a wallet?",
      answer: "Most wallets are free to download and use. However, you'll need to pay network fees (gas fees) when making transactions on the blockchain.",
    },
    {
      question: "What if I lose access to my wallet?",
      answer: "That's why the seed phrase is crucial. As long as you have your seed phrase safely stored, you can recover your wallet on any device. Never share your seed phrase with anyone.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-sentry-teal/50 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-sentry-mint/10 text-sentry-mint border-sentry-mint/30">
              Getting Started Guide
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6 bg-gradient-to-r from-white via-sentry-mint to-sentry-ice bg-clip-text text-transparent">
              Set Up Your Crypto Wallet
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto font-poppins">
              New to crypto wallets? No problem! Follow our step-by-step guide to 
              get started with secure wallet setup and connection.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              4 Simple Steps to Get Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative"
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">
                        {step.description}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {step.details}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Wallet Options */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Recommended Wallets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wallets.map((wallet, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{wallet.icon}</div>
                        <Badge 
                          variant="outline" 
                          className={
                            wallet.difficulty === "Beginner Friendly" 
                              ? "border-green-500 text-green-500"
                              : "border-yellow-500 text-yellow-500"
                          }
                        >
                          {wallet.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {wallet.name}
                        <OpenInNew className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardTitle>
                      <CardDescription>{wallet.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Features:</h4>
                          <ul className="space-y-1">
                            {wallet.features.map((feature, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Available on:</h4>
                          <div className="flex flex-wrap gap-1">
                            {wallet.platforms.map((platform, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <a 
                          href={wallet.downloadUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full group-hover:shadow-lg transition-all duration-300">
                            <Download className="mr-2 h-4 w-4" />
                            Download {wallet.name}
                            <OpenInNew className="ml-2 h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Tips */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Always download wallets from official websites</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Write down your seed phrase and store it safely offline</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Never share your private keys or seed phrase</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use strong passwords and enable 2FA when available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Once you've set up your wallet, return to connect it and access 
                  our powerful AML compliance tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signin">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button size="lg" className="bg-gradient-to-r from-primary to-brand-light">
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                        <ArrowForward className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="lg">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
