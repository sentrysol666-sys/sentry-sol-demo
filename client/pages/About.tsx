import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Security as Shield,
  TrendingUp,
  Public as Globe,
  Group as Team,
  Verified,
  Business as Building,
  Timeline,
  Star as Award,
} from "@mui/icons-material";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-sentry-teal/50 to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sentry-teal/10 to-transparent" />
        <div className="container mx-auto max-w-4xl text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 border-sentry-mint/30 text-sentry-mint bg-sentry-mint/10">
              About Sentrysol
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-sentry-mint to-sentry-ice bg-clip-text text-transparent font-poppins leading-tight">
              Pioneering the Future of Financial Intelligence
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto font-poppins">
              We're building the world's most advanced AI-powered AML compliance platform, 
              empowering financial institutions to stay ahead of evolving threats while 
              maintaining seamless operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-light/10 rounded-lg">
                      <Shield className="h-6 w-6 text-brand-light" />
                    </div>
                    <CardTitle>Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    To democratize access to sophisticated financial crime detection tools, 
                    making advanced AML compliance affordable and accessible to institutions 
                    of all sizes while maintaining the highest standards of accuracy and efficiency.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-accent/10 rounded-lg">
                      <Globe className="h-6 w-6 text-brand-accent" />
                    </div>
                    <CardTitle>Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    A world where financial crime is effectively prevented through intelligent, 
                    real-time detection systems that protect global economic stability while 
                    preserving privacy and enabling innovation in financial services.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Institutions Worldwide</h2>
            <p className="text-muted-foreground">Our platform processes billions in transactions daily</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "99.7%", label: "Detection Accuracy", icon: Verified },
              { value: "50ms", label: "Average Response Time", icon: TrendingUp },
              { value: "150+", label: "Global Institutions", icon: Building },
              { value: "$2.5B", label: "Daily Transaction Volume", icon: Timeline },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-r from-brand-light/10 to-brand-accent/10 rounded-lg">
                      <Icon className="h-6 w-6 text-brand-light" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Led by Industry Experts</h2>
            <p className="text-muted-foreground">Our team combines decades of experience in fintech, compliance, and AI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "CEO & Co-Founder",
                background: "Former VP of Risk at Goldman Sachs, PhD in Machine Learning from MIT",
                image: "/placeholder-avatar.png"
              },
              {
                name: "Michael Rodriguez",
                role: "CTO & Co-Founder", 
                background: "Ex-Netflix Senior Engineering Manager, Expert in large-scale systems",
                image: "/placeholder-avatar.png"
              },
              {
                name: "Dr. James Wilson",
                role: "Head of Compliance",
                background: "20+ years in regulatory compliance, Former FINTRAC Director",
                image: "/placeholder-avatar.png"
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-brand-light/20 to-brand-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Team className="h-8 w-8 text-brand-light" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-brand-light text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.background}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Security First",
                description: "We prioritize the highest levels of security and data protection in everything we build.",
                icon: Shield,
              },
              {
                title: "Innovation",
                description: "Continuously pushing the boundaries of what's possible in financial crime detection.",
                icon: TrendingUp,
              },
              {
                title: "Transparency",
                description: "Open communication and clear methodologies build trust with our clients and partners.",
                icon: Verified,
              },
              {
                title: "Excellence",
                description: "We strive for perfection in our technology, service, and client relationships.",
                icon: Award,
              },
              {
                title: "Compliance",
                description: "Maintaining the highest standards of regulatory compliance across all jurisdictions.",
                icon: Building,
              },
              {
                title: "Collaboration",
                description: "Working together with clients and partners to achieve shared success.",
                icon: Team,
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-brand-light/10 rounded-lg">
                          <Icon className="h-5 w-5 text-brand-light" />
                        </div>
                        <h3 className="font-semibold">{value.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Mission?</h2>
            <p className="text-muted-foreground mb-8">
              Whether you're interested in our platform, career opportunities, or partnerships, 
              we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-brand-light to-brand-accent">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg">
                View Careers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
