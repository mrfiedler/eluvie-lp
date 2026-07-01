
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DiagnosticCTASection from '@/components/DiagnosticCTASection';
import HowItWorksSection from '@/components/HowItWorksSection';
import AudienceSection from '@/components/AudienceSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import ComparisonSection from '@/components/ComparisonSection';
import CTASection from '@/components/CTASection';
import FAQSection from '@/components/FAQSection';
import SavingsCalculatorSection from '@/components/SavingsCalculatorSection';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

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
      <HeroSection />
      <DiagnosticCTASection />
      <HowItWorksSection />
      <AudienceSection />
      <FeaturesSection />
      <PricingSection />
      <ComparisonSection />
        <SavingsCalculatorSection />
        <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
