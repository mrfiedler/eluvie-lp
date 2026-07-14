
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import YouTubeFacade from '@/components/YouTubeFacade';

const HowItWorksSection = () => {
  const { t } = useLanguage();
  const videoId = 'c3m8qhBUaDE';
  const getCleanVideoUrl = () => `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <section id="how-it-works" className="section bg-[#1a1a1a] py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('how-it-works')}</h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            {t('how-it-works-subtitle')}
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto mb-20" id="eluvie-video-section">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <AspectRatio ratio={16/9}>
              <YouTubeFacade
                videoId={videoId}
                title="Eluvie demonstration video"
                params="autoplay=1&rel=0&start=10"
                thumbnailQuality="maxresdefault"
              />
            </AspectRatio>
          </div>
          
          <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
            <Button 
              className="rounded-full h-12 px-6"
              onClick={() => window.open(getCleanVideoUrl())}
            >
              <Play className="h-5 w-5 mr-2" />
              {t('watch-demo')}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
          <div className="text-center p-6 rounded-xl bg-[#202020] border border-gray-700">
            <div className="h-14 w-14 bg-brand-violet/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-7 w-7 text-brand-violet" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('track-income')}</h3>
            <p className="text-gray-400">{t('track-income-desc')}</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-[#202020] border border-gray-700">
            <div className="h-14 w-14 bg-brand-purple/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-7 w-7 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('create-budgets')}</h3>
            <p className="text-gray-400">{t('create-budgets-desc')}</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-[#202020] border border-gray-700">
            <div className="h-14 w-14 bg-brand-violet/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-7 w-7 text-brand-violet" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('monitor-subscriptions')}</h3>
            <p className="text-gray-400">{t('monitor-subscriptions-desc')}</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-[#202020] border border-gray-700">
            <div className="h-14 w-14 bg-brand-purple/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-7 w-7 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('get-rewarded')}</h3>
            <p className="text-gray-400">{t('get-rewarded-desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
