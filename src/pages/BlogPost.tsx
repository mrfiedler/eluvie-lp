import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { getYouTubeEmbedUrl } from '@/lib/blogCategories';
import { ArrowLeft } from 'lucide-react';

type BlogPost = {
  id: string;
  slug: string;
  language: string;
  title: string;
  short_description: string | null;
  category: string;
  featured_image_url: string | null;
  content: string | null;
  youtube_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t, localPath } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug!)
        .eq('status', 'published')
        .maybeSingle();
      if (!active) return;
      setPost((data as BlogPost) ?? null);
      setLoading(false);

      if (data) {
        const { data: rel } = await supabase
          .from('blog_posts')
          .select('id, slug, language, title, short_description, category, featured_image_url, content, youtube_url, meta_title, meta_description, published_at')
          .eq('language', (data as BlogPost).language)
          .eq('status', 'published')
          .eq('category', (data as BlogPost).category)
          .neq('id', (data as BlogPost).id)
          .limit(3);
        if (active && rel) setRelated(rel as BlogPost[]);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const isEnRoute = location.pathname.startsWith('/en/');
    const canonicalPath = `${post.language === 'en' ? '/en' : ''}/blog/${post.slug}`;
    if (location.pathname !== canonicalPath && (post.language === 'en') !== isEnRoute) {
      navigate(canonicalPath, { replace: true });
    }
  }, [post, location.pathname, navigate]);

  useEffect(() => {
    if (!post) return;
    const SITE_URL = 'https://www.eluvie.com';
    const title = post.meta_title || post.title;
    const description = post.meta_description || post.short_description || '';
    document.title = title;
    document.documentElement.lang = post.language === 'pt-BR' ? 'pt-BR' : 'en';

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
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', 'article');
    if (post.featured_image_url) {
      setMeta('meta[property="og:image"]', 'content', post.featured_image_url);
    }

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const postUrl = `${SITE_URL}${post.language === 'en' ? '/en' : ''}/blog/${post.slug}`;
    canonical.setAttribute('href', postUrl);
    setMeta('meta[property="og:url"]', 'content', postUrl);

    let ld = document.getElementById('ld-article') as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'ld-article';
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description,
      inLanguage: post.language,
      image: post.featured_image_url || undefined,
      mainEntityOfPage: postUrl,
      articleSection: post.category,
      datePublished: post.published_at || undefined,
    });
  }, [post]);

  const embedUrl = post?.youtube_url ? getYouTubeEmbedUrl(post.youtube_url) : null;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <Link
                to={localPath('/blog')}
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> {t('blog-back')}
              </Link>
            </div>

            {loading ? (
              <p className="text-gray-400 py-12 text-center">{t('blog-loading')}</p>
            ) : !post ? (
              <p className="text-gray-400 py-12 text-center">{t('blog-not-found')}</p>
            ) : (
              <>
                <span className="inline-block text-xs uppercase tracking-wide text-[#d64ec2] bg-[#d64ec2]/10 border border-[#d64ec2]/30 rounded-full px-3 py-1">
                  {post.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-4">
                  {post.title}
                </h1>
                {post.short_description && (
                  <p className="text-lg text-gray-300 mb-8">{post.short_description}</p>
                )}

                {post.featured_image_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-xl mb-8 bg-[#2a2a2a]">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {embedUrl && (
                  <div className="aspect-video w-full mb-8 rounded-xl overflow-hidden">
                    <iframe
                      src={embedUrl}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}

                {post.content && (
                  <div
                    className="blog-content prose prose-lg prose-invert max-w-none prose-img:rounded-xl prose-headings:text-white prose-a:text-[#d64ec2]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}
              </>
            )}
          </div>
        </article>

        {related.length > 0 && (
          <section className="container mx-auto px-4 md:px-6 mt-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">{t('blog-related')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={localPath(`/blog/${r.slug}`)}
                    className="group flex flex-col rounded-xl overflow-hidden bg-[#202020] border border-gray-700 hover:border-[#8e60e5]/60 transition-all"
                  >
                    <div className="aspect-video bg-[#2a2a2a] overflow-hidden">
                      {r.featured_image_url ? (
                        <img
                          src={r.featured_image_url}
                          alt={r.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#ac2ee8]/30 via-[#8e60e5]/20 to-[#5f8eea]/30" />
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs uppercase tracking-wide text-[#d64ec2]">
                        {r.category}
                      </span>
                      <h3 className="text-lg font-semibold text-white mt-2 line-clamp-2 group-hover:text-[#d64ec2] transition-colors">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;