export type News = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string;
  published_at: string;
  updated_at: string;
  is_published: boolean;
  category: string | null;
  view_count?: number;
};

export type NewsComment = {
  id: string;
  news_id: string;
  name: string;
  email: string | null;
  content: string;
  created_at: string;
  is_approved: boolean;
};
