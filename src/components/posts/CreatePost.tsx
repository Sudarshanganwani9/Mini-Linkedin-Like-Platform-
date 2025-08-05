import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Video, Calendar, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("posts")
        .insert([
          {
            content: content.trim(),
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      setContent("");
      toast({
        title: "Post created",
        description: "Your post has been shared successfully.",
      });
      onPostCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-0 resize-none p-0 min-h-[80px] text-base placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Image className="h-5 w-5 mr-2" />
              Photo
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Video className="h-5 w-5 mr-2" />
              Video
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Calendar className="h-5 w-5 mr-2" />
              Event
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            size="sm"
            className="rounded-full px-6"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};