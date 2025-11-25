import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const exploreLinks = [
    { name: "Press & Media", href: "/press" },
    { name: "Community", href: "/community" },
    { name: "Contact", href: "/contact" },
  ];

  const resourceLinks = [
    { name: "Whitepaper", href: "/whitepaper" },
    { name: "Documentation", href: "/docs" },
    { name: "Integration", href: "/integration" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <footer className="relative bg-[#2C3333] text-white">
      <div className="container mx-auto px-4 lg:px-[200px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-poppins text-[18px] font-semibold mb-6 leading-[30px]">
              Join a Newsletter
            </h3>

            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div>
                <label className="block text-white/63 font-poppins text-[16px] mb-2 leading-[30px]">
                  Your Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.02] border-0 rounded-[10px] h-[51px] px-6 text-white placeholder:text-white/63 font-poppins text-[16px]"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-gradient-to-b from-white/12 to-white/0 border border-white/0 rounded-[10px] px-8 py-5 h-[51px] text-white font-poppins text-[16px] hover:bg-white/10 transition-all duration-200"
                disabled={isSubscribed}
              >
                {isSubscribed ? "Subscribed!" : "Submit"}
              </Button>
            </form>

            {/* Social Media */}
            <div className="mt-16 pt-8">
              <motion.a
                href="https://twitter.com/sentrysol"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center w-[53px] h-[53px] rounded-full bg-gradient-to-b from-white/5 to-white/0 border border-white/30 hover:border-white/50 transition-all duration-200"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M38.2615 19.0621C37.3381 19.4627 36.3617 19.7275 35.3624 19.8483C36.4166 19.2185 37.2066 18.2278 37.5859 17.0598C36.5952 17.6496 35.5108 18.065 34.3797 18.2882C33.6237 17.4684 32.6169 16.9226 31.5173 16.7366C30.4177 16.5506 29.2874 16.7348 28.3038 17.2603C27.3201 17.7859 26.5387 18.623 26.0821 19.6405C25.6255 20.658 25.5196 21.7983 25.7809 22.8825C23.7779 22.7812 21.8186 22.2596 20.0303 21.3517C18.242 20.4438 16.6647 19.1699 15.4008 17.6126C14.9576 18.3867 14.7246 19.2634 14.7252 20.1554C14.7236 20.9838 14.9269 21.7998 15.317 22.5306C15.7071 23.2615 16.2718 23.8845 16.9609 24.3443C16.16 24.3225 15.3761 24.1076 14.6761 23.7178V23.7792C14.6821 24.9399 15.0888 26.0629 15.8275 26.9583C16.5662 27.8537 17.5914 28.4664 18.7298 28.6929C18.2916 28.8262 17.8366 28.8965 17.3786 28.9017C17.0615 28.898 16.7452 28.8692 16.4327 28.8157C16.7569 29.8142 17.3843 30.6867 18.2275 31.312C19.0707 31.9373 20.0879 32.2842 21.1375 32.3044C19.3652 33.6989 17.177 34.46 14.9218 34.4664C14.5112 34.4677 14.1009 34.4431 13.6934 34.3927C15.9959 35.8793 18.6792 36.6686 21.42 36.6652C23.3114 36.6849 25.1877 36.3274 26.9394 35.6138C28.6911 34.9002 30.283 33.8446 31.6222 32.5089C32.9614 31.1731 34.021 29.5839 34.7391 27.8341C35.4572 26.0842 35.8195 24.2088 35.8047 22.3174C35.8047 22.1086 35.8047 21.8875 35.8047 21.6664C36.7686 20.9475 37.6 20.0663 38.2615 19.0621Z"
                    fill="white"
                    transform="scale(0.5) translate(-20, -10)"
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Explore Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h4 className="text-white font-poppins text-[18px] font-semibold mb-6 leading-[30px]">
              Explore
            </h4>
            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/63 font-poppins text-[16px] leading-[49px] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h4 className="text-white font-poppins text-[18px] font-semibold mb-6 leading-[30px]">
              Resources
            </h4>
            <ul className="space-y-4">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/63 font-poppins text-[16px] leading-[49px] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/12d981b08bdd510564c341e41e3b6d35e0500386?width=78"
                  alt="Logo"
                  className="w-[39px] h-[39px]"
                />
                <span className="text-white font-poppins text-[20px] font-semibold">
                  SENTRYSOL
                </span>
              </div>

              <p className="text-white/63 font-poppins text-[16px] leading-[30px]">
                SentrySol is an AI-native, on-device behavioral security
                framework built specifically for Web3 mobile environments,
                initially focusing on Solana Mobile Seeker.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider and Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 pt-8 border-t border-white/15"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <Link
              to="/linkedin"
              className="text-white font-poppins text-[16px] font-medium leading-[30px] hover:text-white/80 transition-colors"
            >
              LinkedIn
            </Link>

            <div className="text-white/63 font-poppins text-[16px] leading-[30px]">
              SentrySol, 2025
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
