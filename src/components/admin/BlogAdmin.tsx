import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash, Edit, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BLOG_CATEGORIES, getLocalizedBlogCategory, slugify } from '@/lib/blogCategories';
import type { Language } from '@/translations/types';

type Status = 'draft' | 'published';

type BlogPost = {
  id: string;
  language: Language;
  slug: string;
  category: string;
  title: string;
  short_description: string | null;
  featured_image_url: string | null;
  content: string | null;
  youtube_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: Status;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type FormState = {
  id?: string;
  language: Language;
  slug: string;
  category: string;
  title: string;
  short_description: string;
  featured_image_url: string;
  content: string;
  youtube_url: string;
  meta_title: string;
  meta_description: string;
  status: Status;
};

const emptyForm = (lang: Language): FormState => ({
  language: lang,
  slug: '',
  category: BLOG_CATEGORIES[lang][0],
  title: '',
  short_description: '',
  featured_image_url: '',
  content: '',
  youtube_url: '',
  meta_title: '',
  meta_description: '',
  status: 'draft',
});

const BlogAdmin = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Language>('pt-BR');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setPosts((data as BlogPost[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = useMemo(() => posts.filter((p) => p.language === tab), [posts, tab]);

  const startNew = () => setEditing(emptyForm(tab));
  const startEdit = (p: BlogPost) =>
    setEditing({
      id: p.id,
      language: p.language,
      slug: p.slug,
      category: getLocalizedBlogCategory(p.category, p.language),
      title: p.title,
      short_description: p.short_description || '',
      featured_image_url: p.featured_image_url || '',
      content: p.content || '',
      youtube_url: p.youtube_url || '',
      meta_title: p.meta_title || '',
      meta_description: p.meta_description || '',
      status: p.status,
    });

  const handleSave = async () => {
    if (!editing) return;
    const slug = editing.slug.trim() || slugify(editing.title);
    if (!editing.title.trim() || !slug) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Title and slug are required.' });
      return;
    }
    const payload = {
      language: editing.language,
      slug,
      category: editing.category,
      title: editing.title,
      short_description: editing.short_description || null,
      featured_image_url: editing.featured_image_url || null,
      content: editing.content || null,
      youtube_url: editing.youtube_url || null,
      meta_title: editing.meta_title || null,
      meta_description: editing.meta_description || null,
      status: editing.status,
      published_at:
        editing.status === 'published' ? new Date().toISOString() : null,
    };

    const { error } = editing.id
      ? await supabase.from('blog_posts').update(payload).eq('id', editing.id)
      : await supabase.from('blog_posts').insert(payload);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      return;
    }
    toast({ title: 'Saved', description: 'Post saved successfully.' });
    setEditing(null);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Deleted' });
      fetchPosts();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error } = await supabase.storage.from('blog-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
    } else {
      const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
      setEditing({ ...editing, featured_image_url: data.publicUrl });
      toast({ title: 'Image uploaded' });
    }
    setUploading(false);
  };

  return (
    <Card className="bg-[#202020] border-gray-700">
      <CardHeader>
        <CardTitle>Blog Posts</CardTitle>
        <CardDescription>Manage multilingual blog content. Posts auto-display by site language.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as Language)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="pt-BR">Portuguese</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <Button
              onClick={startNew}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" /> New Post
            </Button>
          </div>

          {(['pt-BR', 'en'] as Language[]).map((lng) => (
            <TabsContent key={lng} value={lng}>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.title}</TableCell>
                          <TableCell className="text-gray-400">/{p.slug}</TableCell>
                          <TableCell>{getLocalizedBlogCategory(p.category, p.language)}</TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                p.status === 'published'
                                  ? 'bg-green-900/40 text-green-300'
                                  : 'bg-yellow-900/40 text-yellow-300'
                              }`}
                            >
                              {p.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500">
                            No posts in this language.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {editing && (
          <Card className="bg-[#1a1a1a] border-gray-700">
            <CardHeader>
              <CardTitle>{editing.id ? 'Edit Post' : 'New Post'}</CardTitle>
              <CardDescription>
                Language: {editing.language === 'pt-BR' ? 'Portuguese' : 'English'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <select
                    value={editing.language}
                    onChange={(e) => {
                      const lang = e.target.value as Language;
                      setEditing({
                        ...editing,
                        language: lang,
                        category: getLocalizedBlogCategory(editing.category, lang),
                      });
                    }}
                    className="w-full bg-[#202020] border border-gray-700 rounded-md p-2 text-white"
                  >
                    <option value="pt-BR">Portuguese</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as Status })}
                    className="w-full bg-[#202020] border border-gray-700 rounded-md p-2 text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="bg-[#202020] border-gray-700"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder={slugify(editing.title)}
                    className="bg-[#202020] border-gray-700"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-[#202020] border border-gray-700 rounded-md p-2 text-white"
                  >
                    {BLOG_CATEGORIES[editing.language].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Short description</Label>
                <Textarea
                  value={editing.short_description}
                  onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                  rows={2}
                  className="bg-[#202020] border-gray-700"
                />
              </div>

              <div>
                <Label>Featured image</Label>
                <div className="flex gap-2">
                  <Input
                    value={editing.featured_image_url}
                    onChange={(e) => setEditing({ ...editing, featured_image_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-[#202020] border-gray-700"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 rounded-md bg-[#202020] border border-gray-700 hover:bg-[#2a2a2a] text-sm">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {editing.featured_image_url && (
                  <img
                    src={editing.featured_image_url}
                    alt="preview"
                    className="mt-3 max-h-40 rounded-md border border-gray-700"
                  />
                )}
              </div>

              <div>
                <Label>YouTube URL (optional)</Label>
                <Input
                  value={editing.youtube_url}
                  onChange={(e) => setEditing({ ...editing, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-[#202020] border-gray-700"
                />
              </div>

              <div>
                <Label>Content (HTML / rich text)</Label>
                <Textarea
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={14}
                  className="bg-[#202020] border-gray-700 font-mono text-sm"
                  placeholder={'<p>Your article content. Use <img src=\"...\" /> for inline images and standard HTML tags.</p>'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use HTML tags. Inline images: &lt;img src="..." /&gt;. Headings: &lt;h2&gt;...&lt;/h2&gt;.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <Label>Meta title (SEO)</Label>
                  <Input
                    value={editing.meta_title}
                    onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                    className="bg-[#202020] border-gray-700"
                  />
                </div>
                <div>
                  <Label>Meta description (SEO)</Label>
                  <Input
                    value={editing.meta_description}
                    onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                    className="bg-[#202020] border-gray-700"
                  />
                </div>
              </div>

              <Alert className="bg-blue-900/20 border-blue-800">
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription className="text-sm text-gray-300">
                  Posts marked as "published" appear instantly on /blog in their selected language.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-brand-gradient hover:opacity-90 transition-opacity"
              >
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)} className="bg-transparent border-gray-700">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogAdmin;