
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

/**
 * Map of EN canonical path -> PT slug. Keys are what callers pass to
 * `localPath('/about')`. When the active language is PT we swap to the
 * Portuguese slug. Routes not listed here are language-neutral.
 */
export const PT_SLUGS: Record<string, string> = {
  '/about': '/sobre-nos',
  '/careers': '/carreiras',
  '/coming-soon': '/em-breve',
  '/diagnostic': '/diagnostico',
  '/privacy': '/privacidade',
  '/terms': '/termos',
  // Landing pages - EN canonical keys map to PT slugs.
  '/hourly-rate-calculator': '/calculadora-valor-hora',
  '/pricing-your-services': '/precificar-servicos',
};

const EN_FROM_PT: Record<string, string> = Object.fromEntries(
  Object.entries(PT_SLUGS).map(([en, pt]) => [pt, en]),
);

const translateToPt = (path: string): string => {
  // Match prefix so '/about/foo' -> '/sobre-nos/foo' (not used today but safe).
  for (const [en, pt] of Object.entries(PT_SLUGS)) {
    if (path === en) return pt;
    if (path.startsWith(en + '/')) return pt + path.slice(en.length);
  }
  return path;
};

const translateToEn = (path: string): string => {
  for (const [pt, en] of Object.entries(EN_FROM_PT)) {
    if (path === pt) return en;
    if (path.startsWith(pt + '/')) return en + path.slice(pt.length);
  }
  return path;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const geo = useGeolocation();

  const language: Language = isEnPath(location.pathname) ? 'en' : 'pt-BR';
  const autoRedirectDone = useRef(false);

  // First-visit auto-redirect based on BROWSER language (not IP).
  // Portuguese speakers (Brazil, Portugal, Angola, Moçambique, etc.) stay on
  // '/'. Anyone else lands on '/en'. This avoids sending Googlebot (which
  // does not set navigator.language and crawls from US IPs) into a redirect
  // loop that was polluting our canonical for '/'.
  useEffect(() => {
    if (autoRedirectDone.current) return;
    autoRedirectDone.current = true;
    if (location.pathname !== '/') return;
    const nav = (typeof navigator !== 'undefined' && (navigator.language || (navigator.languages && navigator.languages[0]))) || '';
    const isPtSpeaker = nav.toLowerCase().startsWith('pt');
    if (!isPtSpeaker) {
      navigate('/en' + location.search + location.hash, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localPath = (path: string): string => {
    if (!path) return language === 'en' ? '/en' : '/';
    // External or hash-only links are returned as-is.
    if (path.startsWith('http') || path.startsWith('#')) return path;
    if (!path.startsWith('/')) path = '/' + path;
    if (language === 'en') {
      if (path === '/') return '/en';
      // Caller may pass an EN canonical key - already English, no rewrite.
      return '/en' + path;
    }
    // PT: translate known EN slugs to their Portuguese equivalents.
    return translateToPt(path);
  };

  const setLanguage = (lang: Language) => {
    const bare = stripEn(location.pathname);
    // Convert current path between PT slugs and EN slugs as needed.
    const enCanonical = isEnPath(location.pathname) ? bare : translateToEn(bare);
    const target =
      lang === 'en'
        ? enCanonical === '/'
          ? '/en'
          : '/en' + enCanonical
        : translateToPt(enCanonical);
    // Intentionally drop location.hash: keeping it caused the page to
    // auto-scroll to the previous section after switching language.
    navigate(target + location.search);
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
