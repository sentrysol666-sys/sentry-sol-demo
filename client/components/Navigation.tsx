import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu as MenuIcon,
  Security as Shield,
  BarChart as BarChart3,
  Search,
  Description as FileText,
  Settings,
  Groups as Users,
  Notifications as Bell,
  KeyboardArrowDown as ChevronDown,
  Person as User,
  Logout as LogOut,
  HelpOutline as HelpCircle,
  AccountBalanceWallet as Wallet,
  CheckCircle,
  Cancel as XCircle,
  SearchOff,
  Keyboard,
  TrendingUp,
  Warning,
  Info,
  NotificationsActive,
  DarkMode,
  LightMode,
  Language,
} from "@mui/icons-material";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      title: "High Risk Transaction Detected",
      message: "Wallet 0x742d...8a9b flagged for suspicious activity",
      timestamp: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "info",
      title: "AML Report Generated",
      message: "Weekly compliance report is ready for review",
      timestamp: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "success",
      title: "System Update Complete",
      message: "Risk scoring algorithms updated successfully",
      timestamp: "3 hours ago",
      unread: false,
    },
  ]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected, connectedWallets, activeWallet } =
    useWalletIntegration();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      description: "Overview and key metrics"
    },
    {
      name: "AML Investigation",
      href: "/aml-dashboard",
      icon: Shield,
      description: "Anti-money laundering tools"
    },
    {
      name: "Wallet Screening",
      href: "/wallet-screening",
      icon: Search,
      description: "Analyze wallet addresses"
    },
    {
      name: "Case Management",
      href: "/cases",
      icon: FileText,
      description: "Manage investigation cases"
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Risk analytics and reporting"
    },
    {
      name: "Compliance",
      href: "/compliance",
      icon: Shield,
      description: "Regulatory compliance tools"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Platform configuration"
    },
  ];

  const searchableItems = [
    ...navigationItems,
    { name: "New Case", href: "/cases/new", icon: FileText, description: "Create investigation case" },
    { name: "Risk Reports", href: "/reports", icon: TrendingUp, description: "View risk assessment reports" },
    { name: "User Management", href: "/users", icon: Users, description: "Manage team members" },
    { name: "API Documentation", href: "/docs", icon: FileText, description: "Integration guides" },
  ];

  const filteredItems = searchableItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (href: string) => {
    navigate(href);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F826ace91fdc34714bf7a23bdee716138?format=webp&width=800"
              alt="Sentrysol Logo"
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl font-poppins bg-gradient-to-r from-brand-light to-brand-accent bg-clip-text text-transparent">
              Sentrysol
            </span>
            <Badge
              variant="secondary"
              className="text-xs bg-brand-light/10 text-brand-light border-brand-light/20"
            >
              Beta
            </Badge>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-brand-light/10 text-brand-light shadow-sm border border-brand-light/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </Button>
                </Link>
              </motion.div>
            );
          })}

          {/* More Menu for additional items */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <span>More</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              {navigationItems.slice(5).map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Global Search */}
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 w-64 justify-start text-muted-foreground">
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">Search...</span>
                <div className="flex items-center space-x-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                  <Keyboard className="h-3 w-3" />
                  <span>⌘K</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <Command>
                <CommandInput
                  ref={searchInputRef}
                  placeholder="Search pages, features, and tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0"
                />
                <CommandList className="max-h-80">
                  {filteredItems.length === 0 ? (
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                      <SearchOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No results found.
                    </CommandEmpty>
                  ) : (
                    <CommandGroup heading="Navigation">
                      {filteredItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <CommandItem
                            key={item.name}
                            onSelect={() => handleSearch(item.href)}
                            className="flex items-center space-x-3 py-3 cursor-pointer"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Wallet Status */}
          <div className="hidden md:flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success-green" />
                <span className="text-xs text-success-green">
                  {activeWallet === "solana" ? "Solana" : "Ethereum"} Connected
                </span>
                {connectedWallets.solana && (
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                )}
                {connectedWallets.ethereum && (
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-warning-amber" />
                <span className="text-xs text-warning-amber font-medium">
                  Connect Wallet Required
                </span>
              </div>
            )}
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                {unreadNotifications > 0 ? (
                  <NotificationsActive className="h-4 w-4 text-warning-amber" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-risk-red text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadNotifications} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => {
                  const getIcon = () => {
                    switch (notification.type) {
                      case 'warning': return <Warning className="h-4 w-4 text-warning-amber" />;
                      case 'success': return <CheckCircle className="h-4 w-4 text-success-green" />;
                      default: return <Info className="h-4 w-4 text-blue-500" />;
                    }
                  };

                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start space-y-1 p-3 cursor-pointer ${
                        notification.unread ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-2 w-full">
                        {getIcon()}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {notification.title}
                            </p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
              {notifications.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder-avatar.png" alt="User" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm">
                  AML Investigator
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fa00bfe7e1f794ae8a236be99e51db530%2F826ace91fdc34714bf7a23bdee716138?format=webp&width=800"
                    alt="Sentrysol Logo"
                    className="h-6 w-auto"
                  />
                  <span className="font-poppins">Sentrysol</span>
                </SheetTitle>
                <SheetDescription>
                  AI-Powered AML/Compliance Platform
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          isActive(item.href)
                            ? "bg-brand-light/10 text-brand-light"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
