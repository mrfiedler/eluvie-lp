import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage, stripEn, PT_SLUGS } from '@/contexts/LanguageContext';
import { useGeolocation } from '@/hooks/useGeolocation';

const SITE_URL = 'https://www.eluvie.com';
const OG_IMAGE = '/lovable-uploads/0da950c7-6e18-4083-8c37-72fc551f9225.png';

const META = {
  'pt-BR': {
    title: 'Eluvie - Plataforma financeira para agências, social media e estúdios criativos',
    description:
      'A Eluvie é a plataforma financeira para agências de marketing, profissionais de social media e estúdios de design — e também para freelancers criativos. Simplifique fluxo de caixa, clientes, propostas e assinaturas.',
    keywords:
      'gestão financeira para agências de marketing, gestão financeira para social media, gestão financeira para estúdios de design, agências criativas, social media, estúdios criativos, freelancer criativo, controle financeiro, contratos, assinaturas, recorrência, fluxo de caixa',
    locale: 'pt_BR',
    region: 'BR',
  },
  en: {
    title: 'Eluvie - Financial platform for marketing agencies, social media and creative studios',
    description:
      'Eluvie is the financial platform for marketing agencies, social media professionals and design studios — and creative freelancers too. Simplify cash flow, clients, proposals and subscriptions.',
    keywords:
      'financial management for marketing agencies, financial management for social media, financial management for design studios, creative agencies, social media professionals, creative studios, creative freelancer, contracts, subscriptions, recurring revenue, cash flow',
    locale: 'en_US',
    region: 'US',
  },
};

