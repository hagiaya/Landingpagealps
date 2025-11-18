import { supabase } from './supabase';
import { createSupabaseServerClient, createSupabaseAdminClient } from './server-auth';
import { cache } from 'react';
import type { News, NewsComment } from './types';
import { SupabaseClient } from '@supabase/supabase-js';
export type { News, NewsComment };

// Types for our database tables
export type HeroSection = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  button_text: string;
  created_at: string;
  updated_at: string;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  project_url: string | null;
  category: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_position: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type ClientLocation = {
  id: string;
  client_name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  location_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  client_name: string;
  project_name: string;
  description: string | null;
  status: 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai';
  estimated_completion: string | null;
  created_at: string;
  updated_at: string;
  short_id?: string | null;
};

export type ProjectMilestone = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai';
  due_date: string | null;
  completed_at: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type LeadSubmission = {
  id: string;
  name: string;
  address: string;
  service_type: 'website' | 'aplikasi' | 'uiux';
  phone_number: string | null;
  project_description: string | null;
  features: string | null;  // New field for features
  budget: string | null;    // New field for budget
  submitted_at: string;
  processed: boolean;
  short_id?: string | null;
};

// Helper function to generate a unique short ID
const generateShortId = async (supabaseClient: typeof supabase): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  let isUnique = false;
  
  while (!isUnique) {
    id = '';
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const { data: leadData } = await supabaseClient
      .from('lead_submissions')
      .select('id')
      .eq('short_id', id)
      .single();

    const { data: projectData } = await supabaseClient
      .from('projects')
      .select('id')
      .eq('short_id', id)
      .single();
      
    if (!leadData && !projectData) {
      isUnique = true;
    }
  }
  
  return id;
};


// Client-side functions
export const landingPageClient = {
  // Hero section
  getHeroSection: async () => {
    const { data, error } = await supabase
      .from('hero_sections')
      .select('*')
      .limit(1);
    
    if (error) throw new Error(error.message);
    return data[0] as HeroSection | null;
  },

  // Partners
  getPartners: async () => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data as Partner[];
  },

  // Services
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data as Service[];
  },

  // Portfolio
  getPortfolioItems: async (category?: string) => {
    let query = supabase.from('portfolio_items').select('*').order('order_index', { ascending: true });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data as PortfolioItem[];
  },

  // Testimonials
  getTestimonials: async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data as Testimonial[];
  },

  // Client locations
  getClientLocations: async () => {
    const { data, error } = await supabase
      .from('client_locations')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as ClientLocation[];
  },

  // Projects
  getProjects: async (status?: string) => {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data as Project[];
  },
  
  getProjectWithMilestones: async (projectId: string) => {
    // Get project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) throw new Error(projectError.message);
    
    // Get milestones for this project
    const { data: milestones, error: milestonesError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });
    
    if (milestonesError) throw new Error(milestonesError.message);
    
    return {
      project: project as Project,
      milestones: milestones as ProjectMilestone[]
    };
  },

  // Lead submission
  submitLead: async (lead: Omit<LeadSubmission, 'id' | 'submitted_at' | 'processed' | 'short_id'>) => {
    const short_id = await generateShortId(supabase);
    const leadWithId = { ...lead, short_id };

    const { data, error } = await (supabase
      .from('lead_submissions') as any)
      .insert([leadWithId])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as LeadSubmission;
  },
  
  // News
  getNews: async (limit?: number, category?: string) => {
    try {
      let query = supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        // If the table doesn't exist, return empty array
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          return [];
        }
        throw new Error(error.message);
      }
      return data as News[];
    } catch (error: any) {
      console.warn('Error fetching news:', error.message);
      return [];
    }
  },
  
  getNewsById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();
      
      if (error) {
        // If the table doesn't exist, throw error
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          throw new Error('News table does not exist');
        }
        throw new Error(error.message);
      }
      return data as News;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};

