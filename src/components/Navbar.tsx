
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { APP_URL } from '@/lib/urls';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t, localPath } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const LangSwitcher = ({ compact = false }: { compact?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-1.5 ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-md border border-gray-700 text-gray-300 hover:bg-[#2a2a2a] transition-colors`}
          aria-label="Select language"
        >
          <span className={compact ? 'text-sm leading-none' : 'text-base leading-none'}>
            {language === 'pt-BR' ? '🇧🇷' : '🇺🇸'}
          </span>
          <span className="text-xs font-semibold">{language === 'pt-BR' ? 'PT' : 'EN'}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
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
  );

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);

    const home = localPath('/');
    // If we're not on the homepage, navigate there first with the hash
    if (location.pathname !== home) {
      navigate(`${home}#${id}`);
      return;
    }
    
    // If we're already on the homepage, scroll to the section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={localPath('/')} className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/16dc7938-88ea-46da-9ce5-56e9b9900220.png"
              alt="Eluvie Logo" 
              className="h-8" 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            <a 
              href="#how-it-works" 
              className="text-sm text-gray-300 hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
            >{t('how-it-works')}</a>
            <a 
              href="#features" 
              className="text-sm text-gray-300 hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
            >{t('features')}</a>
            <a 
              href="#pricing" 
              className="text-sm text-gray-300 hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('pricing');
              }}
            >{t('pricing')}</a>
            <Link
              to={localPath('/diagnostic')}
              className="text-sm text-brand-magenta hover:text-white transition-colors font-medium"
            >{t('diagnostic-nav')}</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              asChild
              variant="brandSecondary"
              className="text-sm"
            >
              <a href={APP_URL}>{t('sign-in')}</a>
            </Button>
            <Button
              asChild
              className="text-sm"
            >
              <a href={APP_URL}>{t('sign-up')}</a>
            </Button>
            <LangSwitcher />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-3">
          <LangSwitcher compact />
          <button 
            className="text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#202020] shadow-lg pt-4 pb-6 px-4 border-t border-gray-700">
          <div className="flex flex-col space-y-3">
            <a 
              href="#how-it-works" 
              className="text-base text-gray-300 hover:text-white p-2 rounded-md hover:bg-[#2a2a2a]"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
                setMobileMenuOpen(false);
              }}
            >
              {t('how-it-works')}
            </a>
            <a 
              href="#features" 
              className="text-base text-gray-300 hover:text-white p-2 rounded-md hover:bg-[#2a2a2a]"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
                setMobileMenuOpen(false);
              }}
            >
              {t('features')}
            </a>
            <a 
              href="#pricing" 
              className="text-base text-gray-300 hover:text-white p-2 rounded-md hover:bg-[#2a2a2a]"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('pricing');
                setMobileMenuOpen(false);
              }}
            >
              {t('pricing')}
            </a>
            <Link
              to={localPath('/diagnostic')}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-brand-magenta hover:text-white p-2 rounded-md hover:bg-[#2a2a2a] font-medium"
            >
              {t('diagnostic-nav')}
            </Link>
            
            <div className="border-t border-gray-700 my-2"></div>
            
            <div className="flex flex-col space-y-3 pt-2">
              <Button
                asChild
                variant="brandSecondary"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <a href={APP_URL}>{t('sign-in')}</a>
              </Button>
              <Button
                asChild
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <a href={APP_URL}>{t('sign-up-free')}</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
