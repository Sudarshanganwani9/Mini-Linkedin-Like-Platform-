// Temporary database types until Supabase types are generated
export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  job_title?: string;
  company?: string;
  location?: string;
  avatar_url?: string;
  banner_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
}

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}