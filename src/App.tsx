
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Careers from "./pages/Careers";
import ComingSoon from "./pages/ComingSoon";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Diagnostic from "./pages/Diagnostic";
import CalculadoraValorHora from "./pages/CalculadoraValorHora";
import NotaFiscalMei from "./pages/NotaFiscalMei";
import PrecificarServicos from "./pages/PrecificarServicos";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";
import WhatsAppButton from "./components/WhatsAppButton";
import SEO from "./components/SEO";
import { lazy, Suspense } from "react";

const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">Loading...</div>;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Suspense fallback={<div className="min-h-screen bg-[#1a1a1a]" />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/diagnostic" element={<Diagnostic />} />
      <Route path="/calculadora-valor-hora" element={<CalculadoraValorHora />} />
      <Route path="/nota-fiscal-mei" element={<NotaFiscalMei />} />
      <Route path="/precificar-servicos" element={<PrecificarServicos />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SEO />
            <AppRoutes />
            <CookieConsent />
            <WhatsAppButton />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
