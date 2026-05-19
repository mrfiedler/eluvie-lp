
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const { t, localPath } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <section className="section bg-[#202020] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 to-purple-900/10 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-2xl p-8 md:p-12 shadow-2xl relative" style={{ backgroundClip: 'padding-box', border: '1px solid transparent', backgroundImage: 'linear-gradient(#1a1a1a, #1a1a1a), var(--color-brand-gradient)', backgroundOrigin: 'border-box' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('ready-to-simplify')}</h2>
            <p className="text-lg text-gray-300">
              {t('join-thousands')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              className="w-full sm:w-auto text-base py-6 px-8 bg-brand-gradient hover:opacity-90 transition-opacity"
              onClick={() => navigate(localPath("/coming-soon"))}
            >
              {t('try-eluvie-free')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="brandSecondary"
              className="w-full sm:w-auto text-base py-6 px-8"
              onClick={() => navigate(localPath("/coming-soon"))}
            >
              {t('schedule-demo')}
            </Button>
          </div>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            {t('no-credit-card')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
