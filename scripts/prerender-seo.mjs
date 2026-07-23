// Runs after the Vite build and creates static HTML entry points for every
// indexable URL in sitemap.xml. This gives Google a self-referencing canonical
// before React hydrates, instead of serving the homepage head on every route.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const SITE_URL = "https://www.eluvie.com";
const DIST_DIR = resolve("dist");
const SITEMAP_PATH = resolve("public/sitemap.xml");
const INDEX_PATH = join(DIST_DIR, "index.html");
const SUPABASE_URL = "https://ocqwdmqjtegyqjclfvfm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcXdkbXFqdGVneXFqY2xmdmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTAzODUsImV4cCI6MjA2MTc4NjM4NX0.GM7THuWnszkmv0-OyeiSjKq42RcaoO09rNQxcw9sg-M";
const FALLBACK_IMAGE = `${SITE_URL}/lovable-uploads/0da950c7-6e18-4083-8c37-72fc551f9225.png`;

const STATIC_META = {
  "/": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Eluvie - Plataforma financeira para agências, social media e estúdios criativos",
    description:
      "A Eluvie ajuda agências de marketing, profissionais de social media e estúdios de design a controlar finanças, clientes, propostas, contratos e assinaturas em um só lugar.",
  },
  "/en": {
    lang: "en",
    locale: "en_US",
    title: "Eluvie - Financial platform for marketing agencies, social media and creative studios",
    description:
      "Eluvie helps marketing agencies, social media professionals and design studios manage finances, clients, proposals, contracts and subscriptions in one place.",
  },
  "/sobre-nos": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Sobre a Eluvie - Finanças para negócios criativos",
    description:
      "Conheça a missão da Eluvie: simplificar a gestão financeira de agências de marketing, profissionais de social media e estúdios de design.",
  },
  "/en/about": {
    lang: "en",
    locale: "en_US",
    title: "About Eluvie - Finance for creative businesses",
    description:
      "Learn about Eluvie's mission to simplify financial management for marketing agencies, social media professionals and design studios.",
  },
  "/carreiras": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Carreiras na Eluvie - Trabalhe com finanças criativas",
    description: "Veja oportunidades para construir com a Eluvie uma plataforma financeira feita para negócios criativos.",
  },
  "/en/careers": {
    lang: "en",
    locale: "en_US",
    title: "Careers at Eluvie - Build creative finance tools",
    description: "Explore opportunities to help Eluvie build financial tools for agencies, studios and creative teams.",
  },
  "/blog": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Blog Eluvie - Gestão financeira para negócios criativos",
    description: "Guias práticos sobre finanças, contratos, assinaturas e precificação para agências, social media e estúdios de design.",
  },
  "/en/blog": {
    lang: "en",
    locale: "en_US",
    title: "Eluvie Blog - Financial management for creative businesses",
    description: "Practical guides on finance, contracts, subscriptions and pricing for agencies, social media professionals and design studios.",
  },
  "/diagnostico": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Diagnóstico financeiro grátis para negócios criativos - Eluvie",
    description: "Faça um diagnóstico gratuito para entender a saúde financeira da sua agência, estúdio ou operação criativa.",
  },
  "/en/diagnostic": {
    lang: "en",
    locale: "en_US",
    title: "Free financial diagnostic for creative businesses - Eluvie",
    description: "Run a free diagnostic to understand the financial health of your agency, studio or creative operation.",
  },
  "/calculadora-valor-hora": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Calculadora de valor/hora para criativos | Eluvie",
    description: "Descubra quanto cobrar por hora com base nos custos reais da sua agência, estúdio ou operação criativa.",
  },
  "/en/hourly-rate-calculator": {
    lang: "en",
    locale: "en_US",
    title: "Hourly rate calculator for creative businesses | Eluvie",
    description: "Find out what to charge per hour based on the real costs of your agency, studio or creative operation.",
  },
  "/nota-fiscal-mei": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Como emitir nota fiscal MEI: guia completo 2025 | Eluvie",
    description: "Guia completo de nota fiscal MEI: passo a passo, códigos de serviço, limites e ferramenta gratuita para descobrir qual NF emitir.",
  },
  "/precificar-servicos": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Como precificar serviços criativos: guia e diagnóstico grátis | Eluvie",
    description: "Métodos de precificação para agências, social media, estúdios e criativos, com diagnóstico gratuito para descobrir qual funciona para você.",
  },
  "/en/pricing-your-services": {
    lang: "en",
    locale: "en_US",
    title: "How to price creative services: guide and free diagnostic | Eluvie",
    description: "Pricing methods for agencies, social media professionals, studios and creatives, with a free diagnostic to find what works for you.",
  },
  "/privacidade": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Política de Privacidade - Eluvie",
    description: "Entenda como a Eluvie coleta, usa e protege dados pessoais em conformidade com a LGPD.",
  },
  "/en/privacy": {
    lang: "en",
    locale: "en_US",
    title: "Privacy Policy - Eluvie",
    description: "Understand how Eluvie collects, uses and protects personal data in its financial platform.",
  },
  "/termos": {
    lang: "pt-BR",
    locale: "pt_BR",
    title: "Termos de Uso - Eluvie",
    description: "Leia os termos e condições de uso da plataforma financeira Eluvie.",
  },
  "/en/terms": {
    lang: "en",
    locale: "en_US",
    title: "Terms of Use - Eluvie",
    description: "Read the terms and conditions for using the Eluvie financial platform.",
  },
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeText = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const decodeXml = (value = "") =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const parseSitemapEntries = (xml) => {
  const entries = [];
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const body = block[1];
    const locMatch = body.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch) continue;
    const loc = decodeXml(locMatch[1]);
    const alternates = [];
    for (const alt of body.matchAll(/<xhtml:link[^>]+>/g)) {
      const tag = alt[0];
      const langMatch = tag.match(/hreflang="([^"]+)"/);
      const hrefMatch = tag.match(/href="([^"]+)"/);
      if (langMatch && hrefMatch) {
        alternates.push({ hreflang: langMatch[1], href: decodeXml(hrefMatch[1]) });
      }
    }
    entries.push({ loc, alternates });
  }
  return entries;
};

