import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const PostsList = ({ refresh }: { refresh?: number }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id (
            display_name,
            job_title,
            company,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          profile={post.profiles}
          onPostDeleted={fetchPosts}
        />
      ))}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};