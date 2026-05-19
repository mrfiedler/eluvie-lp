
import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language } from '@/translations/types';
import translations from '@/translations';
import { useGeolocation, Currency } from '@/hooks/useGeolocation';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currency: Currency;
  /** Prepend `/en` when the current language is English. Use for every internal Link/navigate. */
  localPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const isEnPath = (pathname: string) =>
  pathname === '/en' || pathname.startsWith('/en/');

/** Strip the `/en` prefix to get the bare (PT-BR canonical) path. */
export const stripEn = (pathname: string) => {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  return pathname;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const geo = useGeolocation();

  const language: Language = isEnPath(location.pathname) ? 'en' : 'pt-BR';
  const autoRedirectDone = useRef(false);

  // First-visit auto-redirect: if the user lands on the bare PT root '/' and
  // geolocation says they are non-BR, send them to '/en' once.
  useEffect(() => {
    if (geo.loading || autoRedirectDone.current) return;
    autoRedirectDone.current = true;
    if (
      location.pathname === '/' &&
      geo.region &&
      geo.region !== 'BR'
    ) {
      navigate('/en' + location.search + location.hash, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.loading, geo.region]);

  const localPath = (path: string): string => {
    if (!path) return language === 'en' ? '/en' : '/';
    // External or hash-only links are returned as-is.
    if (path.startsWith('http') || path.startsWith('#')) return path;
    if (!path.startsWith('/')) path = '/' + path;
    if (language === 'en') {
      if (path === '/') return '/en';
      return '/en' + path;
    }
    return path;
  };

  const setLanguage = (lang: Language) => {
    const bare = stripEn(location.pathname);
    const target =
      lang === 'en' ? (bare === '/' ? '/en' : '/en' + bare) : bare;
    navigate(target + location.search + location.hash);
  };

  const t = (key: string): string => {
    const variantKey = `${key}__${geo.currency}`;
    if (translations[variantKey]) {
      return translations[variantKey][language];
    }
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, currency: geo.currency, localPath }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LanguageContext };
