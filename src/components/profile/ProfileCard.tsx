import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export const ProfileCard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [connections, setConnections] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchConnections();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchConnections = async () => {
    if (!user) return;

    try {
      const { count } = await supabase
        .from("connections")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id);

      setConnections(count || 0);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/30 relative">
          {profile.banner_url && (
            <img 
              src={profile.banner_url} 
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6 text-center -mt-8 relative">
          <Avatar className="h-16 w-16 mx-auto mb-4 border-4 border-background">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-lg">
              {profile.display_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h3 className="font-semibold text-lg">{profile.display_name}</h3>
          
          {profile.job_title && profile.company && (
            <p className="text-sm text-muted-foreground mb-2">
              {profile.job_title} at {profile.company}
            </p>
          )}

          {profile.location && (
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
          )}

          <div className="flex justify-center gap-4 text-sm mb-4">
            <div>
              <div className="font-semibold text-primary">{connections}</div>
              <div className="text-muted-foreground">Connections</div>
            </div>
          </div>

          <Button size="sm" className="w-full">
            View profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};