// Server-side functions with caching
export const landingPageServer = {
  // Hero section
  getHeroSection: cache(async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      try {
        // Try to access the query builder to see if it's a real or mock client
        const query = supabase.from('hero_sections').select('*');
        if ('limit' in query) {
          const result = await query.limit(1) as any;
          if ('error' in result && result.error) {
            throw new Error(result.error.message);
          }
          return ('data' in result && Array.isArray(result.data)) ? result.data[0] as HeroSection | null : null;
        } else {
          // If the query builder doesn't have expected methods, it's likely a mock
          return null;
        }
      } catch (error) {
        // If there's an error during query execution, it might be due to missing env vars
        return null;
      }
    } else {
      // Return null during build time when using mock client
      return null;
    }
  }),

  // Partners
  getPartners: cache(async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      try {
        // Check if the query builder has the method we need
        const queryBuilder = supabase.from('partners').select('*');
        if ('order' in queryBuilder && typeof queryBuilder.order === 'function') {
          const result = await queryBuilder.order('order_index', { ascending: true });
          if ('error' in result && result.error) throw new Error(result.error.message);
          return ('data' in result && Array.isArray(result.data)) ? result.data as Partner[] : [];
        } else {
          // If order method isn't available, just select without ordering
          const { data, error } = await supabase.from('partners').select('*');
          if (error) throw new Error(error.message);
          return data as Partner[];
        }
      } catch (error) {
        // If there's an error during query execution, return empty array
        return [];
      }
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  }),

  // Services
  getServices: cache(async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      try {
        const query = realSupabase.from('services').select('*').order('order_index', { ascending: true });
        const { data, error } = await query;
        
        if (error) throw new Error(error.message);
        return data as Service[];
      } catch (error) {
        // If there's an error during query execution, return empty array
        return [];
      }
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  }),

  // Portfolio
  getPortfolioItems: cache(async (category?: string) => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      try {
        let query = realSupabase.from('portfolio_items').select('*').order('order_index', { ascending: true });
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const result = await query;
        
        if ('error' in result && result.error) throw new Error(result.error.message);
        return ('data' in result && Array.isArray(result.data)) ? result.data as PortfolioItem[] : [];
      } catch (error) {
        // If there's an error during query execution, return empty array
        return [];
      }
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  }),

  // Testimonials
  getTestimonials: cache(async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      try {
        const result = await realSupabase
          .from('testimonials')
          .select('*')
          .order('order_index', { ascending: true });
        
        if ('error' in result && result.error) throw new Error(result.error.message);
        return ('data' in result && Array.isArray(result.data)) ? result.data as Testimonial[] : [];
      } catch (error) {
        // If there's an error during query execution, return empty array
        return [];
      }
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  }),

  // Client locations
  getClientLocations: cache(async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('client_locations')
        .select('*');
      
      if (error) throw new Error(error.message);
      return data as ClientLocation[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  }),

  // Projects
  getProjects: cache(async (status?: string) => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      let query = realSupabase.from('projects').select('*').order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      return data as Project[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  }),
  
  getProjectWithMilestones: cache(async (projectId: string) => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      // Get project
      const { data: project, error: projectError } = await realSupabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (projectError) throw new Error(projectError.message);
      
      // Get milestones for this project
      const { data: milestones, error: milestonesError } = await realSupabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });
      
      if (milestonesError) throw new Error(milestonesError.message);
      
      return {
        project: project as Project,
        milestones: milestones as ProjectMilestone[]
      };
    } else {
      // Return mock data during build time when using mock client
      return {
        project: null as any, // Or a default mock Project
        milestones: [] as ProjectMilestone[]
      };
    }
  }),
  
  // Lead submissions
  getLeadSubmissions: cache(async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('lead_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as LeadSubmission[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  }),
  
  // Public content that should bypass RLS
  getPublicHeroSection: cache(async () => {
    const supabase = await createSupabaseAdminClient();
    
    if ('from' in supabase && typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('hero_sections')
        .select('*')
        .limit(1);
      
      if (error) throw new Error(error.message);
      return data[0] as HeroSection | null;
    } else {
      // Return null during build time when mock client is used
      return null;
    }
  }),
  
  // News
  getNews: cache(async (limit?: number, category?: string) => {
    try {
      const supabase = await createSupabaseServerClient();
      
      // Check if supabase client has the expected methods (not a mock)
      if (typeof supabase.from === 'function') {
        // Assert supabase as SupabaseClient to ensure correct type inference
        const realSupabase = supabase as SupabaseClient;
        let query = realSupabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
          // If the table doesn't exist, return empty array
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            return [];
          }
          throw new Error(error.message);
        }
        return data as News[];
      } else {
        // Return empty array during build time when using mock client
        return [];
      }
    } catch (error: any) {
      console.warn('Error fetching news:', error.message);
      return [];
    }
  }),
  
  getNewsById: cache(async (id: string) => {
    try {
      const supabase = await createSupabaseServerClient();
      
      // Check if supabase client has the expected methods (not a mock)
      if (typeof supabase.from === 'function') {
        // Assert supabase as SupabaseClient to ensure correct type inference
        const realSupabase = supabase as SupabaseClient;
        const { data, error } = await realSupabase
          .from('news')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();
        
        if (error) {
          // If the table doesn't exist, throw error
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            throw new Error('News table does not exist');
          }
          throw new Error(error.message);
        }
        return data as News;
      } else {
        // Return null during build time when using mock client
        return null as any; // Or a default mock News object
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }),

  // News Interaction Functions
  incrementNewsView: async (newsId: string) => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        return false; // Return default value during build/mock
      }
      const realSupabase = supabase as SupabaseClient;

      // First, check if a record already exists
      const { data: existingView, error: selectError } = await realSupabase
        .from('news_views')
        .select('view_count')
        .eq('news_id', newsId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "row not found"
        console.error('Error checking existing news view:', selectError.message);
      }

      if (existingView) {
        // If record exists, increment the view count
        const { error: updateError } = await realSupabase
          .from('news_views')
          .update({ 
            view_count: existingView.view_count + 1,
            last_viewed: new Date().toISOString()
          })
          .eq('news_id', newsId);

        if (updateError) {
          console.error('Error updating news view count:', updateError.message);
          return false;
        }
      } else {
        // If no record exists, insert a new one
        const { error: insertError } = await realSupabase
          .from('news_views')
          .insert({
            news_id: newsId,
            view_count: 1,
            last_viewed: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error inserting news view:', insertError.message);
          return false;
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error incrementing news view:', error.message);
      return false;
    }
  },

  getNewsViews: async (newsId: string) => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        return 0; // Return default value during build/mock
      }
      
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('news_views')
        .select('view_count')
        .eq('news_id', newsId)
        .single();

      if (error) {
        // If no view record exists yet, return 0
        if (error.code === 'PGRST116') {
          return 0;
        }
        console.error('Error fetching news views:', error.message);
        return 0;
      }

      return data?.view_count || 0;
    } catch (error: any) {
      console.error('Error fetching news views:', error.message);
      return 0;
    }
  },

  addNewsComment: async (newsId: string, name: string, email: string | null, content: string) => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        // In a build environment, we can't add a comment.
        // Depending on the use case, either throw or return null.
        // Returning null is safer for build process.
        return null; 
      }
      const realSupabase = supabase as SupabaseClient;

      const { data, error } = await (realSupabase
        .from('news_comments') as any)
        .insert([{
          news_id: newsId,
          name,
          email: email || null,
          content,
          is_approved: true // In a real app, you might want moderation
        }])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data?.[0];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getNewsComments: async (newsId: string) => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        return []; // Return default value during build/mock
      }
      const realSupabase = supabase as SupabaseClient;

      const { data, error } = await realSupabase
        .from('news_comments')
        .select('*')
        .eq('news_id', newsId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news comments:', error.message);
        return [];
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching news comments:', error.message);
      return [];
    }
  },

  getNewsCommentCount: async (newsId: string) => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        return 0; // Return default value during build/mock
      }
      const realSupabase = supabase as SupabaseClient;

      const { count, error } = await realSupabase
        .from('news_comments')
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId)
        .eq('is_approved', true);

      if (error) {
        console.error('Error fetching news comment count:', error.message);
        return 0;
      }

      return count || 0;
    } catch (error: any) {
      console.error('Error fetching news comment count:', error.message);
      return 0;
    }
  },

  addNewsShare: async (newsId: string, shareMethod: 'whatsapp' | 'facebook' | 'twitter' | 'telegram' | 'email' | 'copy_link') => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        return null; // Return default value during build/mock
      }
      const realSupabase = supabase as SupabaseClient;

      const { data, error } = await (realSupabase
        .from('news_shares') as any)
        .insert([{
          news_id: newsId,
          share_method: shareMethod
        }])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data?.[0];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getNewsShareCount: async (newsId: string) => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        return 0; // Return default value during build/mock
      }
      const realSupabase = supabase as SupabaseClient;

      const { count, error } = await realSupabase
        .from('news_shares')
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId);

      if (error) {
        console.error('Error fetching news share count:', error.message);
        return 0;
      }

      return count || 0;
    } catch (error: any) {
      console.error('Error fetching news share count:', error.message);
      return 0;
    }
  },

  getRelatedNews: async (currentNewsId: string, category: string | null, limit: number = 4) => {
    try {
      const supabase = await createSupabaseAdminClient();

      if (typeof supabase.from !== 'function') {
        return []; // Return default value during build/mock
      }
      const realSupabase = supabase as SupabaseClient;

      let query = realSupabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .neq('id', currentNewsId) // Exclude current news
        .limit(limit)
        .order('published_at', { ascending: false });

      // Filter by category if provided
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching related news:', error.message);
        return [];
      }

      return data as News[];
    } catch (error: any) {
      console.error('Error fetching related news:', error.message);
      return [];
    }
  }
};

