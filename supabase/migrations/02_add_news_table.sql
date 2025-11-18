-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE,
  category TEXT
);

-- News table RLS policies
CREATE POLICY "Individuals can view published news" ON news FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin can manage news" ON news FOR ALL
  USING (auth.role() = 'authenticated');