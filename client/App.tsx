import "./global.css";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MultiChainWalletProvider } from "./contexts/MultiChainWalletContext";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import WalletScreening from "./pages/WalletScreening";
import AMLDashboard from "./pages/AMLDashboard";
import Cases from "./pages/Cases";
import Analytics from "./pages/Analytics";
import Compliance from "./pages/Compliance";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component that conditionally shows navigation
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background dark">
      {!isHomePage && <Navigation />}
      {children}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MultiChainWalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/help" element={<Help />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet-screening"
                element={
                  <ProtectedRoute requireWallet={false}>
                    <WalletScreening />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aml-dashboard"
                element={
                  <ProtectedRoute>
                    <AMLDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases"
                element={
                  <ProtectedRoute>
                    <Cases />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compliance"
                element={
                  <ProtectedRoute>
                    <Compliance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </MultiChainWalletProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
