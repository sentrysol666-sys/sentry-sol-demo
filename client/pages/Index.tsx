import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Visibility as Eye,
  BugReport as Bug,
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
  Lock as LockIcon,
  PhoneAndroid as MobileIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
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
      icon: LockIcon,
      title: "Your Data Private",
      description: "Your behavioral data never leaves your device. Security remains active, even when you're offline.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: Search,
      title: "Spots Suspicious",
      description: "Guards against phishing, malicious smart contracts, and wallet draining.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.2,
    },
    {
      icon: Bug,
      title: "Stop Threats",
      description: "Instant threat detection without network delays. Our system continuously adapts to new threats.",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.3,
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* SentrySol Gradient Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #000 0%, #395B64 50%, #395B64 75%, #000 100%)"
        }}
      />
      
      {/* Line Pattern Background */}
      <div className="fixed inset-0 z-1 opacity-20">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F4bb3a901209b402298887c7be38d6a6d"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mouse Follower */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-[#CFE0E3]/20 rounded-full pointer-events-none z-50 mix-blend-multiply"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* Navigation */}
      <motion.nav 
        className="fixed top-12 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-6xl px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[100px] px-5 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2Fa8a60ebfb99d4f8a95d229f18cfe5b5f"
                alt="SentrySol Logo"
                className="w-12 h-12"
              />
              <span className="text-white text-xl font-bold font-poppins">SENTRYSOL</span>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#products" className="text-white/90 hover:text-white transition-colors text-base font-medium">Products</a>
              <a href="#about" className="text-white/90 hover:text-white transition-colors text-base font-medium">About</a>
              <a href="#docs" className="text-white/90 hover:text-white transition-colors text-base font-medium">Docs</a>
              <a href="#pricing" className="text-white/90 hover:text-white transition-colors text-base font-medium">Pricing</a>
            </div>

            {/* Search and Connect */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-white/5 border border-white/20 rounded-full px-4 py-2">
                <input 
                  type="text" 
                  placeholder="I'm looking for..."
                  className="bg-transparent text-white/70 placeholder-white/50 text-sm outline-none w-32"
                />
                <Search className="text-white/50 w-4 h-4 ml-2" />
              </div>
              <Button className="bg-white text-black hover:bg-white/90 rounded-full px-5 py-2 font-medium text-sm">
                Connect
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center z-10">
        <motion.div 
          className="max-w-7xl mx-auto w-full"
          style={{ opacity }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Main Title - Responsive Size */}
            <motion.h1 
              variants={itemVariants}
              className="text-6xl sm:text-8xl lg:text-9xl xl:text-[200px] font-bold leading-none tracking-wider text-transparent bg-gradient-to-r from-transparent via-white/60 to-transparent bg-clip-text mb-12"
              style={{
                fontFamily: "Poppins",
                textTransform: "uppercase",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SENTRYSOL
            </motion.h1>

            {/* Logo Glow Effect - Responsive */}
            <motion.div 
              className="relative flex justify-center mb-16"
              variants={itemVariants}
            >
              <div className="relative">
                <img 
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F23c2c31fc9304ab89820e5a3b12f9e8a"
                  alt="SentrySol Logo with Glow"
                  className="w-full max-w-2xl h-auto object-contain"
                />
              </div>
            </motion.div>

            {/* Tagline and Description - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto mb-20">
              {/* Left Side - Tagline */}
              <motion.div 
                variants={itemVariants}
                className="text-center lg:text-left"
              >
                <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-light leading-tight font-poppins">
                  Secure.<br />
                  Smart.<br />
                  Private.
                </h2>
              </motion.div>

              {/* Center - Spacer on larger screens */}
              <div className="hidden lg:block"></div>

              {/* Right Side - Description and CTA */}
              <motion.div 
                variants={itemVariants}
                className="text-center lg:text-right"
              >
                <p className="text-white text-base sm:text-lg leading-relaxed font-poppins mb-8">
                  SentrySol is an AI-native, on-device behavioral security framework built specifically for Web3 mobile environments, initially focusing on Solana Mobile Seeker.
                </p>
                <Button 
                  className="bg-[#CFE0E3] text-black hover:bg-[#CFE0E3]/90 rounded-lg px-6 py-3 text-base font-bold font-poppins"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center mb-20"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-center leading-tight mb-8"
              style={{
                background: "linear-gradient(90deg, #A5C9CA 0%, #E7F6F2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "Poppins",
                letterSpacing: "2px"
              }}
            >
              Intelligent Protection<br />
              Right On Your Phone
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-white text-lg sm:text-xl lg:text-2xl font-light max-w-4xl mx-auto font-poppins leading-relaxed"
            >
              We introduce an AI-native, on-device behavioral security framework specifically engineered to protect your Web3 mobile experience.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="h-full min-h-[400px] border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 overflow-hidden group rounded-3xl">
                    <CardHeader className="pb-4 relative text-center pt-12">
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-br from-[#CFE0E3] to-[#92BAC1] rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="h-10 w-10 text-black" />
                      </motion.div>
                      <CardTitle className="text-2xl lg:text-3xl font-light text-white group-hover:text-[#CFE0E3] transition-colors duration-300 font-poppins mb-6">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="relative text-center px-6">
                      <CardDescription className="text-white/70 text-base lg:text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-300 font-poppins">
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

      {/* Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="text-center mb-20"
            variants={itemVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-white text-center leading-tight mb-8 font-poppins"
            >
              Revolutionizing Web3<br />Mobile Security
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-white text-lg sm:text-xl font-light max-w-3xl mx-auto font-poppins leading-relaxed mb-16"
            >
              SentrySol is strategically focused on the Solana Mobile ecosystem, providing native, enhanced dApp security directly integrated with devices like the Solana Seeker.
            </motion.p>
          </motion.div>
          
          {/* Tech Features with Illustration */}
          <motion.div 
            variants={itemVariants}
            className="relative mb-20"
          >
            <div className="flex justify-center">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F9a309f6fee534d2ebd72fc389778022f"
                alt="Technology Illustration"
                className="max-w-full w-full max-w-4xl h-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Vision and Mission */}
            <div>
              <motion.div variants={itemVariants} className="mb-16">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-8 font-poppins">Vision</h2>
                <p className="text-white text-lg sm:text-xl font-light leading-relaxed font-poppins">
                  We envision a Web3 future where users interact with decentralized applications confidently and securely. SentrySol is building the essential, intelligent, and privacy-preserving security layer needed to unlock the full potential of Web3 on mobile devices.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-8 font-poppins">Mission</h2>
                <p className="text-white text-lg sm:text-xl font-light leading-relaxed font-poppins">
                  Empowering Users, Fostering trust and confidence in every Web3 interaction.<br/><br/>
                  Securing the Ecosystem, Protecting against evolving threats like blind signing and wallet draining.<br/><br/>
                  Driving Adoption, Making Web3 accessible and safe for everyone.
                </p>
              </motion.div>
            </div>

            {/* Right side - Abstract Illustration */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center"
            >
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F2625c3df85902ee8a3128918e90c80b207a5a44b"
                alt="Abstract data visualization"
                className="rounded-[132px] border border-[#CFE0E3] max-w-full w-full max-w-lg h-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Seamless Integration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Device Image */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center order-2 lg:order-1"
            >
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F61802e12c703b764d8e1cbb87fc01b7c1dc6b4bc"
                alt="Solana Mobile Seeker"
                className="max-w-full w-full max-w-2xl h-auto"
              />
            </motion.div>

            {/* Right side - Content */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <h2 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight mb-8"
                style={{
                  background: "linear-gradient(90deg, #A5C9CA 0%, #E7F6F2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Poppins",
                  letterSpacing: "2px"
                }}
              >
                Seamless Integration for Enhanced Security.
              </h2>
              <p className="text-white text-lg sm:text-xl font-light leading-relaxed font-poppins mb-12">
                SentrySol is strategically focused on the Solana Mobile ecosystem, providing native, enhanced dApp security directly integrated with devices like the Solana Seeker.
              </p>
              <Button 
                className="bg-[#09B0B6]/20 text-white border border-white/20 hover:bg-[#09B0B6]/30 rounded-[33px] px-8 py-4 text-lg font-light font-poppins"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Read More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Soon On Seeker Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p 
            variants={itemVariants}
            className="text-white text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed font-poppins mb-16 max-w-6xl mx-auto"
          >
            We're building the future of Web3 mobile security,<br />
            a future <span className="font-medium">where you're always protected.</span>
          </motion.p>

          <motion.div variants={itemVariants} className="mb-16">
            <Button 
              className="bg-[#09B0B6]/20 text-white border border-white/20 hover:bg-[#09B0B6]/30 rounded-[33px] px-8 py-4 text-lg font-medium font-poppins"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Start Now
            </Button>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-12 font-poppins"
            style={{ letterSpacing: "4px" }}
          >
            Soon On
          </motion.h2>

          <motion.div variants={itemVariants} className="mb-16">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F11b8b410852647fca9bf0138d063768d"
              alt="Solana Mobile Seeker"
              className="mx-auto max-w-full w-full max-w-4xl h-auto"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2Fdba94d29ba0d4b8ebb7d6af3fd6508f7"
              alt="Solana dApp Store Badge"
              className="mx-auto w-full max-w-96 h-auto"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3333] py-20 px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Newsletter Section */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
              <div className="bg-[#202020] rounded-2xl p-6 lg:p-8 mb-8">
                <h3 className="text-white text-lg font-semibold mb-4 font-poppins">
                  Subscribe to our newsletter.
                </h3>
                <p className="text-white/60 text-sm mb-6 font-poppins">
                  You can unsubscribe at any time. Our <span className="underline">Privacy Policy is available here.</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-[#363636] rounded-[32px] px-6 py-4">
                    <input 
                      type="email"
                      placeholder="Mail"
                      className="w-full bg-transparent text-white text-xl lg:text-2xl font-light placeholder-[#4F4F4F] outline-none font-poppins"
                    />
                  </div>
                  <Button className="bg-[#0988F0] rounded-[32px] w-16 h-16 p-0 hover:bg-[#0988F0]/90 flex-shrink-0">
                    <ArrowRight className="text-black w-6 h-6" />
                  </Button>
                </div>
              </div>
              
              {/* Product Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FF573B] rounded-2xl h-48 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">AppKit</span>
                </div>
                <div className="bg-[#FFB800] rounded-2xl h-48 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">WalletKit</span>
                </div>
              </div>
            </motion.div>

            {/* Explore Section */}
            <motion.div variants={itemVariants} className="bg-[#E9E9E9] rounded-2xl p-6">
              <h3 className="text-black text-lg font-semibold mb-6 font-poppins">Explore</h3>
              <div className="space-y-4">
                {["Press & Media", "Community", "Contact"].map((item) => (
                  <a key={item} href="#" className="block text-[#9A9A9A] text-sm hover:text-black transition-colors font-poppins">
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Resources Section */}
            <motion.div variants={itemVariants} className="bg-[#E9E9E9] rounded-2xl p-6">
              <h3 className="text-black text-lg font-semibold mb-6 font-poppins">Resources</h3>
              <div className="space-y-4">
                {["Whitepaper", "Documentation", "Integration", "Blog"].map((item) => (
                  <a key={item} href="#" className="block text-[#9A9A9A] text-sm hover:text-black transition-colors font-poppins">
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Connect and Company Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[#E9E9E9] rounded-2xl p-6">
              <h3 className="text-black text-lg font-semibold mb-6 font-poppins">Connect</h3>
              <div className="space-y-4">
                {["X (Twitter)", "LinkedIn", "YouTube", "Discord", "Farcaster"].map((item) => (
                  <a key={item} href="#" className="block text-[#9A9A9A] text-sm hover:text-black transition-colors font-poppins">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[#E9E9E9] rounded-2xl p-6 md:col-span-2">
              <h3 className="text-black text-lg font-semibold mb-6 font-poppins">Company</h3>
              <div className="grid grid-cols-2 gap-4">
                {["About Us", "Enterprise", "Blog", "Newsroom", "Careers", "Media Kit", "Contact"].map((item) => (
                  <a key={item} href="#" className="block text-[#9A9A9A] text-sm hover:text-black transition-colors font-poppins">
                    {item}
                  </a>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-[#9A9A9A]/20">
                <p className="text-black text-sm font-poppins">© 2025 SentrySol inc.</p>
              </div>
            </div>
          </motion.div>

          {/* Logo and Bottom */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2Fa8a60ebfb99d4f8a95d229f18cfe5b5f"
                alt="SentrySol Logo"
                className="w-10 h-10"
              />
              <span className="text-white text-xl font-semibold font-poppins">SENTRYSOL</span>
            </div>
            
            <p className="text-white/60 text-sm max-w-md mx-auto mb-8 font-poppins">
              SentrySol is an AI-native, on-device behavioral security framework built specifically for Web3 mobile environments, initially focusing on Solana Mobile Seeker.
            </p>
          </motion.div>

          {/* Bottom Links */}
          <motion.div variants={itemVariants} className="border-t border-white/15 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-8 mb-4 md:mb-0">
                <a href="#" className="text-white text-sm font-medium font-poppins">LinkedIn</a>
                <TwitterIcon className="text-white w-5 h-5" />
              </div>
              <p className="text-white/60 text-sm font-poppins">SentrySol, 2025</p>
            </div>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}
