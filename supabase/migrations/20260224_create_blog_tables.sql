-- Blog tables for Stavky
-- Generated on 2026-02-23

-- Blog categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,           -- {en: "...", cs: "...", sk: "..."}
  description JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL,          -- {en: "...", cs: "...", sk: "..."}
  content JSONB NOT NULL,        -- {en: "...", cs: "...", sk: "..."}
  excerpt JSONB,                 -- Short description for cards/SEO
  featured_image_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title JSONB,              -- SEO title override
  meta_description JSONB,        -- SEO description
  tags TEXT[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);

-- Updated at trigger for blog_posts
DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS Policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Public read for published posts
DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

-- Admin full access (betting role)
DROP POLICY IF EXISTS "Admins can manage posts" ON public.blog_posts;
CREATE POLICY "Admins can manage posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'betting')
  );

-- Categories readable by all
DROP POLICY IF EXISTS "Public can read categories" ON public.blog_categories;
CREATE POLICY "Public can read categories" ON public.blog_categories
  FOR SELECT USING (true);

-- Admin can manage categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.blog_categories;
CREATE POLICY "Admins can manage categories" ON public.blog_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'betting')
  );

-- Seed categories
INSERT INTO public.blog_categories (slug, name, description, sort_order) VALUES
('betting-tips', '{"en": "Betting Tips", "cs": "Tipy na sázky", "sk": "Tipy na stávky"}', '{"en": "Daily betting tips and predictions", "cs": "Denní tipy a předpovědi", "sk": "Denné tipy a predikcie"}', 1),
('strategy-guides', '{"en": "Strategy Guides", "cs": "Průvodce strategiemi", "sk": "Príručky stratégií"}', '{"en": "In-depth betting strategies", "cs": "Podrobné strategie sázení", "sk": "Podrobné stratégie stávkovania"}', 2),
('match-previews', '{"en": "Match Previews", "cs": "Náhledy zápasů", "sk": "Náhľady zápasov"}', '{"en": "Pre-match analysis and predictions", "cs": "Předzápasové analýzy", "sk": "Predzápasové analýzy"}', 3),
('bankroll-management', '{"en": "Bankroll Management", "cs": "Správa bankrollu", "sk": "Správa bankrollu"}', '{"en": "Money management tips", "cs": "Tipy na správu peněz", "sk": "Tipy na správu peňazí"}', 4),
('news', '{"en": "News", "cs": "Novinky", "sk": "Novinky"}', '{"en": "Latest betting industry news", "cs": "Nejnovější zprávy", "sk": "Najnovšie správy"}', 5)
ON CONFLICT (slug) DO NOTHING;
