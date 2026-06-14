import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { BLOG_CATEGORIES } from '@/lib/blogCategories';
import { ArrowRight } from 'lucide-react';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  category: string;
  featured_image_url: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

const Blog = () => {
  const { language, t, localPath } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';
  const pageTitle = language === 'pt-BR' ? 'Blog Eluvie' : 'Eluvie Blog';
  const pageDescription = t('blog-page-description');

  useEffect(() => {
    document.title = pageTitle;
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
    setMeta('meta[name="description"]', 'content', pageDescription);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDescription);
    setMeta('meta[property="og:type"]', 'content', 'website');

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const blogUrl =
      language === 'en'
        ? 'https://www.eluvie.com/en/blog'
        : 'https://www.eluvie.com/blog';
    canonical.setAttribute('href', blogUrl);

    const setAlt = (hreflang: string, href: string) => {
      const sel = `link[rel="alternate"][hreflang="${hreflang}"]`;
      let el = document.head.querySelector(sel) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'alternate');
        el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };
    setAlt('pt-BR', 'https://www.eluvie.com/blog');
    setAlt('en', 'https://www.eluvie.com/en/blog');
    setAlt('x-default', 'https://www.eluvie.com/blog');

    let ld = document.getElementById('ld-blog') as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'ld-blog';
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: pageTitle,
      description: pageDescription,
      inLanguage: language,
      url: blogUrl,
    });
  }, [language, pageTitle, pageDescription, SITE_URL]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, short_description, category, featured_image_url, published_at, meta_title, meta_description')
        .eq('language', language)
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false });
      if (!active) return;
      if (!error && data) setPosts(data as BlogPost[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [language]);

  const categories = useMemo(() => {
    const set = new Set<string>(BLOG_CATEGORIES[language]);
    posts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [posts, language]);

  const filtered = useMemo(
    () => (activeCategory ? posts.filter((p) => p.category === activeCategory) : posts),
    [posts, activeCategory],
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Blog</h1>
            <p className="text-lg text-gray-300">{pageDescription}</p>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                activeCategory === null
                  ? 'bg-brand-gradient text-white border-transparent'
                  : 'bg-transparent text-brand-purple border-brand-purple hover:bg-brand-purple/10'
              }`}
            >
              {t('blog-all-categories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-gradient text-white border-transparent'
                    : 'bg-transparent text-brand-purple border-brand-purple hover:bg-brand-purple/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <p className="text-center text-gray-400 py-16">{t('blog-loading')}</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{t('blog-empty-state')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
              {filtered.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-xl overflow-hidden bg-[#202020] border border-gray-700 hover:border-[#8e60e5]/60 transition-all duration-300"
                >
                  <Link to={localPath(`/blog/${post.slug}`)} className="block">
                    <div className="aspect-video bg-[#2a2a2a] overflow-hidden">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#ac2ee8]/30 via-[#8e60e5]/20 to-[#5f8eea]/30" />
                      )}
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs uppercase tracking-wide text-brand-violet mb-2">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                      <Link to={localPath(`/blog/${post.slug}`)} className="hover:text-[#d64ec2] transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    {post.short_description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                        {post.short_description}
                      </p>
                    )}
                    <Link
                      to={localPath(`/blog/${post.slug}`)}
                      className="inline-flex items-center gap-1 text-sm text-white hover:text-[#d64ec2] transition-colors mt-auto"
                    >
                      {t('blog-read-article')} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;