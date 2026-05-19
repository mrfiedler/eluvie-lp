import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SITE_URL = 'https://www.eluvie.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type StaticRoute = { path: string; priority: string; changefreq: string; bilingual?: boolean };

// `bilingual: true` => emit a `/en` mirror entry. PT-targeted LPs stay single-language.
const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly', bilingual: true },
  { path: '/about', priority: '0.8', changefreq: 'monthly', bilingual: true },
  { path: '/blog', priority: '0.8', changefreq: 'weekly', bilingual: true },
  { path: '/diagnostic', priority: '0.8', changefreq: 'monthly', bilingual: true },
  { path: '/calculadora-valor-hora', priority: '0.9', changefreq: 'monthly' },
  { path: '/nota-fiscal-mei', priority: '0.9', changefreq: 'monthly' },
  { path: '/precificar-servicos', priority: '0.9', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.6', changefreq: 'yearly', bilingual: true },
  { path: '/terms', priority: '0.6', changefreq: 'yearly', bilingual: true },
];

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string)
  );

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, language, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;

    const seen = new Set<string>();
    const urls: string[] = [];

    const altLinks = (ptPath: string) =>
      [
        `<xhtml:link rel="alternate" hreflang="pt-BR" href="${escapeXml(SITE_URL + ptPath)}" />`,
        `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(SITE_URL + '/en' + (ptPath === '/' ? '' : ptPath))}" />`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(SITE_URL + ptPath)}" />`,
      ].join('');

    for (const route of STATIC_ROUTES) {
      const ptLoc = `${SITE_URL}${route.path}`;
      seen.add(ptLoc);
      const alts = route.bilingual ? altLinks(route.path) : '';
      urls.push(
        `  <url><loc>${escapeXml(ptLoc)}</loc><priority>${route.priority}</priority><changefreq>${route.changefreq}</changefreq>${alts}</url>`
      );
      if (route.bilingual) {
        const enLoc = `${SITE_URL}/en${route.path === '/' ? '' : route.path}`;
        seen.add(enLoc);
        urls.push(
          `  <url><loc>${escapeXml(enLoc)}</loc><priority>${(parseFloat(route.priority) - 0.1).toFixed(1)}</priority><changefreq>${route.changefreq}</changefreq>${altLinks(route.path)}</url>`
        );
      }
    }

    // Blog posts: per-language. Posts are stored with a `language` field, so each post is single-language.
    for (const p of posts ?? []) {
      const isEn = (p.language as string) === 'en';
      const loc = `${SITE_URL}${isEn ? '/en' : ''}/blog/${p.slug}`;
      if (seen.has(loc)) continue;
      seen.add(loc);
      const lastmod = (p.updated_at ?? p.published_at) as string | null;
      const lastmodTag = lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '';
      urls.push(
        `  <url><loc>${escapeXml(loc)}</loc>${lastmodTag}<priority>0.6</priority><changefreq>monthly</changefreq></url>`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
      status: 200,
    });
  } catch (err) {
    console.error('generate-sitemap error', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});