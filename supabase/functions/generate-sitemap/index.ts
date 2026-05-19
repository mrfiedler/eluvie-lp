import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SITE_URL = 'https://www.eluvie.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type StaticRoute = {
  /** PT slug (mounted at '/'). Pass null for PT-only single-language pages. */
  ptPath: string;
  /** EN slug (mounted under '/en'). Omit for pages without an EN version. */
  enPath?: string;
  priority: string;
  changefreq: string;
};

const STATIC_ROUTES: StaticRoute[] = [
  { ptPath: '/', enPath: '/', priority: '1.0', changefreq: 'weekly' },
  { ptPath: '/sobre-nos', enPath: '/about', priority: '0.8', changefreq: 'monthly' },
  { ptPath: '/carreiras', enPath: '/careers', priority: '0.6', changefreq: 'monthly' },
  { ptPath: '/blog', enPath: '/blog', priority: '0.8', changefreq: 'weekly' },
  { ptPath: '/diagnostico', enPath: '/diagnostic', priority: '0.8', changefreq: 'monthly' },
  { ptPath: '/calculadora-valor-hora', priority: '0.9', changefreq: 'monthly' },
  { ptPath: '/nota-fiscal-mei', priority: '0.9', changefreq: 'monthly' },
  { ptPath: '/precificar-servicos', priority: '0.9', changefreq: 'monthly' },
  { ptPath: '/privacidade', enPath: '/privacy', priority: '0.6', changefreq: 'yearly' },
  { ptPath: '/termos', enPath: '/terms', priority: '0.6', changefreq: 'yearly' },
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

    const altLinks = (ptPath: string, enPath: string) =>
      [
        `<xhtml:link rel="alternate" hreflang="pt-BR" href="${escapeXml(SITE_URL + ptPath)}" />`,
        `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(SITE_URL + '/en' + (enPath === '/' ? '' : enPath))}" />`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(SITE_URL + ptPath)}" />`,
      ].join('');

    for (const route of STATIC_ROUTES) {
      const ptLoc = `${SITE_URL}${route.ptPath}`;
      seen.add(ptLoc);
      const alts = route.enPath ? altLinks(route.ptPath, route.enPath) : '';
      urls.push(
        `  <url><loc>${escapeXml(ptLoc)}</loc><priority>${route.priority}</priority><changefreq>${route.changefreq}</changefreq>${alts}</url>`
      );
      if (route.enPath) {
        const enLoc = `${SITE_URL}/en${route.enPath === '/' ? '' : route.enPath}`;
        seen.add(enLoc);
        urls.push(
          `  <url><loc>${escapeXml(enLoc)}</loc><priority>${(parseFloat(route.priority) - 0.1).toFixed(1)}</priority><changefreq>${route.changefreq}</changefreq>${altLinks(route.ptPath, route.enPath)}</url>`
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