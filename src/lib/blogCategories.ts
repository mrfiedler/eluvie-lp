import type { Language } from '@/translations/types';

export const BLOG_CATEGORIES: Record<Language, string[]> = {
  'pt-BR': [
    'Finanças Criativas',
    'Produtividade',
    'Gestão Freelancer',
    'Negócios Criativos',
    'Fluxo de Caixa',
    'Precificação',
    'Automação',
  ],
  en: [
    'Creative Finance',
    'Productivity',
    'Freelancer Management',
    'Creative Business',
    'Cash Flow',
    'Pricing',
    'Automation',
  ],
};

type BlogCategoryDefinition = {
  key: string;
  labels: Record<Language, string>;
  aliases: string[];
};

const normalizeCategory = (input: string): string =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const BLOG_CATEGORY_DEFINITIONS: BlogCategoryDefinition[] = [
  {
    key: 'creative-finance',
    labels: { 'pt-BR': 'Finanças Criativas', en: 'Creative Finance' },
    aliases: ['creative finance', 'financas criativas', 'finanças criativas'],
  },
  {
    key: 'productivity',
    labels: { 'pt-BR': 'Produtividade', en: 'Productivity' },
    aliases: ['productivity', 'produtividade'],
  },
  {
    key: 'freelancer-management',
    labels: { 'pt-BR': 'Gestão Freelancer', en: 'Freelancer Management' },
    aliases: ['freelancer management', 'gestao freelancer', 'gestão freelancer'],
  },
  {
    key: 'creative-business',
    labels: { 'pt-BR': 'Negócios Criativos', en: 'Creative Business' },
    aliases: ['creative business', 'negocios criativos', 'negócios criativos'],
  },
  {
    key: 'cash-flow',
    labels: { 'pt-BR': 'Fluxo de Caixa', en: 'Cash Flow' },
    aliases: ['cash flow', 'fluxo de caixa'],
  },
  {
    key: 'pricing',
    labels: { 'pt-BR': 'Precificação', en: 'Pricing' },
    aliases: ['pricing', 'precificacao', 'precificação'],
  },
  {
    key: 'automation',
    labels: { 'pt-BR': 'Automação', en: 'Automation' },
    aliases: ['automation', 'automacao', 'automação'],
  },
];

export const getBlogCategoryKey = (category: string): string => {
  const normalized = normalizeCategory(category);
  const definition = BLOG_CATEGORY_DEFINITIONS.find((item) =>
    [item.labels['pt-BR'], item.labels.en, ...item.aliases].some(
      (label) => normalizeCategory(label) === normalized,
    ),
  );

  return definition?.key || normalized;
};

export const getLocalizedBlogCategory = (category: string, language: Language): string => {
  const key = getBlogCategoryKey(category);
  const definition = BLOG_CATEGORY_DEFINITIONS.find((item) => item.key === key);

  return definition?.labels[language] || category;
};

export const blogCategoriesMatch = (a: string, b: string): boolean =>
  getBlogCategoryKey(a) === getBlogCategoryKey(b);

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith('/embed/')) return url;
    }
    return null;
  } catch {
    return null;
  }
};