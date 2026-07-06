
import { User, Users, Paintbrush, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AudienceSection = () => {
  const { t } = useLanguage();
  
  const audiences = [
    {
      icon: <Users className="h-10 w-10 text-brand-violet" />,
      title: t('agencies-title'),
      description: t('agencies-desc')
    },
    {
      icon: <Share2 className="h-10 w-10 text-brand-purple" />,
      title: t('socialmedia-title'),
      description: t('socialmedia-desc')
    },
    {
      icon: <Paintbrush className="h-10 w-10 text-brand-violet" />,
      title: t('designers-title'),
      description: t('designers-desc')
    },
    {
      icon: <User className="h-10 w-10 text-brand-purple" />,
      title: t('freelancers-title'),
      description: t('freelancers-desc')
    }
  ];
  
  return (
    <section className="section bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('who-for')}</h2>
          <p className="text-lg text-gray-400">
            {t('who-for-subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <div key={index} className="feature-card flex flex-col items-center text-center">
              <div className="mb-5 rounded-full bg-brand-violet/10 p-3 shadow-sm border border-brand-purple/20">
                {audience.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{audience.title}</h3>
              <p className="text-gray-400">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
