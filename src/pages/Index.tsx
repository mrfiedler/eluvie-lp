
import { useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DiagnosticCTASection from '@/components/DiagnosticCTASection';
import HowItWorksSection from '@/components/HowItWorksSection';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy-load below-the-fold sections so they don't block the initial paint.
const AudienceSection = lazy(() => import('@/components/AudienceSection'));
const FeaturesSection = lazy(() => import('@/components/FeaturesSection'));
const PricingSection = lazy(() => import('@/components/PricingSection'));
const ComparisonSection = lazy(() => import('@/components/ComparisonSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const FAQSection = lazy(() => import('@/components/FAQSection'));
const SavingsCalculatorSection = lazy(() => import('@/components/SavingsCalculatorSection'));

const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (attempt < 10) {
          setTimeout(() => tryScroll(attempt + 1), 100);
        }
      };
      tryScroll();
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100 overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <DiagnosticCTASection />
        <HowItWorksSection />
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <AudienceSection />
          <FeaturesSection />
          <PricingSection />
          <ComparisonSection />
          <SavingsCalculatorSection />
          <CTASection />
          <FAQSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
