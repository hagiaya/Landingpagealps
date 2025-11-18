-- Create hero_sections table
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  button_text TEXT DEFAULT 'Get Started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  project_url TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_position TEXT,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_locations table
CREATE TABLE IF NOT EXISTS client_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  estimated_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead_submissions table
CREATE TABLE IF NOT EXISTS lead_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('website', 'aplikasi', 'uiux')),
  phone_number TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT false
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Insert initial data
INSERT INTO hero_sections (title, subtitle, button_text) 
VALUES ('Solusi Digital untuk Bisnis Anda', 'Kami membantu Anda membangun website, aplikasi, dan desain UI/UX profesional', 'Hubungi Kami');

INSERT INTO services (title, description, icon_url, order_index) VALUES
('Website Development', 'Pembuatan website profesional untuk bisnis Anda', '🌐', 1),
('Aplikasi Mobile', 'Pengembangan aplikasi mobile untuk iOS dan Android', '📱', 2),
('UI/UX Design', 'Desain antarmuka pengguna yang menarik dan fungsional', '🎨', 3);

-- Enable Row Level Security
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (we'll need to adjust these based on actual auth)
CREATE POLICY "Individuals can view all content" ON hero_sections FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage hero sections" ON hero_sections FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Individuals can view partners" ON partners FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage partners" ON partners FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Individuals can view services" ON services FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage services" ON services FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Individuals can view portfolio" ON portfolio_items FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage portfolio items" ON portfolio_items FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Individuals can view testimonials" ON testimonials FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage testimonials" ON testimonials FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Individuals can view client locations" ON client_locations FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage client locations" ON client_locations FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Individuals can view projects" ON projects FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage projects" ON projects FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Individuals can view project milestones" ON project_milestones FOR SELECT
  USING (true);
  
CREATE POLICY "Admin can manage project milestones" ON project_milestones FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can submit leads" ON lead_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view lead submissions" ON lead_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

-- News table RLS policies
CREATE POLICY "Individuals can view published news" ON news FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin can manage news" ON news FOR ALL
  USING (auth.role() = 'authenticated');