import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Security as Shield,
  BarChart as Analytics,
  Search,
  Description as FileText,
  Email,
  Phone,
  LocationOn as MapPin,
  GitHub,
  Twitter,
  LinkedIn,
  Send,
  Verified,
  Business as Building,
  TrendingUp,
  OpenInNew,
  Policy,
  PrivacyTip,
  Gavel,
  Help,
  ContactSupport,
  School,
} from "@mui/icons-material";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const productLinks = [
    { name: "AML Dashboard", href: "/aml-dashboard", icon: Shield },
    { name: "Wallet Screening", href: "/wallet-screening", icon: Search },
    { name: "Case Management", href: "/cases", icon: FileText },
    { name: "Analytics", href: "/analytics", icon: Analytics },
    { name: "Compliance Tools", href: "/compliance", icon: Verified },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Partner Program", href: "/partners" },
    { name: "Enterprise", href: "/enterprise" },
  ];

  const resourceLinks = [
    { name: "Documentation", href: "/docs", icon: FileText },
    { name: "API Reference", href: "/api", icon: TrendingUp },
    { name: "Help Center", href: "/help", icon: Help },
    { name: "Contact Support", href: "/support", icon: ContactSupport },
    { name: "Learning Center", href: "/learn", icon: School },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy", icon: PrivacyTip },
    { name: "Terms of Service", href: "/terms", icon: Gavel },
    { name: "Cookie Policy", href: "/cookies", icon: Policy },
    { name: "Security", href: "/security", icon: Shield },
  ];

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/sentrysol", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/sentrysol", icon: LinkedIn },
    { name: "GitHub", href: "https://github.com/sentrysol", icon: GitHub },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-background to-background/50 border-t border-border/40">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/20" />
      
      <div className="relative">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-b border-border/40 bg-muted/20"
        >
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-brand-light rounded-full animate-pulse" />
                <Badge variant="outline" className="border-brand-light/30 text-brand-light">
                  Stay Updated
                </Badge>
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground via-brand-light to-brand-accent bg-clip-text text-transparent">
                Get the Latest AML Intelligence
              </h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                Stay ahead of financial crime with our weekly insights, regulatory updates, and platform news.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background/50 border-border/60"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-brand-light to-brand-accent hover:from-brand-light/80 hover:to-brand-accent/80 px-6"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? <Verified className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-success-green text-sm mt-3 flex items-center justify-center space-x-1"
                >
                  <Verified className="h-4 w-4" />
                  <span>Thank you for subscribing!</span>
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="mb-6">
                <Link to="/" className="flex items-center space-x-3 mb-4">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F826ace91fdc34714bf7a23bdee716138?format=webp&width=800"
                    alt="Sentrysol Logo"
                    className="h-10 w-auto"
                  />
                  <div>
                    <span className="font-bold text-2xl font-poppins bg-gradient-to-r from-brand-light to-brand-accent bg-clip-text text-transparent">
                      Sentrysol
                    </span>
                    <Badge variant="secondary" className="ml-2 text-xs bg-brand-light/10 text-brand-light border-brand-light/20">
                      Beta
                    </Badge>
                  </div>
                </Link>
                
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Advanced AI-powered AML compliance and blockchain intelligence platform. 
                  Empowering financial institutions with real-time risk assessment and regulatory compliance.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
                      <Building className="h-4 w-4" />
                    </div>
                    <span>Sentrysol Technologies Inc.</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>San Francisco, CA & London, UK</span>
                  </div>
                  
                  <Link to="/contact" className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-brand-light transition-colors group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 group-hover:bg-brand-light/10">
                      <Email className="h-4 w-4 group-hover:text-brand-light transition-colors" />
                    </div>
                    <span>contact@sentrysol.com</span>
                  </Link>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 hover:bg-brand-light/10 hover:text-brand-light transition-all duration-200 group"
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-brand-light to-brand-accent rounded-full" />
                <span>Products</span>
              </h4>
              <ul className="space-y-3">
                {productLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-brand-light transition-colors duration-200 group"
                      >
                        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-brand-accent to-brand-light rounded-full" />
                <span>Company</span>
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-brand-accent transition-colors duration-200 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources & Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-success-green to-brand-light rounded-full" />
                <span>Resources</span>
              </h4>
              <ul className="space-y-3 mb-8">
                {resourceLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-success-green transition-colors duration-200 group"
                      >
                        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              
              <h5 className="font-medium text-foreground mb-4 text-sm">Legal</h5>
              <ul className="space-y-2">
                {legalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                      >
                        <Icon className="h-3 w-3 group-hover:scale-110 transition-transform" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </div>

        <Separator className="opacity-30" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-brand-light" />
                <span>SOC 2 Type II Compliant</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Verified className="h-4 w-4 text-success-green" />
                <span>GDPR Ready</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sentrysol Technologies Inc. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