// Server-side functions for admin/CRUD operations
export const adminLandingPageServer = {
  // Hero section
  getHeroSection: async () => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('hero_sections')
        .select('*')
        .limit(1);
      
      if (error) throw new Error(error.message);
      return data[0] as HeroSection | null;
    } else {
      // Return null during build time when using mock client
      return null;
    }
  },
  
  // Lead submissions
  getLeadSubmissions: async () => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('lead_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as LeadSubmission[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  },
  
  updateLeadSubmission: async (id: string, updates: Partial<LeadSubmission>) => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await (realSupabase
        .from('lead_submissions') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as LeadSubmission;
    } else {
      // Return mock data during build time when using mock client
      return null as any; // Or a default mock LeadSubmission
    }
  },
  
  deleteLeadSubmission: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { error } = await (realSupabase
        .from('lead_submissions') as any)
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return true;
    } else {
      // Return false during build time when using mock client
      return false;
    }
  },
  
  // Hero section
  updateHeroSection: async (id: string, updates: Partial<HeroSection>) => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      // Update the existing record
      const { data, error } = await (realSupabase
        .from('hero_sections') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as HeroSection;
    } else {
      // Return mock data during build time when using mock client
      return null as any; // Or a default mock HeroSection
    }
  },
  
  createHeroSection: async (heroData: Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = await createSupabaseAdminClient();
    
    if (typeof supabase.from !== 'function') {
      return null; // Cannot create during build
    }
    const realSupabase = supabase as SupabaseClient;

    const { data, error } = await (realSupabase
      .from('hero_sections') as any)
      .insert([heroData])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as HeroSection;
  },
  
  ensureHeroSection: async () => {
    const supabase = await createSupabaseAdminClient();
    
    if (typeof supabase.from !== 'function') {
      return null; // Cannot ensure during build
    }
    const realSupabase = supabase as SupabaseClient;

    // Try to get the existing hero section
    const { data: existingHero, error } = await realSupabase
      .from('hero_sections')
      .select('*')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // If there's an error other than "no rows returned"
      throw new Error(error.message);
    }
    
    // If no hero section exists, create a default one
    if (!existingHero || existingHero.length === 0) {
      const { data: newHero, error: insertError } = await (realSupabase
        .from('hero_sections') as any)
        .insert([{
          title: "Solusi Digital untuk Bisnis Anda",
          subtitle: "Kami membantu Anda membangun website, aplikasi, dan desain UI/UX profesional",
          button_text: "Hubungi Kami",
          image_url: null
        }])
        .select();
      
      if (insertError) throw new Error(insertError.message);
      return newHero?.[0] as HeroSection;
    }
    
    return existingHero[0] as HeroSection | null;
  },
  
  // Partners
  getAllPartners: async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('partners')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data as Partner[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  },
  
  createPartner: async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('partners') as any)
      .insert([partner])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as Partner;
  },
  
  updatePartner: async (id: string, updates: Partial<Partner>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('partners') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Partner;
  },
  
  deletePartner: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    
    const { error } = await (supabase
      .from('partners') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  },
  
  // Services
  getAllServices: async () => {
    const supabase = await createSupabaseServerClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data as Service[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  },
  
  createService: async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('services') as any)
      .insert([service])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as Service;
  },
  
  updateService: async (id: string, updates: Partial<Service>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('services') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Service;
  },
  
  deleteService: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    
    const { error } = await (supabase
      .from('services') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  },
  
  // Portfolio
  getAllPortfolioItems: async () => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('portfolio_items')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data as PortfolioItem[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  },
  
  createPortfolioItem: async (item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('portfolio_items') as any)
      .insert([item])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as PortfolioItem;
  },
  
  updatePortfolioItem: async (id: string, updates: Partial<PortfolioItem>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('portfolio_items') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as PortfolioItem;
  },
  
  deletePortfolioItem: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    
    const { error } = await (supabase
      .from('portfolio_items') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  },
  
  // Testimonials
  getAllTestimonials: async () => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data as Testimonial[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  },
  
  createTestimonial: async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('testimonials') as any)
      .insert([testimonial])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as Testimonial;
  },
  
  updateTestimonial: async (id: string, updates: Partial<Testimonial>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('testimonials') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Testimonial;
  },
  
  deleteTestimonial: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    
    const { error } = await (supabase
      .from('testimonials') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  },
  
  // Client locations
  getAllClientLocations: async () => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('client_locations')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as ClientLocation[];
  },
  
  createClientLocation: async (location: Omit<ClientLocation, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('client_locations') as any)
      .insert([location])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as ClientLocation;
  },
  
  updateClientLocation: async (id: string, updates: Partial<ClientLocation>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('client_locations') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as ClientLocation;
  },
  
  deleteClientLocation: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    
    const { error } = await (supabase
      .from('client_locations') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  },
  
  // Projects
  getAllProjects: async () => {
    const supabase = await createSupabaseAdminClient();
    
    // Check if supabase client has the expected methods (not a mock)
    if (typeof supabase.from === 'function') {
      // Assert supabase as SupabaseClient to ensure correct type inference
      const realSupabase = supabase as SupabaseClient;
      const { data, error } = await realSupabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as Project[];
    } else {
      // Return empty array during build time when using mock client
      return [];
    }
  },
  
  createProject: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = await createSupabaseAdminClient();
    
    const projectData = { ...project };

    // If a short_id is not provided (e.g., manual creation), generate one.
    if (!projectData.short_id) {
      projectData.short_id = await generateShortId(supabase);
    }

    const { data, error } = await (supabase
      .from('projects') as any)
      .insert([projectData])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0] as Project;
  },
  
  updateProject: async (id: string, updates: Partial<Project>) => {
    const supabase = await createSupabaseAdminClient();
    
    const { data, error } = await (supabase
      .from('projects') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Project;
  },
  
  deleteProject: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    
    const { error } = await (supabase
      .from('projects') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  },
  
  // News Management
  getAllNews: async (limit?: number, offset?: number) => {
    try {
      const supabase = await createSupabaseAdminClient();
      
      // Check if supabase client has the expected methods (not a mock)
      if (typeof supabase.from === 'function') {
        // Assert supabase as SupabaseClient to ensure correct type inference
        const realSupabase = supabase as SupabaseClient;
        let query = realSupabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        if (offset) {
          query = query.range(offset, offset + (limit || 10) - 1);
        }
        
        const { data, error } = await query;
        
        if (error) {
          // If the table doesn't exist, return empty array
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.warn('News table does not exist:', error.message);
            return [];
          }
          throw new Error(error.message);
        }
        return data as News[];
      } else {
        // Return empty array during build time when using mock client
        return [];
      }
    } catch (error: any) {
      console.warn('Error fetching news:', error.message);
      return [];
    }
  },
  
  getNewsById: async (id: string) => {
    try {
      const supabase = await createSupabaseAdminClient();
      
      const { data, error } = await (supabase
        .from('news') as any)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        // If the table doesn't exist, throw error
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          throw new Error('News table does not exist');
        }
        throw new Error(error.message);
      }
      return data as News;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  
  createNews: async (news: Omit<News, 'id' | 'published_at' | 'updated_at'>) => {
    try {
      const supabase = await createSupabaseAdminClient();
      
      const { data, error } = await (supabase
        .from('news') as any)
        .insert([{
          ...news,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        // If the table doesn't exist, throw error
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          throw new Error('News table does not exist. Please create the "news" table in your database.');
        }
        throw new Error(error.message);
      }
      return data?.[0] as News;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  
  updateNews: async (id: string, updates: Partial<News>) => {
    try {
      const supabase = await createSupabaseAdminClient();
      
      const { data, error } = await (supabase
        .from('news') as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        // If the table doesn't exist, throw error
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          throw new Error('News table does not exist');
        }
        throw new Error(error.message);
      }
      return data as News;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  
  deleteNews: async (id: string) => {
    try {
      const supabase = await createSupabaseAdminClient();
      
      const { error } = await (supabase
        .from('news') as any)
        .delete()
        .eq('id', id);
      
      if (error) {
        // If the table doesn't exist, throw error
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          throw new Error('News table does not exist');
        }
        throw new Error(error.message);
      }
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Project and Milestone Management
  getAllProjectsAndMilestones: async () => {
    try {
      const supabase = await createSupabaseAdminClient();
      
      // Check if supabase client has the expected methods (not a mock)
      if (typeof supabase.from === 'function') {
        // Assert supabase as SupabaseClient to ensure correct type inference
        const realSupabase = supabase as SupabaseClient;
        // Get all projects
        const { data: projects, error: projectsError } = await realSupabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (projectsError) {
          throw new Error(projectsError.message);
        }
        
        // Get all milestones
        const { data: milestones, error: milestonesError } = await realSupabase
          .from('project_milestones')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (milestonesError) {
          throw new Error(milestonesError.message);
        }
        
        // Group milestones by project
        const milestonesByProject: Record<string, ProjectMilestone[]> = {};
        milestones.forEach(milestone => {
          if (!milestonesByProject[milestone.project_id]) {
            milestonesByProject[milestone.project_id] = [];
          }
          milestonesByProject[milestone.project_id].push(milestone);
        });
        
        return {
          projects: projects as Project[],
          milestones: milestonesByProject
        };
      } else {
        // Return mock data during build time when using mock client
        return {
          projects: [],
          milestones: {}
        };
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};