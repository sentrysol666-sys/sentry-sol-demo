import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu as MenuIcon,
  Search,
  Close as XIcon,
} from "@mui/icons-material";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigationItems = [
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleConnectWallet = () => {
    navigate("/dashboard");
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[min(90vw,1500px)]"
    >
      <div className="relative">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-[100px] shadow-2xl" />
        
        {/* Navigation content */}
        <div className="relative flex items-center justify-between px-5 lg:px-8 py-7 h-[120px]">
          {/* Logo */}
          <Link to="/" className="flex items-center z-10">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/47ee3c2af2845a8357220360ddf773d731c9ce1a?width=750"
              alt="Logo"
              className="w-[375px] h-[65px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navigationItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.href}
                  className={`text-white font-poppins text-2xl font-medium transition-all duration-300 hover:text-white/80 ${
                    isActive(item.href) ? "text-white" : "text-white/90"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            
            {/* Connect Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleConnectWallet}
                className="bg-white text-black font-poppins text-2xl font-medium px-8 py-3 rounded-[30px] hover:bg-white/90 transition-all duration-300 h-[44px] min-w-[124px]"
              >
                Connect
              </Button>
            </motion.div>
          </div>

          {/* Search Box */}
          <div className="hidden lg:flex relative">
            <div className="relative w-[256px] h-[43px]">
              <div className="absolute inset-0 border border-white/47 rounded-[100px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
              <Input
                ref={searchInputRef}
                placeholder="I'am looking for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="absolute inset-0 bg-transparent border-0 text-white placeholder:text-white/57 font-poppins text-sm italic px-6 pr-12 rounded-[100px] focus:outline-none focus:ring-0"
              />
              <div className="absolute right-[9px] top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                <Search className="w-[18px] h-[18px] text-white/35" />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/95 backdrop-blur-lg border-white/20">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2 text-white">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/47ee3c2af2845a8357220360ddf773d731c9ce1a?width=750"
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                </SheetTitle>
                <SheetDescription className="text-white/70">
                  Navigation Menu
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-8 space-y-4">
                {/* Mobile Search */}
                <div className="relative mb-6">
                  <Input
                    placeholder="I'am looking for..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 rounded-full pl-4 pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                </div>
                
                {/* Mobile Navigation Items */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-white font-poppins text-xl py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Connect Button */}
                <Button
                  onClick={() => {
                    handleConnectWallet();
                    setIsOpen(false);
                  }}
                  className="w-full bg-white text-black font-poppins text-xl font-medium py-3 rounded-full hover:bg-white/90 transition-colors mt-6"
                >
                  Connect
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
