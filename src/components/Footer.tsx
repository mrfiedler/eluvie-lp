
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Footer = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <footer className="bg-[#1a1a1a] border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-medium text-white mb-4">{t('company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('blog-nav')}
                </Link>
              </li>
              <li>
                <Link to="/diagnostic" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('diagnostic-nav')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('privacy-nav')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('terms-nav')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/eluvie.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  {t('contact')}
                  <Instagram className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">{t('product')}</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#how-it-works" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('how-it-works');
                  }}
                >
                  {language === 'en' ? 'How Eluvie Works' : 'Como a Eluvie Funciona'}
                </a>
              </li>
              <li>
                <a 
                  href="#features" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('features');
                  }}
                >
                  {t('features')}
                </a>
              </li>
              <li>
                <a 
                  href="#pricing" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('pricing');
                  }}
                >
                  {t('pricing')}
                </a>
              </li>
              <li>
                <a 
                  href="#waitlist" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('waitlist');
                  }}
                >
                  {language === 'en' ? 'Waitlist' : 'Lista de Espera'}
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-2">
            <div className="flex space-x-4 mb-4">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/16dc7938-88ea-46da-9ce5-56e9b9900220.png"
                  alt="Eluvie Logo" 
                  className="h-8" 
                />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:bg-[#2a2a2a] transition-colors"
                    aria-label="Select language"
                  >
                    <span className="text-base leading-none">{language === 'pt-BR' ? '🇧🇷' : '🇺🇸'}</span>
                    <span className="text-xs font-semibold">{language === 'pt-BR' ? 'PT' : 'EN'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={4}
                  className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0 p-1 bg-[#202020] border-gray-700"
                >
                  <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={`cursor-pointer text-xs font-semibold flex items-center gap-1.5 px-2 py-1 rounded-sm hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:text-white ${language === 'en' ? 'text-white bg-[#2a2a2a]/60' : 'text-gray-300'}`}
                  >
                    <span className="text-sm leading-none">🇺🇸</span> EN
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage('pt-BR')}
                    className={`cursor-pointer text-xs font-semibold flex items-center gap-1.5 px-2 py-1 rounded-sm hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:text-white ${language === 'pt-BR' ? 'text-white bg-[#2a2a2a]/60' : 'text-gray-300'}`}
                  >
                    <span className="text-sm leading-none">🇧🇷</span> PT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-gray-400 text-sm">
              {language === 'en' 
                ? 'Eluvie is a financial platform designed specifically for creative professionals and agencies. Manage finances, invoices, projects, and subscriptions, all in one place.' 
                : 'A Eluvie é uma plataforma financeira projetada especificamente para profissionais e agências criativas. Gerencie finanças, faturas, projetos e assinaturas, tudo em um só lugar.'}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Eluvie. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
