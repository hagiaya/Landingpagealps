-- Create news_views table to track view counts
CREATE TABLE IF NOT EXISTS news_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 1,
  last_viewed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to support upsert
ALTER TABLE news_views 
ADD CONSTRAINT news_views_news_id_key 
UNIQUE (news_id);

-- Create news_comments table
CREATE TABLE IF NOT EXISTS news_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT FALSE
);

-- Create news_shares table
CREATE TABLE IF NOT EXISTS news_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  share_method TEXT CHECK (share_method IN ('whatsapp', 'facebook', 'twitter', 'telegram', 'email', 'copy_link')),
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create aggregated view for news metrics
CREATE OR REPLACE VIEW news_metrics AS
SELECT 
  n.id,
  COALESCE(v.view_count, 0) as view_count,
  COALESCE(c.comment_count, 0) as comment_count,
  COALESCE(s.share_count, 0) as share_count
FROM news n
LEFT JOIN (
  SELECT news_id, view_count FROM news_views
) v ON n.id = v.news_id
LEFT JOIN (
  SELECT news_id, COUNT(*) as comment_count FROM news_comments WHERE is_approved = true GROUP BY news_id
) c ON n.id = c.news_id
LEFT JOIN (
  SELECT news_id, COUNT(*) as share_count FROM news_shares GROUP BY news_id
) s ON n.id = s.news_id;

-- RLS policies for news interaction tables
CREATE POLICY "Users can view news comments" ON news_comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can post news comments" ON news_comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view news shares" ON news_shares FOR SELECT
  USING (true);

CREATE POLICY "Users can record news shares" ON news_shares FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view news views" ON news_views FOR SELECT
  USING (true);

CREATE POLICY "Users can update news views" ON news_views FOR INSERT
  WITH CHECK (true);