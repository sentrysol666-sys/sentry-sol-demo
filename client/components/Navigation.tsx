import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  Shield,
  BarChart3,
  Search,
  FileText,
  Settings,
  Users,
  Bell,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Wallet Screening", href: "/wallet-screening", icon: Search },
    { name: "Case Management", href: "/cases", icon: FileText },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Compliance", href: "/compliance", icon: Shield },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-aml-blue to-compliance-green rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-aml-blue to-compliance-green bg-clip-text text-transparent">
              Sentrysol
            </span>
            <Badge variant="secondary" className="text-xs bg-aml-blue/10 text-aml-blue">
              Beta
            </Badge>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isActive(item.href)
                      ? "bg-aml-blue/10 text-aml-blue"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-risk-red rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder-avatar.png" alt="User" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm">AML Investigator</span>
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
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gradient-to-br from-aml-blue to-compliance-green rounded flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span>Sentrysol</span>
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
                            ? "bg-aml-blue/10 text-aml-blue"
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
    </nav>
  );
}