const ROUTE_META: Record<string, Record<'pt-BR' | 'en', { title: string; description: string; keywords: string }>> = {
  '/': {
    'pt-BR': {
      title: 'Eluvie - Plataforma financeira para agências, social media e estúdios criativos',
      description: 'A Eluvie ajuda agências de marketing, profissionais de social media e estúdios de design — e também freelancers criativos — a controlar finanças, clientes, propostas, contratos e assinaturas em um só lugar.',
      keywords: 'gestão financeira para agências de marketing, gestão financeira para social media, gestão financeira para estúdios de design, freelancer criativo, propostas, contratos, assinaturas',
    },
    en: {
      title: 'Eluvie - Financial platform for marketing agencies, social media and creative studios',
      description: 'Eluvie helps marketing agencies, social media professionals and design studios — and creative freelancers too — manage finances, clients, proposals, contracts and subscriptions in one place.',
      keywords: 'financial management for marketing agencies, financial management for social media, financial management for design studios, creative freelancer, proposals, contracts, subscriptions',
    },
  },
  '/sobre-nos': {
    'pt-BR': {
      title: 'Sobre a Eluvie - Finanças para criativos',
      description: 'Conheça a missão da Eluvie: simplificar a gestão financeira de agências de marketing, profissionais de social media, estúdios de design e freelancers criativos.',
      keywords: 'sobre a Eluvie, finanças para agências criativas, gestão financeira para social media, estúdios de design, freelancers criativos',
    },
    en: {
      title: 'About Eluvie - Finance for creatives',
      description: 'Learn about Eluvie’s mission to simplify financial management for marketing agencies, social media professionals, design studios and creative freelancers.',
      keywords: 'about Eluvie, finance for creative agencies, financial management for social media, design studios, creative freelancers',
    },
  },
  '/carreiras': {
    'pt-BR': {
      title: 'Carreiras na Eluvie - Trabalhe com finanças criativas',
      description: 'Veja oportunidades para construir com a Eluvie uma plataforma financeira feita para criativos.',
      keywords: 'carreiras Eluvie, vagas Eluvie, trabalhar com fintech, finanças criativas',
    },
    en: {
      title: 'Careers at Eluvie - Build creative finance tools',
      description: 'Explore opportunities to help Eluvie build financial tools for marketing agencies, social media professionals, design studios and creative freelancers.',
      keywords: 'Eluvie careers, fintech jobs, creative finance, startup jobs',
    },
  },
  '/diagnostico': {
    'pt-BR': {
      title: 'Diagnóstico financeiro grátis para criativos - Eluvie',
      description: 'Faça um diagnóstico gratuito para entender a saúde financeira do seu negócio criativo.',
      keywords: 'diagnóstico financeiro grátis, saúde financeira, agências de marketing, social media, estúdios de design, freelancers criativos',
    },
    en: {
      title: 'Free financial diagnostic for creatives - Eluvie',
      description: 'Run a free diagnostic to understand the financial health of your creative business.',
      keywords: 'free financial diagnostic, financial health, marketing agencies, social media, design studios, creative freelancers',
    },
  },
  '/privacidade': {
    'pt-BR': {
      title: 'Política de Privacidade - Eluvie',
      description: 'Entenda como a Eluvie coleta, usa e protege dados pessoais em conformidade com a LGPD.',
      keywords: 'política de privacidade Eluvie, LGPD, dados pessoais, proteção de dados',
    },
    en: {
      title: 'Privacy Policy - Eluvie',
      description: 'Understand how Eluvie collects, uses and protects personal data in its financial platform.',
      keywords: 'Eluvie privacy policy, personal data, data protection, LGPD',
    },
  },
  '/termos': {
    'pt-BR': {
      title: 'Termos de Uso - Eluvie',
      description: 'Leia os termos e condições de uso da plataforma financeira Eluvie.',
      keywords: 'termos de uso Eluvie, condições de uso, plataforma financeira',
    },
    en: {
      title: 'Terms of Use - Eluvie',
      description: 'Read the terms and conditions for using the Eluvie financial platform.',
      keywords: 'Eluvie terms of use, terms and conditions, financial platform',
    },
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
    // Pages that manage their own SEO metadata (also their /en variants).
    const bare = stripEn(location.pathname);
    if (bare.startsWith('/blog')) return;
    if (bare.startsWith('/calculadora-valor-hora')) return;
    if (bare.startsWith('/nota-fiscal-mei')) return;
    if (bare.startsWith('/precificar-servicos')) return;
    const localizedBase = META[language];
    document.documentElement.lang = language === 'pt-BR' ? 'pt-BR' : 'en';

    // Resolve the EN canonical for the current page so we can build correct
    // hreflang alternates regardless of which language slug is in the URL.
    const EN_FROM_PT: Record<string, string> = Object.fromEntries(
      Object.entries(PT_SLUGS).map(([en, pt]) => [pt, en]),
    );
    let enCanonical = bare;
    for (const [pt, en] of Object.entries(EN_FROM_PT)) {
      if (bare === pt || bare.startsWith(pt + '/')) {
        enCanonical = en + bare.slice(pt.length);
        break;
      }
    }
    const ptSlug = PT_SLUGS[enCanonical] || enCanonical;
    const routeMeta = ROUTE_META[ptSlug]?.[language] || ROUTE_META[bare]?.[language];
    const meta = routeMeta
      ? {
          ...localizedBase,
          title: routeMeta.title,
          description: routeMeta.description,
          keywords: routeMeta.keywords,
        }
      : localizedBase;
    document.title = meta.title;

    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[name="keywords"]', 'content', meta.keywords);
    const ptUrl = SITE_URL + (ptSlug === '/' ? '/' : ptSlug);
    const enUrl = SITE_URL + '/en' + (enCanonical === '/' ? '' : enCanonical);
    const selfUrl = language === 'en' ? enUrl : ptUrl;

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:locale"]', 'content', meta.locale);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:url"]', 'content', selfUrl);
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

    // Canonical (self-referencing) + hreflang alternates between PT and EN.
    setLink('canonical', selfUrl);
    setLink('alternate', ptUrl, 'pt-BR');
    setLink('alternate', enUrl, 'en');
    setLink('alternate', ptUrl, 'x-default');

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
