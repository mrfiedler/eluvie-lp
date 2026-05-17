import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGeolocation } from '@/hooks/useGeolocation';

const SITE_URL = 'https://www.eluvie.com';
const OG_IMAGE = '/lovable-uploads/0da950c7-6e18-4083-8c37-72fc551f9225.png';

const META = {
  'pt-BR': {
    title: 'Eluvie - Plataforma financeira para profissionais criativos',
    description:
      'A Eluvie é uma plataforma de gestão financeira feita por criativos, para criativos. Simplifique fluxo de caixa, orçamentos, clientes e assinaturas.',
    keywords:
      'gestão financeira, freelancer, criativos, agência, estúdio, controle financeiro, contratos, assinaturas, recorrência, fluxo de caixa',
    locale: 'pt_BR',
    region: 'BR',
  },
  en: {
    title: 'Eluvie - Financial platform for creative professionals',
    description:
      'Eluvie is a financial management platform built by creatives, for creatives. Simplify cash flow, budgets, clients and subscriptions.',
    keywords:
      'financial management, freelancer, creative professionals, agency, studio, contracts, subscriptions, recurring revenue, cash flow',
    locale: 'en_US',
    region: 'US',
  },
};

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    const [type, name] = selector.replace(/[\[\]"]/g, '').split('=');
    el.setAttribute(type, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setLink = (rel: string, href: string, hreflang?: string) => {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.head.querySelector(sel) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const setJsonLd = (id: string, data: object) => {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

const SEO = () => {
  const { language, currency } = useLanguage();
  const geo = useGeolocation();
  const location = useLocation();

  useEffect(() => {
    // Pages that manage their own SEO metadata
    if (location.pathname.startsWith('/blog')) return;
    if (location.pathname.startsWith('/calculadora-valor-hora')) return;
    if (location.pathname.startsWith('/nota-fiscal-mei')) return;
    if (location.pathname.startsWith('/precificar-servicos')) return;
    const meta = META[language];
    document.documentElement.lang = language === 'pt-BR' ? 'pt-BR' : 'en';
    document.title = meta.title;

    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[name="keywords"]', 'content', meta.keywords);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:locale"]', 'content', meta.locale);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:url"]', 'content', SITE_URL);
    setMeta('meta[property="og:image"]', 'content', SITE_URL + OG_IMAGE);

    // Twitter
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    setMeta('meta[name="twitter:image"]', 'content', SITE_URL + OG_IMAGE);

    // Indexing directives
    setMeta('meta[name="robots"]', 'content', 'index, follow');
    setMeta('meta[name="googlebot"]', 'content', 'index, follow');

    // Geo / region hints for search engines
    setMeta('meta[name="geo.region"]', 'content', geo.countryCode || meta.region);
    setMeta('meta[name="language"]', 'content', language);

    // Canonical + hreflang alternates
    setLink('canonical', SITE_URL);
    setLink('alternate', SITE_URL, 'pt-BR');
    setLink('alternate', SITE_URL, 'en');
    setLink('alternate', SITE_URL, 'x-default');

    // Structured data (Organization + SoftwareApplication with localized prices)
    const priceMap: Record<string, { standard: string; studio: string }> = {
      BRL: { standard: '73.50', studio: '129' },
      USD: { standard: '59', studio: '99' },
      EUR: { standard: '57', studio: '99' },
    };
    const prices = priceMap[currency];

    setJsonLd('ld-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Eluvie',
      url: SITE_URL,
      logo: SITE_URL + '/lovable-uploads/71cb45b1-b5a7-46d1-bb08-c0c67a64d10e.png',
      description: meta.description,
    });

    setJsonLd('ld-software', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Eluvie',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: language,
      description: meta.description,
      offers: [
        {
          '@type': 'Offer',
          name: 'Solo',
          price: '0',
          priceCurrency: currency,
        },
        {
          '@type': 'Offer',
          name: 'Standard',
          price: prices.standard,
          priceCurrency: currency,
        },
        {
          '@type': 'Offer',
          name: 'Studio',
          price: prices.studio,
          priceCurrency: currency,
        },
      ],
    });
  }, [language, currency, geo.countryCode, location.pathname]);

  return null;
};

export default SEO;