const routePathFromLoc = (loc) => {
  const pathname = new URL(loc).pathname || "/";
  if (pathname !== "/" && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
};

const outputPathForRoute = (pathname) => {
  if (pathname === "/") return INDEX_PATH;
  const safePath = pathname.replace(/^\//, "");
  return join(DIST_DIR, safePath, "index.html");
};

const setOrCreateMeta = (html, selectorRegex, tag) => {
  if (selectorRegex.test(html)) return html.replace(selectorRegex, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
};

const buildStaticRoot = (meta, entry) => {
  const isArticle = meta.type === "article";
  return [
    '<div id="root">',
    `  <main data-seo-prerender="true" style="min-height:100vh;background:#1a1a1a;color:#f5f5f5;font-family:Inter,Arial,sans-serif;padding:64px 24px;">`,
    '    <section style="max-width:760px;margin:0 auto;">',
    `      <p style="margin:0 0 16px;color:#d64ec2;font-size:14px;text-transform:uppercase;letter-spacing:.08em;">${isArticle ? "Eluvie Blog" : "Eluvie"}</p>`,
    `      <h1 style="margin:0 0 20px;font-size:42px;line-height:1.1;">${escapeText(meta.title)}</h1>`,
    `      <p style="margin:0 0 28px;color:#d1d5db;font-size:20px;line-height:1.6;">${escapeText(meta.description)}</p>`,
    `      <a href="${escapeHtml(entry.loc)}" style="color:#d64ec2;">${escapeText(entry.loc)}</a>`,
    '    </section>',
    '  </main>',
    '</div>',
  ].join("\n");
};

const replaceHead = (baseHtml, meta, entry) => {
  const alternates = entry.alternates.length
    ? entry.alternates
    : [{ hreflang: meta.lang === "en" ? "en" : "pt-BR", href: entry.loc }];
  const alternateTags = alternates
    .map((alt) => `    <link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}" />`)
    .join("\n");

  let html = baseHtml
    .replace(/<html[^>]*>/i, `<html lang="${escapeHtml(meta.lang)}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(meta.title)}</title>`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(entry.loc)}" />`)
    .replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>\n?/gi, "\n")
    .replace(/<link rel="canonical"[^>]*>\s*/i, (match) => `${match}${alternateTags}\n`);

  html = setOrCreateMeta(html, /<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`);
  html = setOrCreateMeta(html, /<meta name="robots"[^>]*>/i, '<meta name="robots" content="index, follow" />');
  html = setOrCreateMeta(html, /<meta name="googlebot"[^>]*>/i, '<meta name="googlebot" content="index, follow" />');
  html = setOrCreateMeta(html, /<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  html = setOrCreateMeta(html, /<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  html = setOrCreateMeta(html, /<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHtml(entry.loc)}" />`);
  html = setOrCreateMeta(html, /<meta property="og:type"[^>]*>/i, `<meta property="og:type" content="${meta.type === "article" ? "article" : "website"}" />`);
  html = setOrCreateMeta(html, /<meta property="og:locale"[^>]*>/i, `<meta property="og:locale" content="${escapeHtml(meta.locale)}" />`);
  html = setOrCreateMeta(html, /<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(meta.image || FALLBACK_IMAGE)}" />`);
  html = setOrCreateMeta(html, /<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  html = setOrCreateMeta(html, /<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);
  html = setOrCreateMeta(html, /<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(meta.image || FALLBACK_IMAGE)}" />`);
  html = html.replace(/<div id="root"><\/div>/i, buildStaticRoot(meta, entry));

  return html;
};

const fetchBlogPosts = async () => {
  const endpoint = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,language,title,short_description,meta_title,meta_description,featured_image_url&status=eq.published`;
  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[seo-prerender] blog metadata fetch failed: ${err?.message ?? err}`);
    return [];
  }
};

const buildBlogMetaMap = (posts) => {
  const map = new Map();
  for (const post of posts) {
    const isEn = post.language === "en";
    const path = `${isEn ? "/en" : ""}/blog/${post.slug}`;
    map.set(path, {
      lang: isEn ? "en" : "pt-BR",
      locale: isEn ? "en_US" : "pt_BR",
      title: post.meta_title || post.title || "Eluvie Blog",
      description: post.meta_description || post.short_description || "Artigo da Eluvie sobre gestão financeira para negócios criativos.",
      image: post.featured_image_url || FALLBACK_IMAGE,
      type: "article",
    });
  }
  return map;
};

async function main() {
  const baseHtml = readFileSync(INDEX_PATH, "utf8");
  const sitemap = readFileSync(SITEMAP_PATH, "utf8");
  const entries = parseSitemapEntries(sitemap).filter((entry) => entry.loc.startsWith(SITE_URL));
  const blogMeta = buildBlogMetaMap(await fetchBlogPosts());
  let written = 0;

  for (const entry of entries) {
    const pathname = routePathFromLoc(entry.loc);
    const lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt-BR";
    const meta = blogMeta.get(pathname) || STATIC_META[pathname] || {
      lang,
      locale: lang === "en" ? "en_US" : "pt_BR",
      title: lang === "en" ? STATIC_META["/en"].title : STATIC_META["/"].title,
      description: lang === "en" ? STATIC_META["/en"].description : STATIC_META["/"].description,
    };
    const out = outputPathForRoute(pathname);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, replaceHead(baseHtml, meta, entry));
    written += 1;
  }

  console.log(`[seo-prerender] wrote ${written} static HTML entry points`);
}

main();