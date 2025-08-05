import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare, Share2, Send, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    image_url?: string;
  };
  profile?: {
    display_name: string;
    job_title?: string;
    company?: string;
    avatar_url?: string;
  };
  onPostDeleted?: () => void;
}

export const PostCard = ({ post, profile, onPostDeleted }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [post.id, user?.id]);

  const fetchLikes = async () => {
    try {
      // Get total likes
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      setLikeCount(count || 0);

      // Check if current user liked
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .single();

        setLiked(!!data);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        
        setLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await supabase
          .from("likes")
          .insert([{ post_id: post.id, user_id: user.id }]);
        
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert([{
          content: newComment.trim(),
          post_id: post.id,
          user_id: user.id,
        }]);

      if (error) throw error;

      setNewComment("");
      fetchComments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.user_id) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
      onPostDeleted?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.display_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{profile?.display_name || "Unknown User"}</div>
              <div className="text-sm text-muted-foreground">
                {profile?.job_title && profile?.company && (
                  <span>{profile.job_title} at {profile.company}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {user?.id === post.user_id && (
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt="Post image" 
              className="mt-3 rounded-lg max-w-full h-auto"
            />
          )}
        </div>

        {/* Engagement Stats */}
        {(likeCount > 0 || comments.length > 0) && (
          <div className="px-4 py-2 border-t border-b flex justify-between text-sm text-muted-foreground">
            <span>{likeCount > 0 && `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`}</span>
            <span>{comments.length > 0 && `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 py-2 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={liked ? "text-primary" : "text-muted-foreground"}
          >
            <ThumbsUp className="h-5 w-5 mr-2" />
            Like
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t">
            {/* Add Comment */}
            <div className="p-4 flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <Button 
                  size="sm" 
                  onClick={handleComment}
                  disabled={!newComment.trim() || loading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="px-4 pb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {comment.profiles?.display_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-semibold text-sm">
                        {comment.profiles?.display_name || "Unknown User"}
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ml-3">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};