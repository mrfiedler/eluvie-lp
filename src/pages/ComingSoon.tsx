
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import WaitlistForm from '@/components/WaitlistForm';
import SuccessMessage from '@/components/SuccessMessage';
import { convertToEmbedUrl } from '@/hooks/useVideoUrls';

const ComingSoon = () => {
  const { t, language, localPath } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const videoUrl = 'https://www.youtube.com/embed/c3m8qhBUaDE?start=10&autoplay=1&mute=1&loop=1&playlist=c3m8qhBUaDE&rel=0';
  
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <Link to={localPath('/')} className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/16dc7938-88ea-46da-9ce5-56e9b9900220.png"
            alt="Eluvie Logo" 
            className="h-8" 
          />
        </Link>
        <Link 
          to={localPath('/')} 
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          {language === 'en' ? 'Back to Home' : 'Voltar para Início'}
        </Link>
      </div>
      
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('join-waitlist')}
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              {t('be-first')}
            </p>
            
            {isSubmitted ? (
              <SuccessMessage className="bg-[#202020]/70" />
            ) : (
              <WaitlistForm 
                onSuccess={() => setIsSubmitted(true)}
                buttonClassName="w-full py-6 bg-brand-gradient hover:opacity-90 transition-opacity"
              />
            )}
          </div>
        </div>
        
        <div className="md:w-1/2 bg-gradient-to-br from-[#202020] to-[#1a1a1a] p-6 md:p-0 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-lg p-6">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <iframe 
                className="w-full h-full"
                src={convertToEmbedUrl(videoUrl)} 
                title="Eluvie demonstration video" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-2">
                {language === 'en' ? 'Get a sneak peek' : 'Veja uma prévia'}
              </h3>
              <p className="text-gray-300">
                {language === 'en' 
                  ? 'Watch our demo video to see what Eluvie has to offer.' 
                  : 'Assista ao nosso vídeo de demonstração para ver o que a Eluvie tem a oferecer.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
