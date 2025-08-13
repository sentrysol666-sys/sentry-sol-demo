import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Security as Shield,
  AccountBalanceWallet as Wallet,
  Person as User,
  Notifications as Bell,
  Settings as Gear,
  Visibility as Eye,
  Lock as LockIcon,
  Speed,
  Public as Globe,
} from "@mui/icons-material";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { connectedWallets, activeWallet } = useWalletIntegration();
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
  });

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to SentrySol",
      description: "Let's get you set up with our AI-powered security platform",
      icon: Shield,
      completed: false,
    },
    {
      id: "profile",
      title: "Set Up Your Profile",
      description: "Tell us about yourself to personalize your experience",
      icon: User,
      completed: false,
    },
    {
      id: "security",
      title: "Security Preferences",
      description: "Configure your security and notification settings",
      icon: LockIcon,
      completed: false,
    },
    {
      id: "features",
      title: "Explore Features",
      description: "Learn about our key security and monitoring tools",
      icon: Eye,
      completed: false,
    },
  ];

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and redirect to dashboard
      localStorage.setItem('hasCompletedOnboarding', 'true');
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Shield,
      title: "Real-time Threat Detection",
      description: "AI monitors your transactions for suspicious activity",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Speed,
      title: "Instant Risk Scoring",
      description: "Get immediate risk assessments for wallet addresses",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Cross-chain Analysis",
      description: "Monitor activity across Solana and Ethereum networks",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-sentry-mint to-sentry-ice rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-4 font-poppins">
                Welcome to SentrySol
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto font-poppins">
                You've successfully connected your {activeWallet === 'solana' ? 'Solana' : 'Ethereum'} wallet. 
                Let's set up your security dashboard to protect your digital assets.
              </p>
            </div>
            
            {connectedWallets[activeWallet as keyof typeof connectedWallets] && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6 text-sentry-mint" />
                  <div className="text-left">
                    <p className="text-sm text-white/60 font-poppins">Connected Wallet</p>
                    <p className="text-white font-mono text-sm">
                      {connectedWallets[activeWallet as keyof typeof connectedWallets]?.address.slice(0, 6)}...
                      {connectedWallets[activeWallet as keyof typeof connectedWallets]?.address.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sentry-mint to-sentry-ice rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
                Set Up Your Profile
              </h2>
              <p className="text-white/80 font-poppins">
                Help us personalize your security experience
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Your Name"
                value={userProfile.name}
                onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 font-poppins"
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 font-poppins"
              />
              <Input
                placeholder="Organization (Optional)"
                value={userProfile.organization}
                onChange={(e) => setUserProfile(prev => ({ ...prev, organization: e.target.value }))}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 font-poppins"
              />
              <Input
                placeholder="Role (Optional)"
                value={userProfile.role}
                onChange={(e) => setUserProfile(prev => ({ ...prev, role: e.target.value }))}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 font-poppins"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-lg mx-auto"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sentry-mint to-sentry-ice rounded-full flex items-center justify-center mx-auto mb-6">
                <LockIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
                Security Preferences
              </h2>
              <p className="text-white/80 font-poppins">
                Configure how you want to be alerted about security events
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-sentry-mint" />
                    <div>
                      <p className="text-white font-medium font-poppins">Real-time Alerts</p>
                      <p className="text-white/60 text-sm font-poppins">Get notified of suspicious activity</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-sentry-mint rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-sentry-mint" />
                    <div>
                      <p className="text-white font-medium font-poppins">Auto-screening</p>
                      <p className="text-white/60 text-sm font-poppins">Automatically screen new transactions</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-sentry-mint rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Gear className="w-5 h-5 text-white/60" />
                    <div>
                      <p className="text-white font-medium font-poppins">Weekly Reports</p>
                      <p className="text-white/60 text-sm font-poppins">Receive security summary reports</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-white/20 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sentry-mint to-sentry-ice rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
                Explore Key Features
              </h2>
              <p className="text-white/80 font-poppins">
                Discover how SentrySol protects your digital assets
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 font-poppins">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm font-poppins">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-sentry-teal/50 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/12d981b08bdd510564c341e41e3b6d35e0500386?width=78"
              alt="SentrySol Logo"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold font-poppins">SENTRYSOL</span>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-white/60 hover:text-white hover:bg-white/10 font-poppins"
          >
            Skip Setup
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-white/60 font-poppins">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="text-sm text-white/60 font-poppins">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50 font-poppins"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep
                    ? "bg-sentry-mint"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-sentry-mint to-sentry-ice hover:from-sentry-mint/80 hover:to-sentry-ice/80 text-white font-poppins"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
