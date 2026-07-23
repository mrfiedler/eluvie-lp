
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

  // Inject VideoObject JSON-LD only on the homepage (the only page that
  // actually embeds the YouTube video). Global injection triggers GSC
  // "Video is not on a watch page" on every unrelated route.
  useEffect(() => {
    const id = 'ld-video-home';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'Eluvie demonstration video',
      description:
        'Veja como a Eluvie organiza clientes, contratos, receitas e despesas em um único painel para profissionais criativos.',
      thumbnailUrl: 'https://i.ytimg.com/vi/c3m8qhBUaDE/maxresdefault.jpg',
      uploadDate: '2025-01-01T00:00:00+00:00',
      contentUrl: 'https://www.youtube.com/watch?v=c3m8qhBUaDE',
      embedUrl: 'https://www.youtube.com/embed/c3m8qhBUaDE',
      publisher: {
        '@type': 'Organization',
        name: 'Eluvie',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.eluvie.com/lovable-uploads/0da950c7-6e18-4083-8c37-72fc551f9225.png',
        },
      },
    });
    return () => {
      const node = document.getElementById(id);
      if (node) node.remove();
    };
  }, []);

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
