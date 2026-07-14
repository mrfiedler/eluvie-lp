
import { Shield, Sparkles, BarChart3, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <BarChart3 className="h-10 w-10 text-brand-violet" />,
      title: t('feature-1-title'),
      description: t('feature-1-desc')
    },
    {
      icon: <Clock className="h-10 w-10 text-brand-purple" />,
      title: t('feature-2-title'),
      description: t('feature-2-desc')
    },
    {
      icon: <Sparkles className="h-10 w-10 text-brand-violet" />,
      title: t('feature-3-title'),
      description: t('feature-3-desc')
    },
    {
      icon: <Shield className="h-10 w-10 text-brand-purple" />,
      title: t('feature-4-title'),
      description: t('feature-4-desc')
    }
  ];
  
  return (
    <section id="features" className="section bg-[#202020] relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('features-title')}</h2>
          <p className="text-lg text-gray-400">
            {t('features-subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="bg-brand-violet/10 rounded-lg p-3 inline-block mb-4 border border-brand-purple/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-[#1a1a1a] rounded-lg p-8 border border-gray-700 transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-white">{t('creative-freedom')}</h3>
              <p className="text-gray-300">{t('creative-freedom-desc')}</p>
            </div>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={`summary-${index}`} className="flex items-center gap-3">
                  <div className="bg-brand-violet/10 rounded-full p-1 h-fit border border-brand-purple/20">
                    <div className="h-2 w-2 rounded-full bg-brand-gradient" />
                  </div>
                  <p className="text-gray-300">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
