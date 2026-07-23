
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { APP_URL } from '@/lib/urls';

interface FeatureItem {
  key: string;
  available: boolean;
}

interface FeatureCategory {
  titleKey: string;
  features: FeatureItem[];
}

const PricingSection = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const soloFeatures: FeatureCategory[] = [
    {
      titleKey: 'category-financial',
      features: [
        { key: 'solo-dashboard-limited', available: true },
        { key: 'solo-revenues', available: true },
        { key: 'solo-expenses', available: true },
      ],
    },
    {
      titleKey: 'category-clients',
      features: [
        { key: 'solo-clients', available: true },
      ],
    },
    {
      titleKey: 'category-recurrence',
      features: [
        { key: 'solo-recurrence-unavailable', available: false },
      ],
    },
    {
      titleKey: 'category-operation',
      features: [
        { key: 'solo-users', available: true },
      ],
    },
  ];

  const standardFeatures: FeatureCategory[] = [
    {
      titleKey: 'category-financial',
      features: [
        { key: 'standard-dashboard-complete', available: true },
        { key: 'standard-revenues', available: true },
        { key: 'standard-expenses', available: true },
      ],
    },
    {
      titleKey: 'category-clients',
      features: [
        { key: 'standard-clients', available: true },
        { key: 'standard-contracts', available: true },
        { key: 'standard-budget-invoice', available: true },
      ],
    },
    {
      titleKey: 'category-recurrence',
      features: [
        { key: 'standard-recurrence-unavailable', available: false },
      ],
    },
    {
      titleKey: 'category-operation',
      features: [
        { key: 'standard-users', available: true },
      ],
    },
  ];

  const studioFeatures: FeatureCategory[] = [
    {
      titleKey: 'category-financial',
      features: [
        { key: 'studio-dashboard-complete', available: true },
        { key: 'studio-unlimited-revenues', available: true },
        { key: 'studio-unlimited-expenses', available: true },
      ],
    },
    {
      titleKey: 'category-clients',
      features: [
        { key: 'studio-clients', available: true },
        { key: 'studio-contracts', available: true },
        { key: 'studio-budget-revenue', available: true },
      ],
    },
    {
      titleKey: 'category-recurrence',
      features: [
        { key: 'studio-subscriptions', available: true },
        { key: 'studio-indicators', available: true },
      ],
    },
    {
      titleKey: 'category-operation',
      features: [
        { key: 'studio-users', available: true },
      ],
    },
  ];

  const renderFeatures = (categories: FeatureCategory[]) => (
    <div className="mt-8 space-y-6">
      {categories.map((category, catIndex) => (
        <div key={catIndex}>
          <h4 className="text-sm font-semibold text-brand-magenta mb-3">{t(category.titleKey)}</h4>
          <ul className="space-y-2">
            {category.features.map((feature, featIndex) => (
              <li key={featIndex} className="flex items-start">
                {feature.available ? (
                  <Check className="h-5 w-5 text-brand-violet mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                )}
               <span className={feature.available ? 'text-gray-300' : 'text-gray-400'}>
                  {t(feature.key)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
  
  return (
    <section id="pricing" className="section pt-24 pb-16 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('pricing-title')}</h2>
          <p className="text-lg text-gray-400">
            {t('pricing-subtitle')}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Solo Plan */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-700 overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col">
            <div className="p-8 flex flex-col flex-1">
              {/* Header section - fixed height */}
              <div className="min-h-[140px]">
                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-brand-gradient inline-block">{t('solo-plan')}</h3>
                <div className="text-3xl font-bold mb-1">{t('solo-price')}</div>
               <p className="text-xs text-gray-400 mb-2 invisible" aria-hidden="true">placeholder</p>
                <p className="text-sm text-gray-400">{t('solo-for')}</p>
              </div>
              
              <Button
                asChild
                className="w-full py-5 bg-brand-gradient hover:opacity-90 transition-opacity mt-4"
              >
                <a href={APP_URL}>{t('get-started-free')}</a>
              </Button>
              
              <div className="flex-1">
                {renderFeatures(soloFeatures)}
              </div>
            </div>
          </div>
          
          {/* Standard Plan */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-700 overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col">
            <div className="p-8 flex flex-col flex-1">
              {/* Header section - fixed height */}
              <div className="min-h-[140px]">
                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-brand-gradient inline-block">{t('standard-plan')}</h3>
                <div className="text-3xl font-bold mb-1">{t('standard-price')}</div>
               <p className="text-xs text-gray-400 mb-2">{t('standard-annual-disclaimer')}</p>
                <p className="text-sm text-gray-400">{t('standard-for')}</p>
              </div>
              
              <Button
                asChild
                className="w-full py-5 bg-brand-gradient hover:opacity-90 transition-opacity mt-4"
              >
                <a href={APP_URL}>{t('start-trial')}</a>
              </Button>
              
              <div className="flex-1">
                {renderFeatures(standardFeatures)}
              </div>
            </div>
          </div>
          
          {/* Studio Plan - Popular */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-brand-violet overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 relative lg:scale-105 z-10 flex flex-col">
            <div className="absolute top-0 right-0">
              <div className="bg-brand-violet text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                {t('popular')}
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              {/* Header section - fixed height */}
              <div className="min-h-[140px]">
                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-brand-gradient inline-block">{t('studio-plan')}</h3>
                <div className="text-3xl font-bold mb-1">{t('studio-price')}</div>
               <p className="text-xs text-gray-400 mb-2">{t('studio-annual-disclaimer')}</p>
                <p className="text-sm text-gray-400">{t('studio-for')}</p>
              </div>
              
              <Button
                asChild
                className="w-full py-5 bg-brand-gradient hover:opacity-90 transition-opacity mt-4"
              >
                <a href={APP_URL}>{t('start-trial')}</a>
              </Button>
              
              <div className="flex-1">
                {renderFeatures(studioFeatures)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400">{t('all-plans-include')}</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
