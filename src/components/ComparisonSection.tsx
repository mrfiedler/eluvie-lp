
import { Check, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ComparisonSection = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <section className="section bg-[#1a1a1a]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('competitor-table')}</h2>
          <p className="text-lg text-gray-400">
            {t('competitor-subtitle')}
          </p>
        </div>
        
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[800px] px-4 sm:px-0">
            <table className="min-w-full bg-[#202020] rounded-xl shadow-md border border-gray-700">
              <thead>
                <tr>
                  <th className="py-5 px-4 md:px-6 text-left text-gray-400 font-normal text-sm">{t('feature')}</th>
                  <th className="py-5 px-4 md:px-6 text-center">
                    <div className="flex flex-col items-center">
                       <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2 overflow-hidden">
                         <img
                           src="/lovable-uploads/comparison.webp"
                           alt="Eluvie"
                           className="w-full h-full object-cover"
                           width={40}
                           height={40}
                           loading="lazy"
                           decoding="async"
                         />
                      </div>
                      <span className="font-semibold text-white">Eluvie</span>
                    </div>
                  </th>
                  <th className="py-5 px-4 md:px-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-2">
                        <span className="text-gray-300 font-bold">CA</span>
                      </div>
                      <span className="font-semibold text-gray-300">Conta Azul</span>
                    </div>
                  </th>
                  <th className="py-5 px-4 md:px-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-2">
                        <span className="text-gray-300 font-bold">QB</span>
                      </div>
                      <span className="font-semibold text-gray-300">QuickBooks</span>
                    </div>
                  </th>
                  <th className="py-5 px-4 md:px-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-2">
                        <span className="text-gray-300 font-bold">N</span>
                      </div>
                      <span className="font-semibold text-gray-300">Nibo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="py-4 px-4 md:px-6 text-gray-300">{t('built-for-creatives')}</td>
                  <td className="py-4 px-4 md:px-6 text-center"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 md:px-6 text-gray-300">{t('simple-interface')}</td>
                  <td className="py-4 px-4 md:px-6 text-center"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 md:px-6 text-gray-300">{t('gamification')}</td>
                  <td className="py-4 px-4 md:px-6 text-center"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 md:px-6 text-gray-300">{t('budget-invoice')}</td>
                  <td className="py-4 px-4 md:px-6 text-center"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 md:px-6 text-gray-300">{t('sub-tracking')}</td>
                  <td className="py-4 px-4 md:px-6 text-center"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 md:px-6 text-gray-300">{t('affordable')}</td>
                  <td className="py-4 px-4 md:px-6 text-center"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto" /></td>
                  <td className="py-4 px-4 md:px-6 text-center"><X className="h-5 w-5 text-red-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
