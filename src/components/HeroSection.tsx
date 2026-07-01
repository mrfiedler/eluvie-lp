import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { APP_URL } from '@/lib/urls';
import { useIsMobile } from '@/hooks/use-mobile';
import avatar1 from '@/assets/avatar-1.png';
import avatar2 from '@/assets/avatar-2.png';
import avatar3 from '@/assets/avatar-3.png';

const HeroSection = () => {
  const { t, localPath } = useLanguage();
  const isMobile = useIsMobile();
  
  const scrollToVideo = () => {
    const videoSection = document.getElementById('eluvie-video-section');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="pt-20 md:pt-32 pb-16 md:pb-24 relative overflow-hidden bg-[#1a1a1a]">
      {/* Subtle gradient background elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              <span>{t('hero-title').split(' ').slice(0, -1).join(' ')}</span>
              <span className="text-brand-magenta"> {t('hero-title').split(' ').slice(-1)}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-lg">
              {t('hero-subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="flex items-center justify-center gap-2 text-base py-4 sm:py-6 px-6 sm:px-8 bg-brand-gradient hover:opacity-90 transition-opacity border-none w-full sm:w-auto"
              >
                <a href={APP_URL}>
                  {t('start-free')}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="brandSecondary"
                onClick={scrollToVideo} 
                className="flex items-center justify-center gap-2 text-base py-4 sm:py-6 px-6 sm:px-8 rounded-xl w-full sm:w-auto"
              >
                <div className="flex items-center justify-center">
                  <Play className="h-5 w-5" />
                </div>
                {t('how-works')}
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-400">
              <div className="flex -space-x-2 mr-3">
                <img className="h-8 w-8 rounded-full border-2 border-gray-800 object-cover" src={avatar1} alt="User" width={32} height={32} />
                <img className="h-8 w-8 rounded-full border-2 border-gray-800 object-cover" src={avatar2} alt="User" width={32} height={32} />
                <img className="h-8 w-8 rounded-full border-2 border-gray-800 object-cover" src={avatar3} alt="User" width={32} height={32} />
              </div>
              {t('trusted-by')}
            </div>
          </div>

          <div className="w-full lg:w-1/2 animate-fade-in animation-delay-300 lg:pl-10">
            <div className="relative">
              {/* Dashboard mockup */}
              <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-700 animate-float">
                <img src="/lovable-uploads/0da950c7-6e18-4083-8c37-72fc551f9225.png" alt="Eluvie Dashboard" className="w-full object-cover" />
              </div>
              
              {/* Floating notification card - updated for better mobile display */}
              <div style={{ animationDelay: '0.3s' }} className="absolute -bottom-6 sm:-bottom-10 -left-6 sm:-left-10 rounded-xl shadow-lg p-3 sm:p-4 max-w-[12rem] sm:max-w-[15rem] border border-gray-700 animate-float bg-eluvie-background">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 bg-brand-violet rounded-full"></div>
                  <p className="text-xs font-medium text-white">{t('payment-received')}</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-400">{t('payment-info')}</p>
              </div>
              
              {/* Gamification badge - updated for better mobile display */}
              <div style={{ animationDelay: '0.6s' }} className="absolute top-4 sm:top-8 -right-2 sm:-right-4 rounded-full shadow-lg p-2 sm:p-3 animate-float bg-eluvie-darkBg">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center bg-eluvie-card">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-brand-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
